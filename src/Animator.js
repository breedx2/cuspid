'use strict';

const DEFAULT_ANIM_DURATION = 33;

class Animator{

	constructor(options){
		this.options = options;
		this.running = false;
		this.prevFrameTime = (new Date()).getTime();
		this.animRequest = null;
		this.composer = buildEffectComposer(options);
	}

	static defaultAnimDuration(){ return DEFAULT_ANIM_DURATION; }

	start(addQuads){
		if(this.running){
			return console.log("ANIMATOR NOT STARTING -- already running");
		}
		console.log("STARTING ANIMATOR");
		this.running = true;
		if(addQuads){
			let self = this;
			this._getQuads().forEach(quad => self.options.scene.add(quad));
		}
		this._perFrame();
		return this;
	};

	stopAndReset(){
		this.stop();
		this._resetQuads();
	}

	stop(){
		console.log("STOPPING");
		this.running = false;

		// Cancel pending perFrame() calls
		if( this.animRequest ) cancelAnimationFrame( this.animRequest );
		this.animRequest = null;

		return this;
	};

	_resetQuads(){
		let quads = this._getQuads();
		// Reset quad uniforms and size
		quads.forEach(quad => {
			// Reset the quad
			console.log("REMOVING QUAD");
			this.options.scene.remove(quad);
			// scene.add(quad);
			quad.material.uniforms['colorCycle'].value = 0.0;
			quad.material.uniforms['uvOffset'].value.set( 0, 0 );
			quad.scale.set( 1.0, 1.0, 1.0 );
		});
	}

	_getQuads(){
		if(this.options.animation.quad){
			return [this.options.animation.quad];
		}
		if(this.options.animation.quads){
			return this.options.animation.quads;
		}
		//TODO FIXME hack until twoquad is fixed to use an array
		if(this.options.animation.quad1){
			return [this.options.animation.quad1, this.options.animation.quad2];
		}
		return [];
	}

	deltaDuration(delta){
		this.options.duration = Math.max(1, this.options.duration + delta);
		return this;
	};

	duration(duration){
		this.options.duration = duration;
		return this;
	};

	restart(){
		this.stop();
		this.start();
	};

	pause(){
		if(this.running){
			return this.stop();
		}
		return this.start();
	}

	deltaZoom(amount){
		if('deltaZoom' in this.options.animation){
			console.log('Adjusting zoom by ' + amount);
			this.options.animation.deltaZoom(amount);
		}
		else {
			console.log('This animation does not support zooming');
		}
	}

	deltaY(amount){
		if('deltaY' in this.options.animation){
			console.log('Adjusting delta Y by ' + amount);
			this.options.animation.deltaY(amount);
		}
		else {
			console.log('This animation does not support delta Y positioning');
		}
	}

	deltaX(amount){
		if('deltaX' in this.options.animation){
			console.log('Adjusting delta X by ' + amount);
			this.options.animation.deltaX(amount);
		}
		else {
			console.log('This animation does not support delta X positioning');
		}
	}

	_perFrame(){
		if( !this.running ) return;	// we're dead

		this.animRequest = requestAnimationFrame( this._perFrame.bind(this) );

		// Frame rate may not be constant 60fps. Time between frames determines how
		// quickly to advance animations.
		var now = (new Date()).getTime();
		var elapsed = (now - this.prevFrameTime) * 0.001;	// ms to seconds
		var timeMult = elapsed * 60.0;			// Animations are cooked at 60fps, I think? So timeMult is ~1.0 when computer is achieving 60fps
		timeMult = Math.min( 4.0, timeMult );	// Prevent grievous skipping

		// Faster/slower speed, depending on .options.duration.
		timeMult *= (1.0/DEFAULT_ANIM_DURATION) * this.options.duration;
		this.prevFrameTime = now;

		// Advance the animation
		this.options.animation.tick(timeMult);

		this._render( this.options.scene, this.options.camera );

		this._renderPostEffects();

		if(this.options.stats){
			this.options.stats.update();
		}
	}

	_render(){
		this.options.renderer.render( this.options.scene, this.options.camera );
	}

	_renderPostEffects(){
		this.composer.render(this.composer.clock.getDelta());
	}
}

function buildEffectComposer(options){
	const rtParameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat,
		stencilBuffer: true
	};
	const webGlTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParameters);
	const composer = new THREE.EffectComposer(options.renderer, webGlTarget);
	const angle = 0.5;
	const scale = 0.5;
	const dotScreenPass = new THREE.DotScreenPass(new THREE.Vector2(0, 0), angle, scale);
	composer.addPass( new THREE.RenderPass( options.scene, options.camera ) );
	composer.addPass( dotScreenPass);

	const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
	effectCopy.renderToScreen = true;
	composer.addPass(effectCopy);
	composer.clock = new THREE.Clock();
	return composer;
}

module.exports = Animator;
