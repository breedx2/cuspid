
class KeyHandler {

    constructor(scene, animator, texture, stats, quads){
        this.scene = scene;
        this.animator = animator;
        this.texture = texture;
        this.stats = stats;
        this.quads = quads; //maybe this shouldn't be here?
    }

    handleKey(event){
    	console.log('I saw this key: ' + event.keyCode);
    	if(animator && (event.keyCode == 32)){	// space bar
    		this.animator.pause();
    	}
    	else if(event.keyCode == 'N'.charCodeAt(0)){
    		// THIS IS A TOTAL HACK THAT MUST BE REPLACED WITH REAL MANAGEMENT
    		let curUrl = this.animator.options.animation.quad.material.uniforms['texture'].value.image.url;
    		// hard coding for now...
    		let sourceUrl = curUrl == '/static/cuspid.jpg' ? '/static/bloody20sunday.jpg' : '/static/cuspid.jpg';
    		ImageLoader.loadAndCrop(sourceUrl)
    			.then(image => {
    				let texture = buildTexture(image);
    				let oldQuad = this.quads[0];
    				this.quads[0] = buildQuad(texture);
    				//sneak the new quad into the existing animator's animation
    				this.animator.options.animation.quad = this.quads[0];
    				this.scene.add( this.quads[0] );
    				this.scene.remove(oldQuad);
    			});
    	}
    	else if(animator && (event.keyCode == 187) && (event.shiftKey)){	// plus '+'
    		console.log("Increasing animation speed");
    		this.animator.deltaDuration(5);
    	}
    	else if(animator && (event.keyCode == 189) && (!event.shiftKey)){	// minus '-'
    		console.log("Slowing animation speed");
    		this.animator.deltaDuration(-5);
    	}
    	else if(event.keyCode == 37){				//left arrow
    		if(event.shiftKey && event.ctrlKey){
    			return console.log("UNBOUND");
    		}
    		if(event.shiftKey){
    			return this._changeAnimation(PaletteAnimation.paletteDown(this.quads[0], this.animator.options.jerkiness));
    		}
    		if(event.ctrlKey){
    			return animator.deltaX(-0.1);
    		}
    		this._changeAnimation(TwoQuadBoxScrollAnimation.scrollLeft(this.quads, this.animator.options.jerkiness));
    	}
    	else if(event.keyCode == 39){				//right arrow
    		if(event.shiftKey && event.ctrlKey){
    			return console.log("UNBOUND");
    		}
    		if(event.shiftKey){
    			console.log(this.animator.options.jerkiness);
    			return this._changeAnimation(PaletteAnimation.paletteUp(this.quads[0], this.animator.options.jerkiness));
    		}
    		if(event.ctrlKey){
    			return this.animator.deltaX(0.1);
    		}
    		this._changeAnimation(TwoQuadBoxScrollAnimation.scrollRight(this.quads, this.animator.options.jerkiness));
    	}
    	else if(event.keyCode == 38){				//up arrow
    		if(event.shiftKey && event.ctrlKey){	//ctrl+shift up arrow
    			return console.log("UNBOUND");
    		}
    		if(event.shiftKey){						//shift up arrow
    			return this._changeAnimation(ZoomAnimation.zoomIn(this.quads[0], this.animator.options.jerkiness));
    		}
    		if(event.ctrlKey){						//control up arrow
    			return this.animator.deltaY(-0.1);
    		}
    		this._changeAnimation(TwoQuadBoxScrollAnimation.scrollUp(this.quads, this.animator.options.jerkiness));
    	}
    	else if(event.keyCode == 40){				//down arrow
    		if(event.shiftKey && event.ctrlKey){	//ctrl+shift down arrow
    			return console.log("UNBOUND");
    		}
    		if(event.shiftKey){						//shift down arrow
    			return this._changeAnimation(ZoomAnimation.zoomOut(this.quads[0], this.animator.options.jerkiness));
    		}
    		if(event.ctrlKey){						//control down arrow
    			return this.animator.deltaY(0.1);
    		}
    		this._changeAnimation(TwoQuadBoxScrollAnimation.scrollDown(this.quads, this.animator.options.jerkiness));
    	}
    	else if(event.keyCode == 13){   //enter key
    		this.animator.options.paint();
    	}
    	else if(event.keyCode == 'Z'.charCodeAt(0)){
    		if(event.shiftKey){	//zoom in
    			console.log('Zoom out');
    			this.animator.deltaZoom(-0.1);
    		}
    		else {
    			console.log('Zoom in');
    			this.animator.deltaZoom(0.1);
    		}
    	}
    	else if(this.stats && (event.keyCode == 'F'.charCodeAt(0)) ){
    		// Toggle FPS visibility
    		let display = this.stats.domElement.style.display;
    		this.stats.domElement.style.display = (display==='none') ? 'block' : 'none';
    	}
    	else if(this.texture && (event.keyCode == 'I'.charCodeAt(0)) ) {
    		// Toggle smooth/pixelated image scaling
    		let filter = this.texture.minFilter;
    		console.log( 'eh?',filter );
    		this.texture.minFilter = this.texture.magFilter = (filter===THREE.LinearFilter) ? THREE.NearestFilter : THREE.LinearFilter;
    		this.texture.needsUpdate = true;	// Texture has changed, so tell ThreeJS to update it
    	}
    	else if((event.keyCode == 'K'.charCodeAt(0)) || ((event.keyCode == 191) && event.shiftKey)){
    		toggleKeys();
    	}
    }

    _changeAnimation(animation){
    	if(this.animator){
    		this.animator.stopAndReset();
    	}
    	this.animator = new Animator({
    		renderer: renderer,
    		scene: scene,
    		camera: camera,
    		stats: stats,
    		jerkiness: this.animator.options.jerkiness,
    		duration: this.animator.options.duration,
    		imageIds: this.animator.options.imageIds,
    		animation: animation
    	});
    	this.animator.start(true);
    }

}
