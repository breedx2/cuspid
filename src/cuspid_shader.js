'use strict';

const THREE = require('three');

function createCuspidShaderMaterial( firstTexture ){
	var vertexShader_ar = [
		"precision mediump float;",
		"precision mediump int;",

		"uniform mat4 modelViewMatrix;",
		"uniform mat4 projectionMatrix;",
		"attribute vec3 position;",
		"attribute vec2 uv;",
		"uniform vec2 uvOffset;",
		"varying vec2 v_uv;",	// better performance if values are pre-computed in the vertex shader

		"void main()	{",
		// Convert 3D Scene position to window position
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		// Pre-compute the UV coordinates for texture sampling
		" v_uv = uv + uvOffset;",
		"}",
	];
	var vertexShaderGLSL = vertexShader_ar.join("\n");

	var fragmentShader_ar = [
		"precision mediump float;",
		"precision mediump int;",

		"uniform sampler2D texture;",	// our texture
		"uniform float colorCycle;",	// 0..1, wraps around
		"varying vec2 v_uv;", // varying: This is set per-vertex in the vertex shader (above). The fragment shader interpolates the vertex values for each texel it computes.

		"void main()	{",
		" vec2 luma = vec2( texture2D( texture, v_uv ).r, 1.0 );",	// sample the texture, use the red value as brightness
		" luma.r = fract( min(luma.r, 0.999) + colorCycle );",	// add color cycling, set luminance to fractional part of the result
		" gl_FragColor = luma.xxxy;",	// Use swizzling (because it's fast). Set this texel's output RGBA color as a grayscale color with alpha 1.0.
		"}",
	];
	var fragmentShaderGLSL = fragmentShader_ar.join("\n");

	var uniforms = {
		texture:    { type: 't', value: firstTexture },
		uvOffset:   { type: 'v2', value: new THREE.Vector2( 0, 0 ) },
		colorCycle: { type: 'f', value: 0.0 },
	};

	return new THREE.RawShaderMaterial({
		vertexShader: vertexShaderGLSL,
		fragmentShader: fragmentShaderGLSL,
		uniforms: uniforms,
		depthTest: false,
		depthWrite: false,
		side: THREE.DoubleSide	// don't test culling
	});
}

module.exports = {
	createCuspidShaderMaterial
};
