'use strict';

const THREE = require('three');

class FadeAnimation {

	constructor (quads){
		this.quads = quads;
		for(let i = 0; i < quads.length; i++){
			const z = 0.001 * i;
			quads[i].position.copy(new THREE.Vector3(0, 0, z));
		}
		this.acc = 0.0;
	}

	tick(timeMult){

		const bias = 1.05 / this.quads.length;
		const pslice = 2 * 3.1415 / this.quads.length;

		for(let i = 0; i < this.quads.length; i++){

			const a = (Math.sin(this.acc + (i * pslice)) + 1.0) / 2.0;
			_alpha(this.quads[i], bias * a);

		}
		this.acc += 0.05 * timeMult;
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

module.exports = FadeAnimation;
