
function TwoQuadBoxScrollAnimation( quad1, quad2, direction, jerkiness ){
	this.quad1 = quad1;
	this.quad2 = quad2;
	this.direction = direction;
	this.jerkiness = Math.abs(jerkiness) || 1;
	this.offset = new THREE.Vector2( 0, 0 );
	this.zoom = 1.0;
	this.position = { x: 0, y: 0};
}

TwoQuadBoxScrollAnimation.prototype.tick = function(timeMult){

	// GL texture coordinates (UVs) are floating point numbers in range 0..1,
	// so divide jerkiness by the source img width/height
	if(!this.quad1.material.uniforms['texture'].value.image){
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
	this.offset.multiplyScalar( timeMult );
	this.quad1.material.uniforms['uvOffset'].value.add( this.offset );
	this.quad1.scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
	this.quad1.position.copy(new THREE.Vector3(this.position.x, this.position.y, 0.0));

	this.quad2.scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
	let xmul = this._xmul();
	let ymul = this._ymul();
	let pos2 = {
		x: this.position.x + (xmul * 2 * this.zoom),
		y: this.position.y + (ymul * 2 * this.zoom)
	}
	this.quad2.position.copy(new THREE.Vector3(pos2.x, pos2.y, 0.0));
}

TwoQuadBoxScrollAnimation.prototype._xmul = function(){
	if((this.direction == 'UP') || (this.direction == 'DOWN')){
		return 0;
	}
	return (this.direction == 'RIGHT') ? -1 : 1;
}

TwoQuadBoxScrollAnimation.prototype._ymul = function(){
	if((this.direction == 'LEFT') || (this.direction == 'RIGHT')){
		return 0;
	}
	return (this.direction == 'UP') ? -1 : 1;
}

TwoQuadBoxScrollAnimation.prototype._swapQuads = function(){
	let tmp = this.quad1;
	this.quad1 = this.quad2;
	this.quad2 = tmp;
}

TwoQuadBoxScrollAnimation.prototype.deltaZoom = function( amount ){
	this.zoom = Math.max(1.0, this.zoom + amount);
	this.deltaX(0);
	this.deltaY(0);
}

TwoQuadBoxScrollAnimation.prototype.deltaY = function( amount ){
	this.position.y = this._clampPos(this.position.y, amount);
}

TwoQuadBoxScrollAnimation.prototype.deltaX = function( amount ){
	this.position.x = this._clampPos(this.position.x, amount);
}

TwoQuadBoxScrollAnimation.prototype._clampPos = function(cur, amount){
	var min = -1 * (this.zoom - 1.0);
	var max = this.zoom - 1.0;
	return Math.max(Math.min(cur + amount, max), min)
}

TwoQuadBoxScrollAnimation.scrollLeft = function( quad1, quad2, jerkiness){
	return TwoQuadBoxScrollAnimation.scrollHoriz( quad1, quad2, jerkiness, true);
}

TwoQuadBoxScrollAnimation.scrollRight = function( quad1, quad2, jerkiness){
	return TwoQuadBoxScrollAnimation.scrollHoriz( quad1, quad2, jerkiness, false);
}

TwoQuadBoxScrollAnimation.scrollHoriz = function( quad1, quad2, jerkiness, leftNotRight){
	jerkiness = Math.abs(jerkiness) || 1;
	return new TwoQuadBoxScrollAnimation( quad1, quad2, leftNotRight ? "LEFT" : "RIGHT", jerkiness );
}

TwoQuadBoxScrollAnimation.scrollDown = function( quad1, quad2, jerkiness){
	return TwoQuadBoxScrollAnimation.scrollVert( quad1, quad2, jerkiness, false);
}

TwoQuadBoxScrollAnimation.scrollUp = function( quad1, quad2, jerkiness){
	return TwoQuadBoxScrollAnimation.scrollVert( quad1, quad2, jerkiness, true);
}

//could probably combine this with horiz for code reuse/deduplication, but f it
TwoQuadBoxScrollAnimation.scrollVert = function( quad1, quad2, jerkiness, upNotDown){
	jerkiness = Math.abs(jerkiness) || 1;
	return new TwoQuadBoxScrollAnimation( quad1, quad2, upNotDown ? "UP" : "DOWN", jerkiness );
}
