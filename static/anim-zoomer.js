
//TODO: Be able to use canvas aspect ratio instead of stretching
function zoomer(imgId, direction, jerkiness){
	var canvas = $('#cnv').get(0);
    var context = canvas.getContext('2d');
    var img = $('#' + imgId).get(0);

	var box = initialBox(img, direction);
	var incFunction = _incFunction(img, direction, jerkiness);
	return function(){
		_blit(img, context, box, {x: 0, y: 0, dx: canvas.width, dy: canvas.height});
		box = incFunction(box, direction);
		if((box.dx > img.width) || (box.dx < 1) || (box.dy > img.width) || (box.dy < 1) || (box.x < 0) || (box.y < 0)){
			box = initialBox(img, direction);
		}
	}

	function initialBox(img, direction){
		if(direction == "OUT"){
			return {x: img.width/2, y: img.height/2, dx: 1, dy: 1};
		}
		else {
			return {x: 0, y: 0, dx: img.width, dy: img.height};
		}
	}

	function _incFunction(img, direction, jerkiness){
		// var ratio = img.width * 1.0 / img.height;
		switch(direction){
			case "IN":
				return function(box){
					//TODO: Need to consider aspect ratio?
					var dx = box.dx - jerkiness;
					var dy = box.dy - jerkiness;
					return {x: (img.width / 2) - (dx/2), y: (img.height/2) - (dy/2), dx: dx, dy: dy}
				}
			case "OUT":
				return function(box){
					//TODO: Need to consider aspect ratio?
					var dx = box.dx + jerkiness;
					var dy = box.dy + jerkiness;
					return {x: (img.width / 2) - (dx/2), y: (img.height/2) - (dy/2), dx: dx, dy: dy}
				}
			default: 
				throw new Error("Unknown direction " + direction + ", must be IN or OUT");
		}
	}
}
