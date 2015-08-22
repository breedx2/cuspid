
function scrollLeft( quad, jerkiness){
	return scrollHoriz( quad, jerkiness, true);
}

function scrollRight( quad, jerkiness){
	return scrollHoriz( quad, jerkiness, false);
}

function scrollHoriz( quad, jerkiness, leftNotRight){
	jerkiness = Math.abs(jerkiness) || 1;
	return boxScroll( quad, leftNotRight ? "LEFT" : "RIGHT", jerkiness );
}

function scrollDown( quad, jerkiness){
	return scrollVert( quad, jerkiness, false);
}

function scrollUp( quad, jerkiness){
	return scrollVert( quad, jerkiness, true);
}

//could probably combine this with horiz for code reuse/deduplication, but f it
function scrollVert( quad, jerkiness, upNotDown){
	jerkiness = Math.abs(jerkiness) || 1;
	return boxScroll( quad, upNotDown ? "UP" : "DOWN", jerkiness );
}

function boxScroll( quad, direction, jerkiness ){
	jerkiness = Math.abs(jerkiness) || 1;

	var fn = function _scrollFunction( timeMult ){
		var offset = new THREE.Vector2( 0, 0 );

		// GL texture coordinates (UVs) are floating point numbers in range 0..1,
		// so divide jerkiness by the source img width/height
		var img = quad.material.uniforms['texture'].value.image;
		switch( direction ) {
			case 'LEFT':  offset.x = jerkiness / img.width; break;
			case 'RIGHT': offset.x = -jerkiness / img.width; break;
			case 'UP':    offset.y = -jerkiness / img.height; break;
			case 'DOWN':  offset.y = jerkiness / img.height; break;
			default:
				throw new Error("Unknown direction: " + direction);
				break;
		}

		offset.multiplyScalar( timeMult );

		quad.material.uniforms['uvOffset'].value.add( offset );
	};

	return fn;
}
