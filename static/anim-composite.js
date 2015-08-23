
function CompositeAnimation(animations){
	this.animations = animations;
}

CompositeAnimation.prototype.tick = function(timeMult){
	this.animations.forEach(function(delegate){
		delegate.tick(timeMult);
	});
}