'use strict';

const THREE = require('three');
const zoomNudge = require('./zoom-nudge');

class BlendAnimation {

	constructor (quads){
		this.quads = quads;
		this.once = false;
		this.acc = 0.0;
		this.bias = 1.25 / this.quads.length;
		zoomNudge.monkeyPatch(this);
	}

	tick(timeMult){
		if(!this.once) this._setup();
		const pslice = 2 * 3.1415 / this.quads.length;
		for(let i = 0; i < this.quads.length; i++){
			const a = (Math.sin(this.acc + (i * pslice)) + 1.0) / 2.0;
			_alpha(this.quads[i], this.bias * a);
			this.quads[i].scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
			this.quads[i].position.copy(new THREE.Vector3(this.position.x, this.position.y, 0.001 * i));
		}
		this.acc += 0.05 * timeMult;
	}

	_setup(){
		this.once = true;
		for(let i = 0; i < this.quads.length; i++){
			const z = 0.001 * i;
			this.quads[i].position.copy(new THREE.Vector3(0, 0, z));
			this.quads[i].material.blending = THREE.AdditiveBlending
		}
	}

}

function _makeTransparent(quad){
	_alpha(quad, 0.0);
}

function _incAlpha(quad, value){
	quad.material.uniforms.alpha.value += value;
}

function _alpha(quad, value){
	quad.material.uniforms.alpha.value = value;
}

module.exports = BlendAnimation;
