
function ZoomAnimation( quad, direction, jerkiness, easing ){
	this.quad = quad;
	if(ZoomAnimation._DIR_MULT[direction] == null){
		throw new Error("Unknown direction " + direction + ", must be IN or OUT");
	}
	this.direction =  direction;
	this.jerkiness = jerkiness;
	this.easing = easing || 'LINEAR';
	if(this.easing == 'QUADRATIC'){
		this.phase = 0.0;	// 0..1
	}
	else if(this.easing == 'LINEAR'){
		this.phase = {
			dx: this.quad.material.uniforms['texture'].value.image.width,
		}
	}
}

ZoomAnimation.prototype.tick = function(timeMult){
	var scale = this._computeScale(timeMult);
	this.quad.scale.copy(scale);
}

ZoomAnimation.prototype._computeScale = function(timeMult){
	switch(this.easing){
		case 'QUADRATIC':
			this.phase = this._computePhaseQuadratic(timeMult);
			console.log(`phase: ${this.phase}`);
			var x = 1.0 + (this.phase * 10.0); //width
			var y = 1.0 + ((this.phase * this.phase) * 80.0); //height (start slow, end fast)
			return new THREE.Vector3(x, y, 1.0);
		case 'LINEAR':
			this.phase = this._computePhaseLinear(timeMult);
			var x = this.phase.perc;
			var y = this.phase.perc;
			return new THREE.Vector3(x, y, 1.0);
		default:
			throw new Error("UNKNOWN EASING: " + this.easing);
	}
}

ZoomAnimation._DIR_MULT = { 'IN': -1, 'OUT': 1};

ZoomAnimation.prototype._computePhaseQuadratic = function(timeMult){
	var img = this.quad.material.uniforms['texture'].value.image;
	var dir = ZoomAnimation._DIR_MULT[this.direction];
	var result = this.phase + (dir * (this.jerkiness / img.width) * timeMult);
	return ZoomAnimation._wrap(result);
};

ZoomAnimation.prototype._computePhaseLinear = function(timeMult){
	var img = this.quad.material.uniforms['texture'].value.image;
	var dir = ZoomAnimation._DIR_MULT[this.direction];
	var dx = this.phase.dx + (dir * this.jerkiness * timeMult);
	if(dx < img.width / 16){
		dx = img.width;
	}
	if(dx > img.width){
		dx = img.width / 16;
	}
	return {
		dx: dx,
		perc: img.width * 1.0 / dx
	}
};

ZoomAnimation._wrap = function(value){
	// wrap phase between 0..1
	if( value >= 1.0 ) return 0;
	if( value < 0.0 ) return 1.0;
	return value;
}

ZoomAnimation.zoomIn = function( quad, jerkiness ){
	return new ZoomAnimation( quad, "IN", Math.abs(jerkiness) || 1);
}

ZoomAnimation.zoomOut = function( quad, jerkiness ){
	return new ZoomAnimation( quad, "OUT", Math.abs(jerkiness) || 1);
}
