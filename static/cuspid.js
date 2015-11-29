
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

	init3D(function(){
		// After 3D is ready: resize canvas and renderer.
		window.onresize = function(event){
			setRenderSize();
		}
		setRenderSize();

		console.log("Starting animation");
		animator = startFirstAnimation();
	});
	$('body').get(0).addEventListener('keydown', handleKey);
}

function init3D(callback){
	// Load our texture
	var sourceUrl = '/static/bloody20sunday.jpg';
	ImageLoader.loadAndCrop(sourceUrl, function(image){
		console.log("Image was loaded and cropped/scaled");
		texture = new THREE.Texture(image, THREE.UVMapping, THREE.RepeatWrapping, 
			THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearFilter,
			THREE.LuminanceFormat);
		texture.needsUpdate = true;

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
		callback();
	});
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
	else if(event.keyCode == 37){				//left arrow
		if(event.shiftKey && event.ctrlKey){
			return console.log("UNBOUND");
		}
		if(event.shiftKey){
			return changeAnimation(PaletteAnimation.paletteDown(quad, animator.options.jerkiness));
		}
		if(event.ctrlKey){
			return animator.deltaX(-0.1);
		}
		changeAnimation(BoxScrollAnimation.scrollLeft(quad, animator.options.jerkiness));
	}
	else if(event.keyCode == 39){				//right arrow
		if(event.shiftKey && event.ctrlKey){
			return console.log("UNBOUND");
		}
		if(event.shiftKey){
			console.log(animator.options.jerkiness);
			return changeAnimation(PaletteAnimation.paletteUp(quad, animator.options.jerkiness));
		}
		if(event.ctrlKey){
			return animator.deltaX(0.1);
		}
		changeAnimation(BoxScrollAnimation.scrollRight(quad, animator.options.jerkiness));
	}
	else if(event.keyCode == 38){				//up arrow
		if(event.shiftKey && event.ctrlKey){	//ctrl+shift up arrow
			return console.log("UNBOUND");
		}
		if(event.shiftKey){						//shift up arrow
			return changeAnimation(ZoomAnimation.zoomIn(quad, animator.options.jerkiness));	
		}
		if(event.ctrlKey){						//control up arrow
			return animator.deltaY(-0.1);
		}
		changeAnimation(BoxScrollAnimation.scrollUp(quad, animator.options.jerkiness));
	}
	else if(event.keyCode == 40){				//down arrow
		if(event.shiftKey && event.ctrlKey){	//ctrl+shift down arrow
			return console.log("UNBOUND");
		}
		if(event.shiftKey){						//shift down arrow
			changeAnimation(ZoomAnimation.zoomOut(quad, animator.options.jerkiness));
		}
		if(event.ctrlKey){						//control down arrow
			return animator.deltaY(0.1);
		}
		changeAnimation(BoxScrollAnimation.scrollDown(quad, animator.options.jerkiness));
	}
	else if(event.keyCode == 13){   //enter key
		animator.options.paint();
	}
	else if(event.keyCode == 'Z'.charCodeAt(0)){
		if(!event.shiftKey){	//zoom in
			console.log('Zoom in');
			animator.deltaZoom(0.1);
		}
		else {
			console.log('Zoom out');
			animator.deltaZoom(-0.1);
		}
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
		animation: new CompositeAnimation([new BoxScrollAnimation(quad, "LEFT", 5), new PaletteAnimation(quad, 'DOWN', 0.5)])
		// paint: rotatePalette( quad, "DOWN", 21 ),
	});
	animator.start();
	return animator;
}
