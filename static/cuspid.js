
var animator = null;

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

	animator = startFirstAnimation();
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
	if(animator && (event.keyCode == 32)){	// space bar
		animator.pause();
	}
	else if(animator && (event.keyCode == 187) && (event.shiftKey)){	// plus '+'
		console.log("Increasing animation speed");
		animator.deltaDuration(5);
	}
	else if(animator && (event.keyCode == 189) && (!event.shiftKey)){	// minus '-'
		console.log("Slowing animation speed");
		animator.deltaDuration(-5);
	}
	else if((event.keyCode == 39) && (!event.shiftKey)){	//right arrow
		changeAnimation(BoxScrollAnimation.scrollRight(quad, animator.options.jerkiness));
	}
	else if((event.keyCode == 37) && (!event.shiftKey)){	//left arrow
		changeAnimation(BoxScrollAnimation.scrollLeft(quad, animator.options.jerkiness));
	}
	else if((event.keyCode == 38) && (!event.shiftKey)){	//up arrow
		changeAnimation(BoxScrollAnimation.scrollUp(quad, animator.options.jerkiness));
	}
	else if((event.keyCode == 40) && (!event.shiftKey)){	//down arrow
		changeAnimation(BoxScrollAnimation.scrollDown(quad, animator.options.jerkiness));
	}
	else if((event.keyCode == 38) && (event.shiftKey)){		//shift up arrow
		changeAnimation(ZoomAnimation.zoomIn(quad, animator.options.jerkiness));
	}
	else if((event.keyCode == 40) && (event.shiftKey)){		//shift down arrow
		changeAnimation(ZoomAnimation.zoomOut(quad, animator.options.jerkiness));
	}
	else if((event.keyCode == 39) && (event.shiftKey)){		//shift right arrow
		console.log(animator.options.jerkiness);
		changeAnimation(PaletteAnimation.paletteUp(quad, animator.options.jerkiness));
	}
	else if((event.keyCode == 37) && (event.shiftKey)){	//shift left arrow
		changeAnimation(PaletteAnimation.paletteDown(quad, animator.options.jerkiness));
	}
	else if(event.keyCode == 13){	//enter key
		animator.options.paint();
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

function changeAnimation(animation){
	if(animator){
		animator.stop();
	}

	// Reset quad uniforms and size
	quad.material.uniforms['colorCycle'].value = 0.0;
	quad.material.uniforms['uvOffset'].value.set( 0, 0 );
	quad.scale.set( 1.0, 1.0, 1.0 );

	animator = new Animator({
		renderer: renderer,
		scene: scene,
		camera: camera,
		stats: stats,
		jerkiness: animator.options.jerkiness,
		duration: animator.options.duration,
		imageIds: animator.options.imageIds,
		animation: animation
	});
	animator.start();	
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
	var animator = new Animator({
		renderer: renderer,
		stats: stats,
		scene: scene,
		camera: camera,
		duration: DEFAULT_ANIM_DURATION,
		// paint: scrollDown(id, 10)
		// paint: boxScroll(id, "DOWN", 10, {x: 6, y: 0, dx: 120, dy: 80})
		jerkiness: 5,
		// paint: zoomer(id, "OUT", 5)
		animation: new PaletteAnimation(quad, 'DOWN', 21)
		// paint: rotatePalette( quad, "DOWN", 21 ),
	});
	animator.start();
	return animator;
}
