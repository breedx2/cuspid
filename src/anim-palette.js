'use strict';

const THREE = require('three');
//ok not really palette, more like a rolling intensity or something

class PaletteAnimation {

	constructor(quad, direction, jerkiness){
		this.quad = quad;
		this.quad.position.copy(new THREE.Vector3(0.0, 0.0, 0.0));
		this.direction = direction;
		this.jerkiness = jerkiness;
		this.zoom = 1.0;
		this.position = {x: 0, y: 0};
	}

	tick(timeMult){
		const dir = (this.jerkiness/0xff) * ((this.direction==='DOWN') ? -1 : 1) * timeMult;
		this.quad.material.uniforms['colorCycle'].value += dir;
		this.quad.position.copy(new THREE.Vector3(this.position.x, this.position.y, 0.0));
		this.quad.scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
	}

	deltaZoom( amount ){
		this.zoom = Math.max(1.0, this.zoom + amount);
		this.position.x = this._clampPos(this.position.x, 0);
		this.position.y = this._clampPos(this.position.y, 0);
	}

	deltaY( amount ){
		this.position.y = this._clampPos(this.position.y, amount);
	}

	deltaX( amount ){
		this.position.x = this._clampPos(this.position.x, amount);
	}

	_clampPos(cur, amount) {
	  var min = -1 * (this.zoom - 1.0);
	  var max = this.zoom - 1.0;
	  return Math.max(Math.min(cur + amount, max), min)
	}

	static paletteUp( quad, jerkiness){
		return new PaletteAnimation( quad, "UP", jerkiness );
	}

	static paletteDown( quad, jerkiness ){
		return new PaletteAnimation( quad, "DOWN", jerkiness );
	}
}

module.exports = PaletteAnimation;
