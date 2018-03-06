'use strict';

const THREE = require('three');

const DIR_MULT = { 'IN': -1, 'OUT': 1};

class ZoomAnimation {

	constructor (quads, direction, jerkiness, easing ){
		this.quads = quads;
		this.quads.forEach(quad => quad.position.copy(new THREE.Vector3(-100, 0, 0.0)));	//move out of the way
		this.quad = quads[0];
		this.quad.position.copy(new THREE.Vector3(0, 0, 0.0));
		if(DIR_MULT[direction] == null){
			throw new Error("Unknown direction " + direction + ", must be IN or OUT");
		}
		this.direction =  direction;
		this.jerkiness = jerkiness;
		this.easing = easing || 'LINEAR';
		this.phase = this._buildInitialPhase();
	}

	tick(timeMult){
		var scale = this._computeScale(timeMult);
		this.quad.scale.copy(scale);
	}

	nextImage(){
		this.quad.position.copy(new THREE.Vector3(-100, 0, 0.0));	//move out of the way
		this.quads.push(this.quads.shift());
		this.quad = this.quads[0];
		this.quad.position.copy(new THREE.Vector3(0, 0, 0.0)); //bring into view
	}

	_buildInitialPhase(){
		if(this.easing == 'QUADRATIC'){
			return 0.0;	// 0..1
		}
		if(this.easing == 'LINEAR'){
			return {
				dx: this.quads[0].material.uniforms['texture'].value.image.width,
			}
		}
	}

	_computeScale(timeMult){
		switch(this.easing){
			case 'QUADRATIC':
				this.phase = this._computePhaseQuadratic(timeMult);
				console.log(`phase: ${this.phase}`);
				var x = 1.0 + (this.phase * 10.0); //width
				var y = 1.0 + ((this.phase * this.phase) * 80.0); //height (start slow, end fast)
				return new THREE.Vector3(x, y, 1.0);
			case 'LINEAR':
				this.phase = this._computePhaseLinear(timeMult);
				var x = this.phase.perc;
				var y = this.phase.perc;
				return new THREE.Vector3(x, y, 1.0);
			default:
				throw new Error("UNKNOWN EASING: " + this.easing);
		}
	}

	_computePhaseQuadratic(timeMult){
		var img = this.quad.material.uniforms['texture'].value.image;
		var dir = DIR_MULT[this.direction];
		var result = this.phase + (dir * (this.jerkiness / img.width) * timeMult);
		return ZoomAnimation._wrap(result);
	};

	_computePhaseLinear(timeMult){
		var img = this.quad.material.uniforms['texture'].value.image;
		var dir = DIR_MULT[this.direction];
		var dx = this.phase.dx + (dir * this.jerkiness * timeMult);
		if(dx < img.width / 16){
			dx = img.width;
		}
		if(dx > img.width){
			dx = img.width / 16;
		}
		return {
			dx: dx,
			perc: img.width * 1.0 / dx
		}
	};

	static _wrap(value){
		// wrap phase between 0..1
		if( value >= 1.0 ) return 0;
		if( value < 0.0 ) return 1.0;
		return value;
	}

	static zoomIn( quads, jerkiness ){
		return new ZoomAnimation( quads, "IN", Math.abs(jerkiness) || 1);
	}

	static zoomOut( quads, jerkiness ){
		return new ZoomAnimation( quads, "OUT", Math.abs(jerkiness) || 1);
	}
}

module.exports = ZoomAnimation;
