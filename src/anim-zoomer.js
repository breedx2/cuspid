'use strict';

const THREE = require('three');

const DIR_MULT = { 'IN': 1, 'OUT': -1};
const MAX_ZOOM = 10;

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
		this.scale = this._buildInitialScale();
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

	_buildInitialScale(){
		if(this.easing == 'QUADRATIC'){
			return 0.0;	// 0..1
		}
		if(this.easing == 'LINEAR'){
			return this.direction === 'IN' ? 1.0 : MAX_ZOOM;
		}
	}

	_computeScale(timeMult){

		this.scale = this._computeWrappedEasedScale(timeMult);
		return new THREE.Vector3(this.scale, this.scale, 1.0);

		// switch(this.easing){
		// 	case 'QUADRATIC':
		// 		this.state = this._computePhaseQuadratic(timeMult);
		// 		console.log(`state: ${this.state}`);
		// 		var x = 1.0 + (this.state * 10.0); //width
		// 		var y = 1.0 + ((this.state * this.state) * 80.0); //height (start slow, end fast)
		// 		return new THREE.Vector3(x, y, 1.0);
		// 	case 'LINEAR':
		// 		this.state = this._computePhaseLinear(timeMult);
		// 		var x = this.state;
		// 		var y = this.state;
		// 		return new THREE.Vector3(x, y, 1.0);
		// 	default:
		// 		throw new Error("UNKNOWN EASING: " + this.easing);
		// }
	}

	_computeWrappedEasedScale(timeMult){
		const scale = this._computeScaleWithEasing(timeMult);
		if(this.direction === 'IN' && (scale >= MAX_ZOOM)){
				return 1.0;
		}
		if(this.direction === 'OUT' && (scale <= 1.0)){
			return MAX_ZOOM;
		}
		return scale;
	}

	_computeScaleWithEasing(timeMult){
		switch(this.easing){
			case 'QUADRATIC': //slow start, faster at the end
				return this.scale + (DIR_MULT[this.direction] * timeMult * 0.025);
			case 'LINEAR':
				return this.scale * (1 + (DIR_MULT[this.direction] * timeMult * 0.025));
		}
	}


/*
	//slow start, faster at the end
	_computePhaseQuadratic(timeMult){
		// var img = this.quad.material.uniforms['texture'].value.image;
		// var dir = DIR_MULT[this.direction];
		// var result = this.state + (dir * (this.jerkiness / img.width) * timeMult);
		// return ZoomAnimation._wrap(result);

		// const state = this.state + (DIR_MULT[this.direction] * this.jerkiness * timeMult * 0.025);
		const state = this.state + (DIR_MULT[this.direction] * timeMult * 0.025);
		// console.log(`direction = ${this.direction} state = ${state}`)
		if(this.direction === 'IN' && (state >= MAX_ZOOM)){
				return 1.0;
		}
		if(this.direction === 'OUT' && (state <= 1.0)){
			return MAX_ZOOM;
		}
		return state;
	};

	_computePhaseLinear(timeMult){
		// const state = this.state + (DIR_MULT[this.direction] * this.jerkiness * timeMult * 0.025);
		const state = this.state * (1 + (DIR_MULT[this.direction] * timeMult * 0.025));
		// console.log(`direction = ${this.direction} timeMult = ${timeMult} state = ${state}`)
		if(this.direction === 'IN' && (state >= MAX_ZOOM)){
				return 1.0;
		}
		if(this.direction === 'OUT' && (state <= 1.0)){
			return MAX_ZOOM;
		}
		return state;
	};
	*/

	// static _wrap(value){
	// 	// wrap phase between 0..1
	// 	if( value >= 1.0 ) return 0;
	// 	if( value < 0.0 ) return 1.0;
	// 	return value;
	// }

	static zoomIn( quads, jerkiness ){
		return new ZoomAnimation( quads, "IN", Math.abs(jerkiness) || 1);
	}

	static zoomOut( quads, jerkiness ){
		return new ZoomAnimation( quads, "OUT", Math.abs(jerkiness) || 1);
	}
}

module.exports = ZoomAnimation;
