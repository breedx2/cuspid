
var ImageLoader = {
	_cache: {},
	loadAndCrop: function(url){
		return new Promise( (fulfill, reject) => {
			if(ImageLoader._cache[url]){
				console.log(`Image ${url} loaded from cache!`);
				return fulfill(ImageLoader._cache[url]);
			}
			let img = ImageLoader._newImage(url);
			img.onload = function() {
				console.log("Image loaded. Original dimensions: " + img.width + "x" + img.height);
				let dimension = Math.min(img.width, img.height);
				console.log("First cropping to " + dimension + "x" + dimension);
				let pow2Dim = ImageLoader._closestPow2(dimension);
				console.log("And then stretching to " + pow2Dim + "x" + pow2Dim);
				let cnv = $('<canvas/>')
	                .attr({
	                     width: pow2Dim,
	                     height: pow2Dim
	                 })
	                .hide()
	                .appendTo('body');
	            let ctx = cnv.get(0).getContext('2d');
	            let cropCoords = {
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
				let base64ImageData = cnv.get(0).toDataURL();
				let result = ImageLoader._newImage(url);
				result.onload = function() {
					$('body').append(result);
					cnv.remove();
					ImageLoader._cache[url] = result;
					console.log("Image was loaded and cropped/scaled");
					fulfill(result);
				};
				result.src = base64ImageData;
			};
		});
	},
	_newImage(url){
		let img = new Image();
		img.src = url;
		img.url = url;
		return img;
	},
	// Finds the closest power of two to the given number
	_closestPow2: function(num){
		let check = 2;
		while(true){
			let next = 2 * check;
			let d1 = num - check;
			let d2 = num - next;
			if(d2 <= 0){	// Gone above
				return Math.abs(d1) < Math.abs(d2) ? check : next;
			}
			check = next;
		}
	}
}
