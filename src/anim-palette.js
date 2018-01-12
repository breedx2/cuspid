'use strict';

const THREE = require('three');
const zoomNudge = require('./zoom_nudge');

//ok not really palette, more like a rolling intensity or something

class PaletteAnimation {

	constructor(quad, direction, jerkiness){
		this.quad = quad;
		this.quad.position.copy(new THREE.Vector3(0.0, 0.0, 0.0));
		this.direction = direction;
		this.jerkiness = jerkiness;
		this.zoom = 1.0;
		this.position = {x: 0, y: 0};
		this.deltaZoom = zoomNudge.deltaZoom.bind(this);
		this.setZoom = zoomNudge.setZoom.bind(this);
		this.deltaX = zoomNudge.deltaX.bind(this);
		this.deltaY = zoomNudge.deltaY.bind(this);
	}

	tick(timeMult){
		const dir = (this.jerkiness/0xff) * ((this.direction==='DOWN') ? -1 : 1) * timeMult;
		this.quad.material.uniforms['colorCycle'].value += dir;
		this.quad.position.copy(new THREE.Vector3(this.position.x, this.position.y, 0.0));
		this.quad.scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
	}

	static paletteUp( quad, jerkiness){
		return new PaletteAnimation( quad, "UP", jerkiness );
	}

	static paletteDown( quad, jerkiness ){
		return new PaletteAnimation( quad, "DOWN", jerkiness );
	}
}

module.exports = PaletteAnimation;
