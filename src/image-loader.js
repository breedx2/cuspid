'use strict';

const ImageLoader = {
	loadAndCrop: function(url){
		return new Promise( (fulfill, reject) => {
			const img = newImage(url);
			img.onload = imageOnLoad(url, img, fulfill, reject);
		});
	},
	loadAndCropFile: function(file){
		return readFile(file)
				.then(fileContent => {
					return new Promise((fulfill, reject) => {
						const img = document.createElement("img");
						img.onload = imageOnLoad(fileContent, img, fulfill, reject)
				    img.file = file;
				    img.src = fileContent;
					});
				});
	},
}

function imageOnLoad(url, img, fulfill, reject){
	return () => {
		const logurl = url.startsWith("data:") ? "<data url>" : url;
		console.log(`Image loaded from ${logurl}. Original dimensions: ${img.width}x${img.height}`);

		const cnv = cropAndStretch(img);
		if(cnv == null){ // no canvas, image was already set
			img.onload = null;
			return fulfill(img);
		}
		const base64ImageData = cnv.toDataURL();
		const finalImage = newImage(url);
		finalImage.onload = function() {
			console.log("Image was loaded and cropped/scaled");
			fulfill(finalImage);
		};
		img.onload = null;
		img.src = '';
		img.url = '';
		finalImage.src = base64ImageData;
	};
}

function cropAndStretch(img){
	const dimension = Math.min(img.width, img.height);
	const pow2Dim = closestPow2(dimension);

	const alreadySet = (img.width === dimension) && (img.height === dimension) &&
		(dimension === pow2Dim);

	if(alreadySet){
		console.log('Image is already ideal size! Sweet!');
		return null;
	}

	console.log("First cropping to " + dimension + "x" + dimension);
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
	return cnv;
}

function newImage(url){
	const img = new Image();
	img.src = url;
	img.url = url;
	return img;
}

// Finds the closest power of two to the given number
// Not exactly precise, but apparently widely used.
// If this is questionable, there's an alt impl in the history
function closestPow2(num){
	return Math.pow(2, Math.round(Math.log(num)/Math.log(2)));
}

function readFile(file){
	return new Promise((fulfill, reject) => {
		console.log('ImageLoader is reading file ', file);
		const reader = new FileReader();
		reader.addEventListener('loadend', function(e) {
			console.log('Image load finished');
			const fileData = reader.result;
			fulfill(fileData);
		});
		reader.readAsDataURL(file);
	});
}

module.exports = ImageLoader;
