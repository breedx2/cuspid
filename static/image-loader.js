
var ImageLoader = {
	loadAndCrop: function(url, callback){
		var img = new Image();
		img.onload = function() {
			console.log("Image loaded. Original dimensions: " + img.width + "x" + img.height);
			var dimension = Math.min(img.width, img.height);
			console.log("First cropping to " + dimension + "x" + dimension);
			var pow2Dim = ImageLoader.closestPow2(dimension);
			console.log("And then stretching to " + pow2Dim + "x" + pow2Dim);
			var cnv = $('<canvas/>')
                .attr({
                     width: pow2Dim,
                     height: pow2Dim
                 })
                .hide()
                .appendTo('body');
            var ctx = cnv.get(0).getContext('2d');
            var cropCoords = {
				topLeft: {
					x: (img.width - dimension)/2,
					y: (img.height - dimension)/2
				},
				bottomRight: {
					x: img.width - ((img.width - dimension)/2),
					y: img.height - ((img.height - dimension)/2)
				}
            };
            ctx.drawImage(img, cropCoords.topLeft.x, cropCoords.topLeft.y, 
				dimension, dimension, 0, 0, 
				pow2Dim, pow2Dim);
			var base64ImageData = cnv.get(0).toDataURL();
			var result = new Image();
			result.onload = function() {
				$('body').append(result);
				cnv.remove();
				callback(result);
			};
			result.src = base64ImageData;
		};
		img.src = url;
	},
	// Finds the closest power of two to the given number
	closestPow2: function(num){
		var check = 2;
		while(true){
			var next = 2 * check;
			var d1 = num - check;
			var d2 = num - next;
			if(d2 <= 0){	// Gone above
				return Math.abs(d1) < Math.abs(d2) ? check : next;
			}
			check = next;
		}
	}
}
