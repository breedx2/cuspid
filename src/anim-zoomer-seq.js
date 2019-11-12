'use strict';

const THREE = require('three');

const DIR_MULT = { 'IN': 1, 'OUT': -1};

const MIN_SCALE = 0.01;
const MAX_SCALE = 1.0;
const ENTRY_SCALE = 1.0;
const OUT_MAX = 120;

class ZoomSeqAnimation {

	constructor (quads, direction, jerkiness){
		this.quads = quads;
		this.quads.forEach(quad => quad.position.copy(new THREE.Vector3(-100, 0, 0.0)));	//move out of the way
		this.quadA = quads[0];
		this.quadB = quads[1];

		this._toCenter(this.quadA);
		this._toCenter(this.quadB);

		if(DIR_MULT[direction] == null){
			throw new Error("Unknown direction " + direction + ", must be IN or OUT");
		}
		this.direction =  direction;
		this.jerkiness = jerkiness;
		if(direction === 'IN'){
			this.scaleA = ENTRY_SCALE;
			this.scaleB = 0;
		}
		else {
			this.scaleA = OUT_MAX;
			this.scaleB = ENTRY_SCALE;
		}
	}

	tick(timeMult){
		var scaleA = this._computeScale(timeMult, this.scaleA);
		this.scaleA = scaleA;
		this.quadA.scale.copy(new THREE.Vector3(scaleA, scaleA, 1.0));

		if(this.direction === 'IN'){
			this._scaleIn(timeMult, scaleA);
		}
		else {
			this._scaleOut(timeMult, scaleA);
		}
		this.quadA.renderOrder = 0;
		this.quadB.renderOrder = 1;
	}

	_scaleOut(timeMult, scaleA){
		var scaleB = this._computeScale(timeMult, this.scaleB);
		this.scaleB = scaleB;
		this.quadB.scale.copy(new THREE.Vector3(scaleB, scaleB, 1.0));

		if(this.scaleA <= ENTRY_SCALE){
			this._nextImage();
		}
	}

	_scaleIn(timeMult, scaleA){
		if((scaleA > ENTRY_SCALE) && (this.scaleB < MIN_SCALE)){
			console.log("BOOP!");
			this.scaleB = MIN_SCALE;
			this._toCenter(this.quadB);
		}
		if(this.scaleB > 0){
			var scaleB = this._computeScale(timeMult, this.scaleB);
			this.scaleB = scaleB;
			this.quadB.scale.copy(new THREE.Vector3(scaleB, scaleB, 1.0));
		}
		if(scaleB > 1.0){
			console.log(`SWIZ! ${this.scaleA} ${this.scaleB}`);
			return this._nextImage();
		}
	}

	_nextImage(){
		console.log('DEBUG: bringing in next image....')
		if(this.direction === 'IN'){
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
		else { // OUT
			this.quadB.position.copy(new THREE.Vector3(-100, 0, 0.0));	//move out of the way
			this.quadB.scale.copy(new THREE.Vector3(0, 0, 0));
			this.quads.unshift(this.quads.pop());
			this.quadA = this.quads[0];
			this.quadB = this.quads[1];
			this.scaleB = this.scaleA;
			this.scaleA = OUT_MAX;
			this._toCenter(this.quadA);
			this.quadA.scale.copy(new THREE.Vector3(OUT_MAX, OUT_MAX, 1.0));

		}
	}

	_computeScale(timeMult, scale){
		const dir = DIR_MULT[this.direction];
		const result = (this.direction === 'IN') ?
			scale * (1 + (timeMult * 0.025)) :
			scale * (1 - (timeMult * 0.025));
		return result;
	}

	_toCenter(quad){
		quad.position.copy(new THREE.Vector3(0, 0, 0)); // bring into view
	}

	static zoomIn( quads, jerkiness ){
		return new ZoomSeqAnimation( quads, "IN", Math.abs(jerkiness) || 1);
	}

	static zoomOut( quads, jerkiness ){
		return new ZoomSeqAnimation( quads, "OUT", Math.abs(jerkiness) || 1);
	}
}

module.exports = ZoomSeqAnimation;
