
function ZoomAnimation( quad, direction, jerkiness ){
	this.quad = quad;
	this.direction =  direction;
	this.jerkiness = jerkiness;
	this.phase = 0.0;	// 0..1
}

ZoomAnimation.prototype.tick = function(timeMult){
	this.phase = this._computePhase(timeMult);
	quad.scale.set(
		1.0 + this.phase * 10.0,          // X (width)
		1.0 + (this.phase * this.phase) * 80.0,  // Y (height) with quadratic easing (start slow, end fast)
		1.0                        // Z never changes
	);
}

ZoomAnimation.prototype._computePhase = function(timeMult){
	var img = this.quad.material.uniforms['texture'].value.image;
	var result = this.phase;	
	switch(this.direction){
		case "IN":
			result += (this.jerkiness / img.width) * timeMult; 
			break;
		case "OUT":
		    result -= (this.jerkiness / img.width) * timeMult; 
		    break;
		default:
			throw new Error("Unknown direction " + this.direction + ", must be IN or OUT");
			break;
	}

	// wrap phase between 0..1
	if( result >= 1.0 ) result -= 1.0;
	if( result < 0.0 ) result += 1.0;
	return result;
}

ZoomAnimation.zoomIn = function( quad, jerkiness ){
	return new ZoomAnimation( quad, "IN", Math.abs(jerkiness) || 1);
}

ZoomAnimation.zoomOut = function( quad, jerkiness ){
	return new ZoomAnimation( quad, "OUT", Math.abs(jerkiness) || 1);
}
