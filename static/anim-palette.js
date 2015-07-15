
//ok not really palette, more like a rolling intensity or something
function rotatePalette(imgId, direction, jerkiness){
	var canvas = $('#cnv').get(0);
	var context = canvas.getContext('2d');
	var img = $('#' + imgId).get(0);

	var buffCanvas = document.createElement('canvas');
	var buffContext = buffCanvas.getContext('2d');

	buffContext.canvas.width = img.width;
	buffContext.canvas.height = img.height;
	buffContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
	var imageData = buffContext.getImageData(0, 0, img.width, img.height);

	return function(){
		rotate(imageData, direction, jerkiness);
		buffContext.putImageData(imageData, 0, 0);
		var srcBox = {x: 0, y: 0, dx: img.width, dy: img.height};
		var dstBox = {x: 0, y: 0, dx: canvas.width, dy: canvas.height};

		_blit(buffContext.canvas, context, srcBox, dstBox);
	}

	//TODO: Direction
	function rotate(imageData, direction, jerkiness){
		var data = imageData.data;
		for(var i = 0; i < data.length; i+=4){
			var val = (data[i] + jerkiness) % 256;  // TODO: Direction
			if(direction == "DOWN"){
				val = data[i] - jerkiness;
				if(val < 0){
					val = 255 + val;
				}
			}
			data[i + 0] = val;
			data[i + 1] = val;
			data[i + 2] = val;
		}
	}
}
