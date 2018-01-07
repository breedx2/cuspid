'use strict';

const THREE = require('three');

class TwoQuadBoxScrollAnimation {

	constructor( quads, direction, jerkiness ){
		this.quads = quads;
		this.direction = direction;
		this.jerkiness = Math.abs(jerkiness) || 1;
		this.offset = new THREE.Vector2( 0, 0 );
		this.zoom = 1.0;
		this.position = { x: 0, y: 0};
	}

	tick(timeMult){

		// console.log('tick ' + JSON.stringify(this.position));

		this.quads.slice(2).forEach( quad => quad.position.copy(new THREE.Vector3(-2 * this.zoom, 0, 0.0)));
		// GL texture coordinates (UVs) are floating point numbers in range 0..1,
		// so divide jerkiness by the source img width/height
		if(!this.quads[0].material.uniforms['texture'].value.image){
			return;
		}
		switch( this.direction ) {
			case 'LEFT':  this.position.x -= (timeMult * this.jerkiness / 512); break;
			case 'RIGHT': this.position.x += (timeMult * this.jerkiness / 512); break;
			case 'UP':    this.position.y += (timeMult * this.jerkiness / 512); break;
			case 'DOWN':  this.position.y -= (timeMult * this.jerkiness / 512); break;
			default:
				throw new Error("Unknown direction: " + this.direction);
				break;
		}
		if((this.direction == 'RIGHT') && (this.position.x > (2 * this.zoom))){
			this.position.x = 0;
			this._swapQuads();
		}
		if((this.direction == 'LEFT') && (this.position.x < (-2 * this.zoom))){
			this.position.x = 0;
			this._swapQuads();
		}
		if((this.direction == 'UP') && (this.position.y > (2 * this.zoom))){
			this.position.y = 0;
			this._swapQuads();
		}
		if((this.direction == 'DOWN') && (this.position.y < (-2 * this.zoom))){
			this.position.y = 0;
			this._swapQuads();
		}
		this.offset.multiplyScalar( timeMult );
		this.quads[0].material.uniforms['uvOffset'].value.add( this.offset );
		this.quads[0].scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
		this.quads[0].position.copy(new THREE.Vector3(this.position.x, this.position.y, 0.0));

		this.quads[1].scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
		let xmul = this._xmul();
		let ymul = this._ymul();
		let pos2 = {
			x: this.position.x + (xmul * 2 * this.zoom),
			y: this.position.y + (ymul * 2 * this.zoom)
		}
		this.quads[1].position.copy(new THREE.Vector3(pos2.x, pos2.y, 0.0));
	}

	_xmul(){
		if((this.direction == 'UP') || (this.direction == 'DOWN')){
			return 0;
		}
		return (this.direction == 'RIGHT') ? -1 : 1;
	}

	_ymul(){
		if((this.direction == 'LEFT') || (this.direction == 'RIGHT')){
			return 0;
		}
		return (this.direction == 'UP') ? -1 : 1;
	}

	_swapQuads(){
		this.quads.push( this.quads.shift());
	}

	deltaZoom( amount ){
		this.zoom = Math.max(1.0, this.zoom + amount);
		this.deltaX(0);
		this.deltaY(0);
	}

	deltaY( amount ){
		this.position.y = this._clampPos(this.position.y, amount);
	}

	deltaX( amount ){
		console.log('PRE: ' + this.position.x);
		this.position.x = this._clampPos(this.position.x, amount);
		console.log('post: ' + this.position.x);
	}

	_clampPos(cur, amount){
		var min = -1 * (this.zoom - 1.0);
		var max = this.zoom - 1.0;
		return Math.max(Math.min(cur + amount, max), min)
	}

	static scrollLeft( quads, jerkiness){
		return TwoQuadBoxScrollAnimation.scrollHoriz( quads, jerkiness, true);
	}

	static scrollRight( quads, jerkiness){
		return TwoQuadBoxScrollAnimation.scrollHoriz( quads, jerkiness, false);
	}

	static scrollHoriz( quads, jerkiness, leftNotRight){
		jerkiness = Math.abs(jerkiness) || 1;
		return new TwoQuadBoxScrollAnimation( quads, leftNotRight ? "LEFT" : "RIGHT", jerkiness );
	}

	static scrollDown( quads, jerkiness){
		return TwoQuadBoxScrollAnimation.scrollVert( quads, jerkiness, false);
	}

	static scrollUp( quads, jerkiness){
		return TwoQuadBoxScrollAnimation.scrollVert( quads, jerkiness, true);
	}

	//could probably combine this with horiz for code reuse/deduplication, but f it
	static scrollVert( quads, jerkiness, upNotDown){
		jerkiness = Math.abs(jerkiness) || 1;
		return new TwoQuadBoxScrollAnimation( quads, upNotDown ? "UP" : "DOWN", jerkiness );
	}
}
module.exports = TwoQuadBoxScrollAnimation;