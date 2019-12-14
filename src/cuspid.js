'use strict';

const Stats = require('./vendor/threejs/stats.min');
const _ = require('lodash');
const THREE = require('three');
const ImageLoader = require('./image-loader');
const VideoLoader = require('./video-loader');
const cuspidShader = require('./cuspid-shader');
const Animator = require('./Animator');
const TwoQuadBoxScrollAnimation = require('./anim-twoquadboxscroll');
//const ExperimentalAnimation = require('./anim-experiment')
const ZoomSeqAnimation = require('./anim-zoomer-seq')
const ZoomAnimation = require('./anim-zoomer')
const ImageSequence = require('./anim-image-sequence');
const KeyHandler = require('./key-handler');
const EventActions = require('./event-actions');
const wsEvents = require('./ws-events');
const gui = require('./gui');
// const QuadsBuilder = require('./quads-builder');

var animator = null;

// ThreeJS variables
var scene, camera, renderer;
var quads = [];
var textures = [];
var texture;
var stats;

// const IMAGE_URLS = ['/static/cuspid.jpg', '/static/corpse001.jpg', '/static/bloody20sunday.jpg', '/static/chupacabra001.jpg'];
// const xIMAGE_URLS = ['/static/cuspid.jpg'];
// const IMAGE_URLS = ['/static/tornado_carnage.jpg', '/static/needle_things.jpg', '/static/winter_trees.mp4'];
const IMAGE_URLS = ['/static/cuspid.jpg', '/static/tornado_carnage.jpg', '/static/needle_things.jpg',
	'/static/cows01.jpg', '/static/bloody20sunday.jpg', '/static/surgical_implements.jpg',
	'/static/winter_trees.mp4'];
// const IMAGE_URLS = ['/static/cuspid.jpg', '/static/tornado_carnage.jpg', '/static/needle_things.jpg'];

// const IMAGE_URLS = [
// 	'/static/t/z447p782.jpg',
// 	'/static/t/z46my5u6.jpg',
// 	'/static/t/z5apqesm.jpg',
// 	'/static/t/z5qkxmk4.jpg',
// 	'/static/t/z5r9kh2u.jpg',
// 	'/static/t/z8jhy9hw.jpg',
// 	'/static/t/z9n6pe2b.jpg',
// 	'/static/t/z9td69vw.jpg',
// 	'/static/t/z9zuzaag.jpg',
// 	'/static/t/zcap6hzq.jpg',
// 	'/static/t/zd33khde.jpg',
// 	'/static/t/zd5crhcd.jpg',
// 	'/static/t/zfathe2r.jpg',
// 	'/static/t/zfd2e6md.jpg',
// 	'/static/t/zk88rs6x.jpg',
// 	'/static/t/zmuqxzc3.jpg',
// 	'/static/t/zpfky38b.jpg',
// 	'/static/t/zv4322cb.jpg',
// 	'/static/t/zvddb44f.jpg',
// 	'/static/t/zwxz4eq9.jpg']

async function cuspidLoad(){
	createStats();
	init3D();
	window.onresize = function(event){
		setRenderSize();
	}
	setRenderSize();
	try {
		const newAnimator = await startFirstAnimation();
		animator = newAnimator;
		const eventActions = new EventActions(scene, camera, animator, textures, stats, renderer, quads);
		const keyHandler = new KeyHandler(eventActions);

		configureControlSocket(eventActions);

		document.querySelector('body').addEventListener('keydown', event => keyHandler.handleKey(event));
		gui.showHideDecoration(false);
		console.log("Animation started.")
	}
	catch(err) {
		console.log(`ERROR: ${err}`);
	}
}

function configureControlSocket(eventActions){
	const randomId = _.random(0, 1000000000).toString(16);
	const clientId = `client-${randomId}`;

	gui.wsSetClientId(clientId);

	let controlSocket = new wsEvents.ControlSocket(eventActions, clientId);
	controlSocket.connect();

	document.querySelector('button#changeClientId').addEventListener('click', () => {
		const newClientId = document.querySelector('input#clientUid').value;
		console.log(`Setting up client id ${newClientId}`);
		controlSocket.disconnect();
		controlSocket = new wsEvents.ControlSocket(eventActions, newClientId);
		controlSocket.connect();
	});
}

function createStats(){
  // FPS stats
	stats = new Stats();
	stats.domElement.style.display = 'none';	// start hidden
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );
}

function init3D(){
	// Create 3D scene using OrthographicCamera, which looks 'flat' (no perspective).
	// Set the viewport to expand from the origin, 1.0 in each cardinal direction.
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -100, 100 );	// left, right, top, bottom, near, far
	const canvas = document.querySelector('#cnv');

	renderer = new THREE.WebGLRenderer({
		antialias: false,
		precision: 'mediump',
		canvas: canvas,
		autoClear: false
	});
}

function setRenderSize(){
	let w = window.innerWidth - 10;
	let h = window.innerHeight - 10;

	// ThreeJS steals the context, can't set the size manually.
	// Instead, use renderer.setSize (see below).
	if(renderer) {	// sanity check
		renderer.setSize( w, h );
	}
}

async function startFirstAnimation(){
	console.log("Starting animation");
	const texturesAndQuads = await loadTexturesAndQuadsFromUrls(IMAGE_URLS);
	quads = texturesAndQuads.quads;
	textures = texturesAndQuads.textures;

	console.log(`Loaded ${quads.length} quads`);
	quads.forEach(q => scene.add(q));
	const animator = new Animator({
		renderer: renderer,
		stats: stats,
		scene: scene,
		camera: camera,
		duration: Animator.defaultAnimDuration(),
		jerkiness: 5,
		animation: ImageSequence.build(quads)
		// animation: new ExperimentalAnimation(quads,5)
		// animation: new ZoomAnimation(quads, 'IN', 'LINEAR')
		// animation: new ZoomSeqAnimation(quads, 'OUT', 5)
		// animation: TwoQuadBoxScrollAnimation.scrollRight(quads, 5)
		//		animation: new BoxScrollAnimation(quad, "RIGHT", 5)
		/*new CompositeAnimation([
			new BoxScrollAnimation(quad, "LEFT", 5),
			new PaletteAnimation(quad, 'DOWN', 0.5),
			new ZoomAnimation.zoomIn(quad, 5)
		])*/
	});
	// animator.options.animation.quad = quads[0];
	animator.start();
	return animator;
}


async function loadTexturesAndQuadsFromUrls(sourceUrls){
	try {
		const textures = await loadTexturesFromUrls(sourceUrls);
		// ...
		const quads = textures.map(texture => buildQuad(texture))
			.filter(x => x != null);
		return {
			quads: (quads.length > 1) ? quads : [quads[0], quads[0]],
			textures: textures
		};
	}
	catch(err){
		console.error(`ERROR: ${err}`);
	}
}

async function loadTexturesFromUrls(sourceUrls){
	return Promise.all(
			sourceUrls.map(url => {
				const loader = chooseLoader(url);
				const textureBuilder = chooseTextureBuilder(url);
				return loader(url).then(textureBuilder);
						// .then(image => textureBuilder(image))
			})
	);
}

function chooseLoader(url){
	return isVideo(url) ?
		VideoLoader.load :
	 	ImageLoader.loadAndCrop;
}

function chooseTextureBuilder(url){
	return isVideo(url) ?
		buildVideoTexture :
	 	buildImageTexture;
}

function isVideo(url){
	return url.endsWith('.webm') || url.endsWith('.ogv') || url.endsWith('.mp4');
}

function buildImageTexture(image){
	const wrap = THREE.ClampToEdgeWrapping; //THREE.RepeatWrapping;
	const texture = new THREE.Texture(image, THREE.UVMapping, wrap, wrap,
		THREE.LinearFilter, THREE.LinearFilter,
		THREE.LuminanceFormat);
	texture.needsUpdate = true;
	return texture;
}

function buildVideoTexture(video){
	const wrap = THREE.ClampToEdgeWrapping;
	const texture = new THREE.VideoTexture(
		video, THREE.UVMapping, wrap, wrap,
		THREE.LinearFilter, THREE.LinearFilter,
		THREE.LuminanceFormat
	 );
	texture.needsUpdate = true;
	return texture;
}

function buildQuad(texture){
	// Width & height are both 2.0, to completely fill our viewport (-1.0...1.0)
	const quadGeom = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
	const quadMaterial = cuspidShader.createCuspidShaderMaterial( texture );
	return new THREE.Mesh( quadGeom, quadMaterial );
}

if (document.readyState != 'loading'){
  cuspidLoad();
}
else{
	document.addEventListener('DOMContentLoaded', cuspidLoad);
}
