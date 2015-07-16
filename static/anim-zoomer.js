
function zoomer( quad, direction, jerkiness ){
	var phase = 0.0;	// 0..1

	var fn = function _zoomFunction( timeMult ){
		var img = quad.material.uniforms['texture'].value.image;
		switch(direction){
			case "IN":     phase += (jerkiness / img.width) * timeMult; break;
			case "OUT":    phase -= (jerkiness / img.width) * timeMult; break;
			default:
				throw new Error("Unknown direction " + direction + ", must be IN or OUT");
				break;
		}

		// wrap phase between 0..1
		if( phase >= 1.0 ) phase -= 1.0;
		if( phase < 0.0 ) phase += 1.0;

		quad.scale.set(
			1.0 + phase*10.0,          // X (width)
			1.0 + (phase*phase)*80.0,  // Y (height) with quadratic easing (start slow, end fast)
			1.0                        // Z never changes
		);
	}

	return fn;
}
