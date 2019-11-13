'use strict';

const cache = {};

const ImageLoader = {
	loadAndCrop: function(url){
		return new Promise( (fulfill, reject) => {
			if(cache[url]){
				console.log(`Image ${url} loaded from cache!`);
				return fulfill(cache[url]);
			}
			let img = newImage(url);
			img.onload = function() {
				console.log("Image loaded. Original dimensions: " + img.width + "x" + img.height);
				const dimension = Math.min(img.width, img.height);
				console.log("First cropping to " + dimension + "x" + dimension);
				const pow2Dim = closestPow2(dimension);
				console.log("And then stretching to " + pow2Dim + "x" + pow2Dim);
				const cnv = document.createElement('canvas');
				cnv.width = pow2Dim;
				cnv.height = pow2Dim;
				cnv.style.display = 'none';
        const ctx = cnv.getContext('2d');
        const cropCoords = {
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
				const base64ImageData = cnv.toDataURL();
				const result = newImage(url);
				result.onload = function() {
					cache[url] = result;
					console.log("Image was loaded and cropped/scaled");
					fulfill(result);
				};
				result.src = base64ImageData;
			};
		});
	},
}

function newImage(url){
	const img = new Image();
	img.src = url;
	img.url = url;
	return img;
}

// Finds the closest power of two to the given number
function closestPow2(num){
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


module.exports = ImageLoader;
