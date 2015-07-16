
//ok not really palette, more like a rolling intensity or something
function rotatePalette( quad, direction, jerkiness ){
	var fn = function _rotateFunction(){
		var dir = (jerkiness/0xff) * ((direction==='DOWN') ? -1 : 1);
		quad.material.uniforms['colorCycle'].value += dir;
	}

	return fn;
}
