'use strict';

const THREE = require('three');
// a single-quad box-scroll animation that depends on THREE.RepeatWrapping in
// the texture to look right

class BoxScrollAnimation {
	constructor( quad, direction, jerkiness ){
		this.quad = quad;
		this.direction = direction;
		this.jerkiness = Math.abs(jerkiness) || 1;
		this.offset = new THREE.Vector2( 0, 0 );
		this.zoom = 1.0;
		this.position = { x: 0, y: 0};
	}

	tick(timeMult){

		// GL texture coordinates (UVs) are floating point numbers in range 0..1,
		// so divide jerkiness by the source img width/height
		let img = this.quad.material.uniforms['texture'].value.image;
		if(!img){
			return;
		}
		switch( this.direction ) {
			case 'LEFT':  this.offset.x = this.jerkiness / 512; break;
			case 'RIGHT': this.offset.x = -this.jerkiness / 512; break;
			case 'UP':    this.offset.y = -this.jerkiness / 512; break;
			case 'DOWN':  this.offset.y = this.jerkiness / 512; break;
			default:
				throw new Error("Unknown direction: " + this.direction);
				break;
		}

		this.offset.multiplyScalar( timeMult );
		this.quad.material.uniforms['uvOffset'].value.add( this.offset );
		this.quad.scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
		this.quad.position.copy(new THREE.Vector3(this.position.x, this.position.y, 0.0));
	}

	deltaZoom = function( amount ){
		this.zoom = Math.max(1.0, this.zoom + amount);
		this.deltaX(0);
		this.deltaY(0);
	}

	deltaY = function( amount ){
		this.position.y = this._clampPos(this.position.y, amount);
	}

	deltaX = function( amount ){
		this.position.x = this._clampPos(this.position.x, amount);
	}

	_clampPos = function(cur, amount){
		let min = -1 * (this.zoom - 1.0);
		let max = this.zoom - 1.0;
		return Math.max(Math.min(cur + amount, max), min)
	}

	static scrollLeft = function( quad, jerkiness){
		return BoxScrollAnimation.scrollHoriz( quad, jerkiness, true);
	}

	static scrollRight = function( quad, jerkiness){
		return BoxScrollAnimation.scrollHoriz( quad, jerkiness, false);
	}

	static scrollHoriz = function( quad, jerkiness, leftNotRight){
		jerkiness = Math.abs(jerkiness) || 1;
		return new BoxScrollAnimation( quad, leftNotRight ? "LEFT" : "RIGHT", jerkiness );
	}

	static scrollDown = function( quad, jerkiness){
		return BoxScrollAnimation.scrollVert( quad, jerkiness, false);
	}

	static scrollUp = function( quad, jerkiness){
		return BoxScrollAnimation.scrollVert( quad, jerkiness, true);
	}

	//could probably combine this with horiz for code reuse/deduplication, but f it
	static scrollVert = function( quad, jerkiness, upNotDown){
		jerkiness = Math.abs(jerkiness) || 1;
		return new BoxScrollAnimation( quad, upNotDown ? "UP" : "DOWN", jerkiness );
	}
}

module.exports = BoxScrollAnimation;
