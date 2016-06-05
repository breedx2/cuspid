
//ok not really palette, more like a rolling intensity or something

function PaletteAnimation(quad, direction, jerkiness){
	this.quad = quad;
	this.quad.position.copy(new THREE.Vector3(0.0, 0.0, 0.0));
	this.direction = direction;
	this.jerkiness = jerkiness;
}

PaletteAnimation.prototype.tick = function(timeMult){
	var dir = (this.jerkiness/0xff) * ((this.direction==='DOWN') ? -1 : 1) * timeMult;
	this.quad.material.uniforms['colorCycle'].value += dir;
}

PaletteAnimation.paletteUp = function( quad, jerkiness){
	return new PaletteAnimation( quad, "UP", jerkiness );
}

PaletteAnimation.paletteDown = function( quad, jerkiness ){
	return new PaletteAnimation( quad, "DOWN", jerkiness );
}
