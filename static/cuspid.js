
var animator = null;

// ThreeJS variables
var scene, camera, renderer;
var quads = [];
var textures = [];
var texture;

function cuspidLoad(){
	// FPS stats
	stats = new Stats();
	stats.domElement.style.display = 'none';	// start hidden
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	init3D();
	window.onresize = function(event){
		setRenderSize();
	}
	setRenderSize();
	console.log("Starting animation");
	startFirstAnimation()
		.then(newAnimator => {
			animator = newAnimator;
			console.log("Animation started.")
		});
	$('body').get(0).addEventListener('keydown', handleKey);
}

function init3D(){
	// Create 3D scene using OrthographicCamera, which looks 'flat' (no perspective).
	// Set the viewport to expand from the origin, 1.0 in each cardinal direction.
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -100, 100 );	// left, right, top, bottom, near, far
	let canvas = $('#cnv').get(0);
	renderer = new THREE.WebGLRenderer({ antialias:false, precision:'mediump', canvas:canvas, autoClear:false });
}

function buildQuad(texture){
	// Width & height are both 2.0, to completely fill our viewport (-1.0...1.0)
	let quadGeom = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
	let quadMaterial = createCuspidShaderMaterial( texture );
	return new THREE.Mesh( quadGeom, quadMaterial );
}

function buildTexture(image){
	let wrap = THREE.ClampToEdgeWrapping; //THREE.RepeatWrapping;
	let texture = new THREE.Texture(image, THREE.UVMapping, wrap, wrap,
		THREE.LinearFilter, THREE.LinearFilter,
		THREE.LuminanceFormat);
	texture.needsUpdate = true;
	return texture;
}

function handleKey(event){
	console.log('I saw this key: ' + event.keyCode);
	if(animator && (event.keyCode == 32)){	// space bar
		animator.pause();
	}
	else if(event.keyCode == 'N'.charCodeAt(0)){
		// THIS IS A TOTAL HACK THAT MUST BE REPLACED WITH REAL MANAGEMENT
		let curUrl = animator.options.animation.quad.material.uniforms['texture'].value.image.url;
		// hard coding for now...
		let sourceUrl = curUrl == '/static/cuspid.jpg' ? '/static/bloody20sunday.jpg' : '/static/cuspid.jpg';
		ImageLoader.loadAndCrop(sourceUrl)
			.then(image => {
				let texture = buildTexture(image);
				let oldQuad = quads[0];
				quads[0] = buildQuad(texture);
				//sneak the new quad into the existing animator's animation
				animator.options.animation.quad = quads[0];
				scene.add( quads[0] );
				scene.remove(oldQuad);
			});
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
			return changeAnimation(PaletteAnimation.paletteDown(quads[0], animator.options.jerkiness));
		}
		if(event.ctrlKey){
			return animator.deltaX(-0.1);
		}
		changeAnimation(TwoQuadBoxScrollAnimation.scrollLeft(quads, animator.options.jerkiness));
	}
	else if(event.keyCode == 39){				//right arrow
		if(event.shiftKey && event.ctrlKey){
			return console.log("UNBOUND");
		}
		if(event.shiftKey){
			console.log(animator.options.jerkiness);
			return changeAnimation(PaletteAnimation.paletteUp(quads[0], animator.options.jerkiness));
		}
		if(event.ctrlKey){
			return animator.deltaX(0.1);
		}
		//changeAnimation(BoxScrollAnimation.scrollRight(quads[0], animator.options.jerkiness));
		changeAnimation(TwoQuadBoxScrollAnimation.scrollRight(quads, animator.options.jerkiness));
	}
	else if(event.keyCode == 38){				//up arrow
		if(event.shiftKey && event.ctrlKey){	//ctrl+shift up arrow
			return console.log("UNBOUND");
		}
		if(event.shiftKey){						//shift up arrow
			return changeAnimation(ZoomAnimation.zoomIn(quads[0], animator.options.jerkiness));
		}
		if(event.ctrlKey){						//control up arrow
			return animator.deltaY(-0.1);
		}
		//changeAnimation(BoxScrollAnimation.scrollUp(quads[0], animator.options.jerkiness));
		changeAnimation(TwoQuadBoxScrollAnimation.scrollUp(quads, animator.options.jerkiness));
	}
	else if(event.keyCode == 40){				//down arrow
		if(event.shiftKey && event.ctrlKey){	//ctrl+shift down arrow
			return console.log("UNBOUND");
		}
		if(event.shiftKey){						//shift down arrow
			return changeAnimation(ZoomAnimation.zoomOut(quads[0], animator.options.jerkiness));
		}
		if(event.ctrlKey){						//control down arrow
			return animator.deltaY(0.1);
		}
		changeAnimation(TwoQuadBoxScrollAnimation.scrollDown(quads, animator.options.jerkiness));
	}
	else if(event.keyCode == 13){   //enter key
		animator.options.paint();
	}
	else if(event.keyCode == 'Z'.charCodeAt(0)){
		if(event.shiftKey){	//zoom in
			console.log('Zoom out');
			animator.deltaZoom(-0.1);
		}
		else {
			console.log('Zoom in');
			animator.deltaZoom(0.1);
		}
	}
	else if(stats && (event.keyCode == 'F'.charCodeAt(0)) ){
		// Toggle FPS visibility
		let display = stats.domElement.style.display;
		stats.domElement.style.display = (display==='none') ? 'block' : 'none';
	}
	else if(texture && (event.keyCode == 'I'.charCodeAt(0)) ) {
		// Toggle smooth/pixelated image scaling
		let filter = texture.minFilter;
		console.log( 'eh?',filter );
		texture.minFilter = texture.magFilter = (filter===THREE.LinearFilter) ? THREE.NearestFilter : THREE.LinearFilter;
		texture.needsUpdate = true;	// Texture has changed, so tell ThreeJS to update it
	}
}

function changeAnimation(animation){
	if(animator){
		animator.stopAndReset();
	}

	// Reset quad uniforms and size
	// quads.forEach(quad => {
	// 	//TODO: Figure this out, yeah....
	// 	// scene.remove(quad);
	// 	// scene.add(quad);
	// 	// Reset the quad
	// 	quad.material.uniforms['colorCycle'].value = 0.0;
	// 	quad.material.uniforms['uvOffset'].value.set( 0, 0 );
	// 	quad.scale.set( 1.0, 1.0, 1.0 );
	// });

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
	animator.start(true);
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
	let sourceUrls = ['/static/cuspid.jpg', '/static/bloody20sunday.jpg'];
	return loadQuadsFromUrls(sourceUrls)
		.then(newQuads => {
			console.log(`Loaded ${newQuads.length} quads`);
			quads = newQuads;
			newQuads.forEach(quad => scene.add(quad));
			// scene.add( newQuads[0] );
			let animator = new Animator({
				renderer: renderer,
				stats: stats,
				scene: scene,
				camera: camera,
				duration: DEFAULT_ANIM_DURATION,
				jerkiness: 5,
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

	// return ImageLoader.loadAndCrop(sourceUrls[0])
	// 	.then(image => {
	// 		texture = buildTexture(image);
	//
	// 		// Draw a single quad with our texture.
	// 		let quad = buildQuad(texture);
	// 		quads.push(quad);
	// 		scene.add( quads[0] );
	// 		return quads[0];
	// 	})
	// 	.then(quad => {
	// 		let animator = new Animator({
	// 			renderer: renderer,
	// 			stats: stats,
	// 			scene: scene,
	// 			camera: camera,
	// 			duration: DEFAULT_ANIM_DURATION,
	// 			jerkiness: 5,
	// 			animation: new TwoQuadBoxScrollAnimation(quad, null, "RIGHT", 5)
	// 			//		animation: new BoxScrollAnimation(quad, "RIGHT", 5)
	// 			/*new CompositeAnimation([
	// 				new BoxScrollAnimation(quad, "LEFT", 5),
	// 				new PaletteAnimation(quad, 'DOWN', 0.5),
	// 				new ZoomAnimation.zoomIn(quad, 5)
	// 			])*/
	// 		});
	// 		animator.options.animation.quad = quads[0];
	// 		animator.start();
	// 		return animator;
	// 	});
}

function loadQuadsFromUrls(sourceUrls){
	return Promise.all(sourceUrls.map(url => {
		return ImageLoader.loadAndCrop(url)
			.then(image => {
				let texture = buildTexture(image);
				textures.push(texture);
				// Draw a single quad with our texture.
				let quad = buildQuad(texture);
				quads.push(quad);
				return quad;
			})
	}))
}
