
function BoxScrollAnimation( quad, direction, jerkiness ){
	this.quad = quad;
	this.direction = direction;
	this.jerkiness = Math.abs(jerkiness) || 1;
	this.offset = new THREE.Vector2( 0, 0 );
}

BoxScrollAnimation.prototype.tick = function(timeMult){

	// GL texture coordinates (UVs) are floating point numbers in range 0..1,
	// so divide jerkiness by the source img width/height
	var img = this.quad.material.uniforms['texture'].value.image;
	if(!img){
		return;
	}
	switch( this.direction ) {
		case 'LEFT':  this.offset.x = this.jerkiness / img.width; break;
		case 'RIGHT': this.offset.x = -this.jerkiness / img.width; break;
		case 'UP':    this.offset.y = -this.jerkiness / img.height; break;
		case 'DOWN':  this.offset.y = this.jerkiness / img.height; break;
		default:
			throw new Error("Unknown direction: " + this.direction);
			break;
	}

	this.offset.multiplyScalar( timeMult );
	quad.material.uniforms['uvOffset'].value.add( this.offset );
}

BoxScrollAnimation.scrollLeft = function( quad, jerkiness){
	return BoxScrollAnimation.scrollHoriz( quad, jerkiness, true);
}

BoxScrollAnimation.scrollRight = function( quad, jerkiness){
	return BoxScrollAnimation.scrollHoriz( quad, jerkiness, false);
}

BoxScrollAnimation.scrollHoriz = function( quad, jerkiness, leftNotRight){
	jerkiness = Math.abs(jerkiness) || 1;
	return new BoxScrollAnimation( quad, leftNotRight ? "LEFT" : "RIGHT", jerkiness );
}

BoxScrollAnimation.scrollDown = function( quad, jerkiness){
	return BoxScrollAnimation.scrollVert( quad, jerkiness, false);
}

BoxScrollAnimation.scrollUp = function( quad, jerkiness){
	return BoxScrollAnimation.scrollVert( quad, jerkiness, true);
}

//could probably combine this with horiz for code reuse/deduplication, but f it
BoxScrollAnimation.scrollVert = function( quad, jerkiness, upNotDown){
	jerkiness = Math.abs(jerkiness) || 1;
	return new BoxScrollAnimation( quad, upNotDown ? "UP" : "DOWN", jerkiness );
}
