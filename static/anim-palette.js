
//ok not really palette, more like a rolling intensity or something


function paletteUp( quad, jerkiness){
	return rotatePalette( quad, "UP", jerkiness );
}

function paletteDown( quad, jerkiness ){
	return rotatePalette( quad, "DOWN", jerkiness );
}

function rotatePalette( quad, direction, jerkiness ){
	return function ( timeMult ){
		var dir = (jerkiness/0xff) * ((direction==='DOWN') ? -1 : 1) * timeMult;
		quad.material.uniforms['colorCycle'].value += dir;
	}
}
