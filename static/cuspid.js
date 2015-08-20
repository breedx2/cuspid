
var DEFAULT_DURATION = 55;
var animation = null;

// ThreeJS variables
var scene, camera, renderer;
var quad, texture;

function cuspidLoad(){
	// FPS stats
	stats = new Stats();
	stats.domElement.style.display = 'none';	// start hidden
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	init3D();

	// After 3D is ready: resize canvas and renderer.
	window.onresize = function(event){
		setRenderSize();
	}
	setRenderSize();

	$('body').get(0).addEventListener('keydown', handleKey);

	animation = startFirstAnimation();
}

function init3D(){
	// Load our texture
	texture = THREE.ImageUtils.loadTexture( '/static/cuspid_pow2.jpg' );
	texture.minFilter = texture.magFilter = THREE.LinearFilter;	// smoother
	//texture.minFilter = texture.magFilter = THREE.NearestFilter;	// more aliasing
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;	// image wraps around
	texture.format = THREE.LuminanceFormat;	// we only need 1 channel for grayscale

	// Create 3D scene using OrthographicCamera, which looks 'flat' (no perspective).
	// Set the viewport to expand from the origin, 1.0 in each cardinal direction.
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -100, 100 );	// left, right, top, bottom, near, far

	// Draw a single quad with our texture.
	// Width & height are both 2.0, to completely fill our viewport (-1.0...1.0)
	var quadGeom = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
	var quadMaterial = createCuspidShaderMaterial( texture );
	quad = new THREE.Mesh( quadGeom, quadMaterial );
	scene.add( quad );

	var canvas = $('#cnv').get(0);
	renderer = new THREE.WebGLRenderer({ antialias:false, precision:'mediump', canvas:canvas, autoClear:false });
}

function handleKey(event){
	console.log('I saw this key: ' + event.keyCode);
	if(animation && (event.keyCode == 32)){
		animation.pause();
	}
	else if(animation && (event.keyCode == 187) && (event.shiftKey)){
		console.log("Slowing animation speed");
		animation.deltaDuration(5);
	}
	else if(animation && (event.keyCode == 189) && (!event.shiftKey)){
		console.log("Increasing animation speed");
		animation.deltaDuration(-5);
	}
	else if((event.keyCode == 39) && (!event.shiftKey)){	//right arrow
		changeAnimation(scrollRight);
	}
	else if((event.keyCode == 37) && (!event.shiftKey)){	//left arrow
		changeAnimation(scrollLeft);
	}
	else if((event.keyCode == 38) && (!event.shiftKey)){	//up arrow
		changeAnimation(scrollUp);
	}
	else if((event.keyCode == 40) && (!event.shiftKey)){	//down arrow
		changeAnimation(scrollDown);
	}
	else if((event.keyCode == 38) && (event.shiftKey)){		//shift up arrow
		changeAnimation(zoomIn);
	}
	else if((event.keyCode == 40) && (event.shiftKey)){		//shift down arrow
		changeAnimation(zoomOut);
	}
	else if((event.keyCode == 39) && (event.shiftKey)){		//shift right arrow
		changeAnimation(paletteUp);
	}
	else if((event.keyCode == 37) && (event.shiftKey)){	//shift left arrow
		changeAnimation(paletteDown);
	}
	else if(event.keyCode == 13){	//enter key
		animation.options.paint();
	}
	else if(stats && (event.keyCode == 'F'.charCodeAt(0)) ){
		// Toggle FPS visibility
		var display = stats.domElement.style.display;
		stats.domElement.style.display = (display==='none') ? 'block' : 'none';
	}
	else if(texture && (event.keyCode == 'I'.charCodeAt(0)) ) {
		// Toggle smooth/pixelated image scaling
		var filter = texture.minFilter;
		console.log( 'eh?',filter );
		texture.minFilter = texture.magFilter = (filter===THREE.LinearFilter) ? THREE.NearestFilter : THREE.LinearFilter;
		texture.needsUpdate = true;	// Texture has changed, so tell ThreeJS to update it
	}
}

function changeAnimation(func){
	if(animation){
		animation.stop();
	}

	// Reset quad uniforms and size
	quad.material.uniforms['colorCycle'].value = 0.0;
	quad.material.uniforms['uvOffset'].value.set( 0, 0 );
	quad.scale.set( 1.0, 1.0, 1.0 );

	animation = new Animation({
		renderer: renderer,
		scene: scene,
		camera: camera,
		duration: animation.options.duration,
		imageIds: animation.options.imageIds,
		paint: func( quad, animation.options.jerkiness || 5),
	});
	animation.start();
}

function setRenderSize(){
	var w = window.innerWidth - 10;
	var h = window.innerHeight - 10;

	// ThreeJS steals the context, can't set the size manually.
	// Instead, use renderer.setSize (see below).
	if(renderer) {	// sanity check
		renderer.setSize( w, h );
	}
}

function startFirstAnimation(){
	var animation = new Animation({
		renderer: renderer,
		stats: stats,
		scene: scene,
		camera: camera,
		duration: 33,//DEFAULT_DURATION,
		// paint: scrollDown(id, 10)
		// paint: boxScroll(id, "DOWN", 10, {x: 6, y: 0, dx: 120, dy: 80})
		jerkiness: 5,
		// paint: zoomer(id, "OUT", 5)
		paint: rotatePalette( quad, "DOWN", 21 ),
	});
	animation.start();
	return animation;
}
