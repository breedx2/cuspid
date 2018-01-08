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

	toggleDotShader(){
		this.effectComposer.toggleDotShader();
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
			return this.options.animation.deltaY(amount);
		}
		console.log('This animation does not support delta Y positioning');
	}

	deltaX(amount){
		if('deltaX' in this.options.animation){
			console.log('Adjusting delta X by ' + amount);
			return this.options.animation.deltaX(amount);
		}
		console.log('This animation does not support delta X positioning');
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

		this._render( this.options.scene, this.options.camera );
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
