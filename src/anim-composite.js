'use strict';

const THREE = require('three');
function CompositeAnimation(animations){
	this.animations = animations;
}

CompositeAnimation.prototype.tick = function(timeMult){
	this.animations.forEach(function(delegate){
		delegate.tick(timeMult);
	});
}

module.exports = CompositeAnimation;
