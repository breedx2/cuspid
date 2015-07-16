
function boxScroll( quad, direction, jerkiness ){
	jerkiness = Math.abs(jerkiness) || 1;

	var fn = function _incFunction(){
		var offset = new THREE.Vector2( 0, 0 );

		// GL texture coordinates (UVs) are floating point numbers in range 0..1,
		// so divide jerkiness by the source img width/height
		var img = quad.material.uniforms['texture'].value.image;
		switch( direction ) {
			case 'LEFT':  offset.x = jerkiness / img.width; break;
			case 'RIGHT': offset.x = -jerkiness / img.width; break;
			case 'UP':    offset.y = jerkiness / img.height; break;
			case 'DOWN':  offset.y = -jerkiness / img.height; break;
			default:
				throw new Error("Unknown direction: " + direction);
				break;
		}

		quad.material.uniforms['uvOffset'].value.add( offset );
	};

	return fn;
}