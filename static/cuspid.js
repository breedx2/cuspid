
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
			let keyHandler = new KeyHandler(scene, animator, textures, stats, quads);
			$('body').get(0).addEventListener('keydown', event => keyHandler.handleKey(event));
			console.log("Animation started.")
		});
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
	let sourceUrls = ['/static/cuspid.jpg', '/static/corpse001.jpg', '/static/bloody20sunday.jpg', '/static/chupacabra001.jpg'];
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
