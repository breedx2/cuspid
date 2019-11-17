'use strict';

const effectComposer = require('./effect_composer');
const DEFAULT_ANIM_DURATION = 33;

class Animator{

	constructor(options){
		this.options = options;
		this.running = false;
		this.prevFrameTime = (new Date()).getTime();
		this.animRequest = null;
		this.effectComposer = effectComposer.build(options);
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
		const quads = this._getQuads();
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
		if(this.options.animation.quads){
			return this.options.animation.quads;
		}
		if(this.options.animation.quad){
			return [this.options.animation.quad];
		}
		return [];
	}

	deltaDuration(delta){
		return this.duration(this.options.duration + delta);
	};

	duration(duration){
		this.options.duration = Math.max(1, duration);
		console.log(`New duration: ${this.options.duration}`);
		return this;
	};

	restart(){
		this.stop();
		this.start();
	};

	pause(what){
		if(typeof what === 'undefined'){
			if(this.running){
				return this.stop();
			}
			return this.start();
		}
		if(what === 1){
			return this.start();
		}
		return this.stop();
	}

	toggleDotPass(){
		this.effectComposer.toggleDotPass();
	}

	enableDotPass(){
		this.effectComposer.enableDotPass();
	}

	disableDotPass(){
		this.effectComposer.disableDotPass();
	}

	toggleGlitchPass(){
		this.effectComposer.toggleGlitchPass();
	}

	enableGlitchPass(){
		this.effectComposer.enableGlitchPass();
	}

	disableGlitchPass(){
		this.effectComposer.disableGlitchPass();
	}

	dotScale(scale){
		this.effectComposer.dotScale(scale);
	}

	deltaDotScale(amount){
		this.effectComposer.deltaDotScale(amount);
	}

	deltaZoom(amount){
		if(this.options.animation.deltaZoom){
			console.log('Adjusting zoom by ' + amount);
			return this.options.animation.deltaZoom(amount);
		}
		console.log('This animation does not support adjustment zooming');
	}

	zoom(zoomLevel){
		if(this.options.animation.setZoom){
			console.log(`Setting zoom to ${zoomLevel}`);
			return this.options.animation.setZoom(zoomLevel);
		}
		console.log('This animation does not support zooming');
	}

	deltaY(amount){
		if(this.options.animation.deltaY){
			console.log('Adjusting delta Y by ' + amount);
			return this.options.animation.deltaY(amount);
		}
		console.log('This animation does not support delta Y positioning');
	}

	deltaX(amount){
		if(this.options.animation.deltaX){
			console.log('Adjusting delta X by ' + amount);
			return this.options.animation.deltaX(amount);
		}
		console.log('This animation does not support delta X positioning');
	}

	nextImage(){
		if(this.options.animation.nextImage == undefined){
			return console.log('No next image for this animation.  Skipping.');
		}
		this.options.animation.nextImage();
	}

	// This is pretty fake -- since there's no constant frame rate, we can't step ahead a frame.
	// We just advance a little time, which is constant but modified by current speed.
	advanceOneFrame(){
		const timeMult = 0.5 + this.options.duration/1000;
		console.log(`Advancing one "frame", duration = ${this.options.duration} and timeMult will be ${timeMult}`);
		this.options.animation.tick(timeMult);
		this._render();
		this.effectComposer.render();
	}

	_perFrame(){
		if( !this.running ) return;	// we're dead

		this.animRequest = requestAnimationFrame( this._perFrame.bind(this) );

		// Frame rate may not be constant 60fps. Time between frames determines how
		// quickly to advance animations.
		const now = (new Date()).getTime();
		const elapsed = (now - this.prevFrameTime) * 0.001;	// ms to seconds
		let timeMult = elapsed * 60.0;			// Animations are cooked at 60fps, I think? So timeMult is ~1.0 when computer is achieving 60fps
		timeMult = Math.min( 4.0, timeMult );	// Prevent grievous skipping

		// Faster/slower speed, depending on .options.duration.
		timeMult *= (1.0/DEFAULT_ANIM_DURATION) * this.options.duration;
		this.prevFrameTime = now;

		// Advance the animation
		this.options.animation.tick(timeMult);

		this._render();
		this.effectComposer.render();

		if(this.options.stats){
			this.options.stats.update();
		}
	}

	_render(){
		this.options.renderer.render( this.options.scene, this.options.camera );
	}
}

module.exports = Animator;
