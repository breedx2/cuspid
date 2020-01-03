'use strict';

const THREE = require('three');

class FadeAnimation {

	constructor (quads, jerkiness){
		this.quads = quads;
		for(let i = 0; i < quads.length; i++){
			const x = 0.01 * i;
			// quads[i].position.copy(new THREE.Vector3(28 * x, 0, x));
			quads[i].position.copy(new THREE.Vector3(0, 0, x));
			// const a = (i+1) * (0.5 / quads.length );
			// _alpha(quads[i], a);
		}
		this.acc = 0.0;
		this.jerkiness = jerkiness;

		/*this.quads.forEach(quad => {
			//center
			quad.position.copy(new THREE.Vector3(28* z, 0, z));
			z = z + 0.01;
			// _makeTransparent(quad);
		});*/
		// this.quadA = quads[1];
		// this.quadB = quads[2];
		//
		// this.jerkiness = jerkiness;
		// this.scaleA = 0;
		// this.scaleB = .5;
	}

	tick(timeMult){

		const bias = 0.5;
		const pslice = 2 * 3.1415 / this.quads.length;

		for(let i = 0; i < this.quads.length; i++){

			const a = (Math.sin(this.acc + (i * pslice)) + 1.0) / 2.0;
			_alpha(this.quads[i], bias * a);


			// _incAlpha(this.quads[i], 0.001);
			// const x = 0.01 * i;
			// quads[i].position.copy(new THREE.Vector3(28 * x, 0, x));
			// const a = (i+1) * (0.5 / quads.length );
			// _alpha(quads[i], a);
		}
		this.acc += 0.01 * this.jerkiness;

		// const lastQuad = this._lastQuad();
		// if(lastQuad.material.uniforms.alpha.value > 0.5){
		// 	this._frontToBack(lastQuad);
		// }


		// this.quads.forEach(quad => {
		// 	quad.material.uniforms.alpha.value -= 0.005;
		// });

		// if(this.scaleB < 0 || this.scaleA > 0.5){
		// 	this._frontToBack();
		// }
		//
		// this.scaleA += 0.001;
		// this.scaleB -= 0.001;
		// console.log(`A = ${this.scaleA}, B = ${this.scaleB}`)
		//
		// _alpha(this.quadA, this.scaleA);
		// _alpha(this.quadB, this.scaleB);
	}

	_frontToBack(lastQuad){
		console.log(`front to back! ${lastQuad.uuid}`);

		_alpha(lastQuad, 0);
		this.quads.unshift(this.quads.pop());
	}

	_lastQuad(){
		return this.quads[ this.quads.length - 1 ];
	}

	_nextImage(){
		console.log('DEBUG: bringing in next image....')
		this.quadA.position.copy(new THREE.Vector3(-100, 0, 0.0));	//move out of the way
		this.quadA.scale.copy(new THREE.Vector3(0, 0, 0));
		this.quads.push(this.quads.shift());
		this.quadA = this.quads[0];
		this.quadB = this.quads[1];
		this.scaleA = this.scaleB;
		this.scaleB = 0;
		this._toCenter(this.quadB);
		this.quadB.scale.copy(new THREE.Vector3(0, 0, 1.0));
	}


	// _scaleOut(timeMult, scaleA){
	// 	let scaleB = this._computeScale(timeMult, this.scaleB);
	// 	this.scaleB = scaleB;
	// 	this.quadB.scale.copy(new THREE.Vector3(scaleB, scaleB, 1.0));
	//
	// 	if(this.scaleA <= ENTRY_SCALE){
	// 		this._nextImage();
	// 	}
	// }
	//
	// _scaleIn(timeMult, scaleA){
	// 	if((scaleA > ENTRY_SCALE) && (this.scaleB < MIN_SCALE)){
	// 		console.log("BOOP!");
	// 		this.scaleB = MIN_SCALE;
	// 		this._toCenter(this.quadB);
	// 	}
	// 	if(this.scaleB > 0){
	// 		var scaleB = this._computeScale(timeMult, this.scaleB);
	// 		this.scaleB = scaleB;
	// 		this.quadB.scale.copy(new THREE.Vector3(scaleB, scaleB, 1.0));
	// 	}
	// 	if(scaleB > 1.0){
	// 		console.log(`SWIZ! ${this.scaleA} ${this.scaleB}`);
	// 		return this._nextImage();
	// 	}
	// }


	// _computeScale(timeMult, scale){
	// 	const dir = DIR_MULT[this.direction];
	// 	const result = (this.direction === 'IN') ?
	// 		scale * (1 + (timeMult * 0.025)) :
	// 		scale * (1 - (timeMult * 0.025));
	// 	return result;
	// }

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
