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
const BlendAnimation = require('./anim-blend')
const ImageSequence = require('./anim-image-sequence');
const KeyHandler = require('./key-handler');
const EventActions = require('./event-actions');
const wsEvents = require('./ws-events');
const gui = require('./ui/gui');
const QuadsBuilder = require('./quads-builder');
const ImagePoolUi = require('./ui/imagepool-ui');
import { ImagePool } from './imagepool';

// ThreeJS variables
var scene, camera, renderer;
var stats;

async function cuspidLoad(){
	createStats();
	init3D();
	window.onresize = function(event){
		setRenderSize();
	}
	setRenderSize();
	try {

		const imagePool = await ImagePool.buildWithDefaults();
		imagePool.currentQuads().forEach(quad => scene.add(quad));

		const animator = await startFirstAnimation(imagePool.currentQuads());
		const eventActions = new EventActions(animator, stats, imagePool);
		const keyHandler = new KeyHandler(eventActions);

		configureControlSocket(eventActions);

		document.querySelector('body').addEventListener('keydown', event => keyHandler.handleKey(event));
		gui.showHideDecoration(false);
		console.log("Animation started.")

		async function makeQuad3(images){
			console.log("MAKE QUAD 3");
			const newQuads = await QuadsBuilder.load(images);
			imagePool.setQuads(2, newQuads);
			images.forEach(img => {
				img.remove();
			})
			gui.toggleImagePool();
		}
		ImagePoolUi.setup(makeQuad3, imagePool);
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

async function startFirstAnimation(quads){
	console.log("Starting animation");

	const animator = new Animator({
		renderer: renderer,
		stats: stats,
		scene: scene,
		camera: camera,
		duration: Animator.defaultAnimDuration(),
		jerkiness: 5,
		animation: new BlendAnimation(quads)
		// animation: new ExperimentalAnimation(quads,5)
		// animation: new ZoomAnimation(quads, 'IN', 'LINEAR')
		// animation: new ZoomSeqAnimation(quads, 'OUT', 5)
		// animation: TwoQuadBoxScrollAnimation.scrollRight(quads, 5)
		// animation: new BoxScrollAnimation(quad, "RIGHT", 5)
	});
	// animator.options.animation.quad = quads[0];
	animator.start();
	return animator;
}

if (document.readyState != 'loading'){
  cuspidLoad();
}
else{
	document.addEventListener('DOMContentLoaded', cuspidLoad);
}
