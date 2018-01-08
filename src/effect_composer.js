'use strict';

const THREE = require('three');

function build(options){
	const rtParameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat,
		stencilBuffer: true
	};
	const webGlTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParameters);
	const composer = new THREE.EffectComposer(options.renderer, webGlTarget);
	const angle = 0.5;
	const scale = 0.5;
	const dotScreenPass = new THREE.DotScreenPass(new THREE.Vector2(0, 0), angle, scale);
	composer.addPass( new THREE.RenderPass( options.scene, options.camera ) );
	composer.addPass( dotScreenPass);

	const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
	effectCopy.renderToScreen = true;
	composer.addPass(effectCopy);
	composer.clock = new THREE.Clock();
	return composer;
}

module.exports = {
  build
}
