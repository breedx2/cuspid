'use strict';

const THREE = require('three');

const xDIR_MULT = { 'IN': -1, 'OUT': 1};
const DIR_MULT = { 'IN': 1, 'OUT': -1};

const MIN_SCALE = 0.01;//1.0/32.0;
const MAX_SCALE = 1.0;
const ENTRY_SCALE = 1.0;

class ZoomSeqAnimation {

	constructor (quads, direction, jerkiness){
		this.quads = quads;
		this.quads.forEach(quad => quad.position.copy(new THREE.Vector3(-100, 0, 0.0)));	//move out of the way
		this.quadA = quads[0];
		this.quadB = quads[1];

		this.quadA.position.copy(new THREE.Vector3(0, 0, 0));

		if(DIR_MULT[direction] == null){
			throw new Error("Unknown direction " + direction + ", must be IN or OUT");
		}
		this.direction =  direction;
		this.jerkiness = jerkiness;
		this.scaleA = MIN_SCALE;
		this.scaleB = 0;
		// this.phase = this._buildInitialPhase();
	}

	tick(timeMult){
		var scaleA = this._computeScale(timeMult, this.scaleA);
		this.scaleA = scaleA;
		this.quadA.scale.copy(new THREE.Vector3(scaleA, scaleA, 1.0));

		this.quadA.renderOrder = 0;
		this.quadB.renderOrder = 1;

		if((scaleA > ENTRY_SCALE) && (this.scaleB < MIN_SCALE)){
			console.log("BOOP!");
			this.scaleB = MIN_SCALE;
			this.quadB.position.copy(new THREE.Vector3(0, 0, 0));
			console.log(`scaleA => ${this.scaleA} scaleB => ${this.scaleB}`);
		}
		if(this.scaleB > 0){
			var scaleB = this._computeScale(timeMult, this.scaleB);
			this.scaleB = scaleB;
			this.quadB.scale.copy(new THREE.Vector3(scaleB, scaleB, 1.0));
		}
		if(scaleB > 1.0){
			console.log("SWIZ!");
			return this._nextImage();
		}
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
		this.quadB.position.copy(new THREE.Vector3(0, 0, 0)); // bring into view
		this.quadB.scale.copy(new THREE.Vector3(0, 0, 1.0));
	}

	_computeScale(timeMult, scale){
		const dir = DIR_MULT[this.direction];
		const perc = (scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE);
		// const result = Math.log(Math.abs(scale + 0.01)) + 0.01;
		const result = scale * 1.05;
		// console.log(`perc = ${perc}...  ${scale} => ${result}`);
		return result;
	}

	static zoomIn( quads, jerkiness ){
		return new ZoomSeqAnimation( quads, "IN", Math.abs(jerkiness) || 1);
	}

	static zoomOut( quads, jerkiness ){
		return new ZoomSeqAnimation( quads, "OUT", Math.abs(jerkiness) || 1);
	}
}

module.exports = ZoomSeqAnimation;
