'use strict';

const THREE = require('three');
//ok not really palette, more like a rolling intensity or something

class PaletteAnimation {

	constructor(quad, direction, jerkiness){
		this.quad = quad;
		this.quad.position.copy(new THREE.Vector3(0.0, 0.0, 0.0));
		this.direction = direction;
		this.jerkiness = jerkiness;
	}

	tick(timeMult){
		var dir = (this.jerkiness/0xff) * ((this.direction==='DOWN') ? -1 : 1) * timeMult;
		this.quad.material.uniforms['colorCycle'].value += dir;
	}

	static paletteUp( quad, jerkiness){
		return new PaletteAnimation( quad, "UP", jerkiness );
	}

	static paletteDown( quad, jerkiness ){
		return new PaletteAnimation( quad, "DOWN", jerkiness );
	}
}

module.exports = PaletteAnimation;
