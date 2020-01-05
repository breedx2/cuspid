'use strict';

const THREE = require('three');

const DIR_MULT = { 'IN': 1, 'OUT': -1};
const MAX_ZOOM = 25;

class ZoomAnimation {

	constructor (quads, direction, easing ){
		if(DIR_MULT[direction] == null){
			throw new Error("Unknown direction " + direction + ", must be IN or OUT");
		}
		this.quads = quads;
		this.direction =  direction;
		this.easing = easing || 'LINEAR';
		this.scale = this.direction === 'IN' ? 1.0 : MAX_ZOOM;
		this.once = false;
	}

	tick(timeMult){
		if(!this.once) this._setup();
		var scale = this._computeScale(timeMult);
		this.quad.scale.copy(scale);
	}

	_setup(){
		this.once = true;
		this.quads.forEach(quad => quad.position.copy(new THREE.Vector3(-100, 0, 0.0)));	//move out of the way
		this.quad = this.quads[0];
		this.quad.position.copy(new THREE.Vector3(0, 0, 0.0));
	}

	nextImage(){
		this.quad.position.copy(new THREE.Vector3(-100, 0, 0.0));	//move out of the way
		this.quads.push(this.quads.shift());
		this.quad = this.quads[0];
		this.quad.position.copy(new THREE.Vector3(0, 0, 0.0)); //bring into view
	}

	_computeScale(timeMult){
		this.scale = this._computeWrappedEasedScale(timeMult);
		return new THREE.Vector3(this.scale, this.scale, 1.0);
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
			case 'QUADRATIC': //fast start, slower at the end (depending on direction)
				return this.scale + (DIR_MULT[this.direction] * timeMult * 0.025);
			case 'LINEAR':
				return this.scale * (1 + (DIR_MULT[this.direction] * timeMult * 0.025));
		}
	}

	static zoomIn( quads, easing ){
		return new ZoomAnimation( quads, 'IN', easing || 'LINEAR');
	}

	static zoomOut( quads, easing ){
		return new ZoomAnimation( quads, 'OUT', easing || 'LINEAR');
	}
}

module.exports = ZoomAnimation;
