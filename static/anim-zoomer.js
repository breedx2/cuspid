
function ZoomAnimation( quad, direction, jerkiness, easing ){
	this.quad = quad;
	this.direction =  direction;
	this.jerkiness = jerkiness;
	this.phase = 0.0;	// 0..1
	this.easing = easing || 'QUADRATIC';
}

ZoomAnimation.prototype.tick = function(timeMult){
	var scale = this._computeScale(timeMult);
	quad.scale.copy(scale);
}

ZoomAnimation.prototype._computeScale = function(timeMult){
	this.phase = this._computePhase(timeMult);
	switch(this.easing){
		case 'QUADRATIC':
			var x = 1.0 + this.phase * 10.0; //width
			var y = 1.0 + (this.phase * this.phase) * 80.0; //height (start slow, end fast)
			return new THREE.Vector3(x, y, 1.0);
		case 'LINEAR':
			break;
		default:
			console.log("UNKNOWN EASING: " + this.easing);
	}
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
