'use strict';

const Stats = require('./vendor/threejs/stats.min');
const $ = require('jquery');
const _ = require('lodash');
const THREE = require('three');
const ImageLoader = require('./image-loader');
const VideoLoader = require('./video-loader');
const cuspidShader = require('./cuspid_shader');
const Animator = require('./Animator');
const TwoQuadBoxScrollAnimation = require('./anim-twoquadboxscroll');
const ExperimentalAnimation = require('./anim-experiment')
const ZoomSeqAnimation = require('./anim-zoomer-seq')
const ZoomAnimation = require('./anim-zoomer')
const ImageSequence = require('./anim-image-sequence');
const KeyHandler = require('./key_handler');
const EventActions = require('./event_actions');
const wsEvents = require('./ws-events');
const gui = require('./gui');

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
'/static/cows01.jpg', '/static/bloody20sunday.jpg', '/static/surgical_implements.jpg'];
// const IMAGE_URLS = ['/static/cuspid.jpg', '/static/tornado_carnage.jpg', '/static/needle_things.jpg'];

function cuspidLoad(){
	createStats();
	init3D();
	window.onresize = function(event){
		setRenderSize();
	}
	setRenderSize();
	console.log("Starting animation");
	startFirstAnimation()
		.then(newAnimator => {
			animator = newAnimator;
			const eventActions = new EventActions(scene, camera, animator, textures, stats, renderer, quads);
			const keyHandler = new KeyHandler(eventActions);

			configureControlSocket(eventActions);

			$('body').get(0).addEventListener('keydown', event => keyHandler.handleKey(event));
			console.log("Animation started.")
		})
		.catch(err => {
			console.log(`ERROR: ${err}`);
		});
}

function configureControlSocket(eventActions){
	const randomId = _.random(0, 1000000000).toString(16);
	const clientId = `client-${randomId}`;

	gui.wsSetClientId(clientId);

	let controlSocket = new wsEvents.ControlSocket(eventActions, clientId);
	controlSocket.connect();

	$('button#changeClientId').click(() => {
		const newClientId = $('input#clientUid').val();
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
	const canvas = $('#cnv').get(0);

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

function startFirstAnimation(){
	// Load our texture
	return loadQuadsFromUrls(IMAGE_URLS)
		.then(newQuads => {
			console.log(`Loaded ${newQuads.length} quads`);
			quads = newQuads;
			newQuads.forEach(quad => scene.add(quad));
			const animator = new Animator({
				renderer: renderer,
				stats: stats,
				scene: scene,
				camera: camera,
				duration: Animator.defaultAnimDuration(),
				jerkiness: 5,
				// animation: new ExperimentalAnimation(newQuads,5)
				// animation: new ZoomAnimation(newQuads, 'IN', 'LINEAR')
				// animation: new ZoomSeqAnimation(newQuads, 'OUT', 5)
				// animation: ImageSequence.build(newQuads)
				animation: TwoQuadBoxScrollAnimation.scrollRight(newQuads, 5)
				//		animation: new BoxScrollAnimation(quad, "RIGHT", 5)
				/*new CompositeAnimation([
					new BoxScrollAnimation(quad, "LEFT", 5),
					new PaletteAnimation(quad, 'DOWN', 0.5),
					new ZoomAnimation.zoomIn(quad, 5)
				])*/
			});
			// animator.options.animation.quad = newQuads[0];
			animator.start();
			return animator;
		});
}

function loadQuadsFromUrls(sourceUrls){
	return Promise.all(sourceUrls.map(url => {
		const loader = chooseLoader(url);
		return loader(url)
			.then(buildTextureQuad(buildImageTexture));
	}))
	.then(results => results.filter(x => x != null))
	.then(results => results.length > 1 ? results : [results[0], results[0]])
	.catch(err => {
		console.error(`ERROR: ${err}`);
	});
}

function chooseLoader(url){
	if(url.endsWith('.webm') || url.endsWith('.ogv') || url.endsWith('.mp4')){
		return VideoLoader.load;
	}
	return ImageLoader.loadAndCrop;
}

function buildTextureQuad(textureFn){
	return content => {
		let texture = textureFn(content);
		textures.push(texture);
		// Draw a single quad with our texture.
		let quad = buildQuad(texture);
		quads.push(quad);
		return quad;
	};
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
	let quadGeom = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
	let quadMaterial = cuspidShader.createCuspidShaderMaterial( texture );
	return new THREE.Mesh( quadGeom, quadMaterial );
}

if (document.readyState != 'loading'){
  cuspidLoad();
}
else{
	document.addEventListener('DOMContentLoaded', cuspidLoad);
}
