'use strict';

const THREE = require('three');

class CompositeAnimation {
	constructor(animations){
		this.animations = animations;
	}

	tick(timeMult){
		this.animations.forEach(function(delegate){
			delegate.tick(timeMult);
		});
	}

module.exports = CompositeAnimation;
