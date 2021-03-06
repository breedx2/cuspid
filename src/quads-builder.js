'use strict';

const THREE = require('three');
const ImageLoader = require('./image-loader');
const VideoLoader = require('./video-loader');
const cuspidShader = require('./cuspid-shader');

async function load(sourceUrls){
	try {
		const textures = await loadTexturesFromUrls(sourceUrls);
		const quads = textures.map(buildQuad).filter(x => x != null);
		return (quads.length > 1) ? quads : [quads[0], quads[0]];
	}
	catch(err){
		console.error(`ERROR: ${err}`);
	}
}

async function loadTexturesFromUrls(sourceUrls){
	return Promise.all(
			sourceUrls.map(url => {
				const loader = chooseLoader(url);
				const textureBuilder = chooseTextureBuilder(url);
				return loader(url).then(textureBuilder);
			})
	);
}

function chooseLoader(url){
	if(url.tagName === "IMG"){	//already loaded image
		return x => Promise.resolve(x);
	}
	return isVideo(url) ?
		VideoLoader.load :
	 	ImageLoader.loadAndCrop;
}

function chooseTextureBuilder(url){
	return isVideo(url) ?
		buildVideoTexture :
	 	buildImageTexture;
}

function isVideo(url){
	if(url.tagName === "IMG") return false;
	return url.endsWith('.webm') || url.endsWith('.ogv') || url.endsWith('.mp4');
}

function buildImageTexture(image){
	const wrap = THREE.ClampToEdgeWrapping; //THREE.RepeatWrapping;
	const texture = new THREE.Texture(image, THREE.UVMapping, wrap, wrap,
		THREE.LinearFilter, THREE.LinearFilter,
		THREE.LuminanceFormat);
	texture.needsUpdate = true;
	return texture;
}

function buildVideoTexture(video){
	const wrap = THREE.ClampToEdgeWrapping;
	const texture = new THREE.VideoTexture(
		video, THREE.UVMapping, wrap, wrap,
		THREE.LinearFilter, THREE.LinearFilter,
		THREE.LuminanceFormat
	 );
	texture.needsUpdate = true;
	texture.video = video;
	return texture;
}

function buildQuad(texture){
	// Width & height are both 2.0, to completely fill our viewport (-1.0...1.0)
	const quadGeom = new THREE.PlaneBufferGeometry( 2.0, 2.0 );
	const quadMaterial = cuspidShader.createCuspidShaderMaterial( texture );
	const mesh = new THREE.Mesh( quadGeom, quadMaterial );
	if(texture.video){
		mesh.video = texture.video;
	}
	return mesh;
}


module.exports = {
  load
};
