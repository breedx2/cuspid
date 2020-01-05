'use strict';

const THREE = require('three');
const zoomNudge = require('./zoom-nudge');

//ok not really palette, more like a rolling intensity or something

class PaletteAnimation {

	constructor(quads, direction, jerkiness){
		this.quads = quads;
		this.quads.forEach(quad => quad.position.copy(new THREE.Vector3(-100, 0, 0.0)));	//move out of the way
		this.quad = quads[0];
		this.quad.position.copy(new THREE.Vector3(0.0, 0.0, 0.0));
		this.direction = direction;
		this.jerkiness = jerkiness;
		zoomNudge.monkeyPatch(this);
	}

	tick(timeMult){
		const dir = (this.jerkiness/0xff) * ((this.direction==='DOWN') ? -1 : 1) * timeMult;
		this.quad.material.uniforms['colorCycle'].value += dir;
		this.quad.position.copy(new THREE.Vector3(this.position.x, this.position.y, 0.0));
		this.quad.scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
	}

	nextImage(){
		this.quad.position.copy(new THREE.Vector3(-100, 0, 0.0));	//move out of the way
		this.quads.push(this.quads.shift());
		this.quad = this.quads[0];
		this.quad.position.copy(new THREE.Vector3(0, 0, 0.0)); //bring into view
	}

	static paletteUp( quads, jerkiness){
		return new PaletteAnimation( quads, "UP", jerkiness );
	}

	static paletteDown( quads, jerkiness ){
		return new PaletteAnimation( quads, "DOWN", jerkiness );
	}
}

module.exports = PaletteAnimation;
