
//ok not really palette, more like a rolling intensity or something
function rotatePalette( quad, direction, jerkiness ){
	return function(){
		rotate( quad, direction, jerkiness );
	}

	function rotate( quad, direction, jerkiness ){
		var dir = (jerkiness/0xff) * ((direction==='DOWN') ? -1 : 1);
		quad.material.uniforms['colorCycle'].value += dir;
		if( Math.random()<0.02 ) console.log( quad.material.uniforms );
	}
}
