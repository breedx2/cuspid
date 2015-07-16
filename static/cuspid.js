
var DEFAULT_DURATION = 55;
var animation = null;

// ThreeJS variables
var scene, camera, renderer;
var quad, texture;

function cuspidLoad(){
	// FPS stats. TODO: remove for production
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	init3D();

	// After 3D is ready: resize canvas and renderer.
	window.onresize = function(event){
		resizeCanvasToWindow();
	}
	resizeCanvasToWindow();

	$('body').get(0).addEventListener('keydown', handleKey);

	initFirstAnimation();

	// Start animation
	perFrame();
}

function init3D(){
	// Load our texture
	var texture = THREE.ImageUtils.loadTexture( '/static/cuspid.jpg' );
	texture.minFilter = texture.magFilter = THREE.LinearFilter;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

	// Create 3D scene using OrthographicCamera, which looks 'flat' (no perspective).
	// Set the viewport to expand from the origin, 1.0 in each cardinal direction.
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -100, 100 );	// left, right, top, bottom, near, far

	// We're going to draw a single quad with our texture.
	// Size is 2.0 to match our viewport (-1.0...1.0)
	var quadGeom = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
	var quadMaterial = createCuspidShaderMaterial( texture );
	quad = new THREE.Mesh( quadGeom, quadMaterial );
	scene.add( quad );

	// .antialias: some browsers will ignore this
	var canvas = $('#cnv').get(0);
	renderer = new THREE.WebGLRenderer({ antialias:true, precision:'mediump', canvas:canvas });
	renderer.setClearColor( 0xff2224, 1.0 );
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
}

function changeAnimation(func){
	if(!animation){
		return;
	}
	animation.stop();
	animation = animate({
		duration: animation.options.duration,
		imageIds: animation.options.imageIds,
		paint: func( quad, animation.options.jerkiness || 5),
	});
	animation.start();
}

function resizeCanvasToWindow(){
	var w = window.innerWidth - 10;
	var h = window.innerHeight - 10;

	/*
	// ThreeJS steals the context, can't set the size manually.
	// Instead, set renderer size (see below).
	var canvas = $('#cnv').get(0);
	var context = canvas.getContext('3d');
	context.canvas.width = w;
	context.canvas.height = h;
	*/

	if( renderer ) {	// sanity check
		renderer.setSize( w, h );
	}
}

function initFirstAnimation(){
	animation = animate({
		duration: 33,//DEFAULT_DURATION,
		// paint: scrollDown(id, 10)
		// paint: boxScroll(id, "DOWN", 10, {x: 6, y: 0, dx: 120, dy: 80})
		jerkiness: 5,
		// paint: zoomer(id, "OUT", 5)
		paint: rotatePalette( quad, "DOWN", 21 ),
	});
	animation.start();
}

function perFrame(){
	// Request another animation frame
	requestAnimationFrame( perFrame );

	renderer.render( scene, camera );

	if( stats ) stats.update();
}
