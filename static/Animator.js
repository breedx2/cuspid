const DEFAULT_ANIM_DURATION = 33;

function Animator(options){
	this.options = options;
	this.running = false;
	this.prevFrameTime = (new Date()).getTime();
	this.animRequest = null;
}

Animator.prototype.start = function(){
	if(this.running){
		return console.log("ANIMATOR NOT STARTING -- already running");
	}
	console.log("STARTING ANIMATOR");
	this.running = true;
	this._perFrame();
	return this;
};

Animator.prototype.stop = function(){
	console.log("STOPPING");
	this.running = false;

	// Cancel pending perFrame() calls
	if( this.animRequest ) cancelAnimationFrame( this.animRequest );
	this.animRequest = null;

	return this;
};

Animator.prototype.deltaDuration = function(delta){
	this.options.duration = Math.max(1, this.options.duration + delta);
	return this;
};

Animator.prototype.duration = function(duration){
	this.options.duration = duration;
	return this;
};

Animator.prototype.restart = function(){
	this.stop();
	this.start();
};

Animator.prototype.pause = function(){
	if(this.running){
		return this.stop();
	}
	return this.start();
}

Animator.prototype.deltaZoom = function(amount){
	if('deltaZoom' in this.options.animation){
		console.log('Adjusting zoom by ' + amount);
		this.options.animation.deltaZoom(amount);
	}
	else {
		console.log('This animation does not support zooming');
	}
}

Animator.prototype._perFrame = function(){
	if( !this.running ) return;	// we're dead

	this.animRequest = requestAnimationFrame( this._perFrame.bind(this) );

	// Frame rate may not be constant 60fps. Time between frames determines how
	// quickly to advance animations.
	var now = (new Date()).getTime();
	var elapsed = (now - this.prevFrameTime) * 0.001;	// ms to seconds
	var timeMult = elapsed * 60.0;			// Animations are cooked at 60fps, I think? So timeMult is ~1.0 when computer is achieving 60fps
	timeMult = Math.min( 4.0, timeMult );	// Prevent grievous skipping

	// Faster/slower speed, depending on .options.duration.
	timeMult *= (1.0/DEFAULT_ANIM_DURATION) * this.options.duration;

	this.prevFrameTime = now;

	// Advance the animation
	this.options.animation.tick(timeMult);

	this.options.renderer.render( scene, camera );

	if(this.options.stats){
		this.options.stats.update();
	}
}

Animator.prototype._render = function(){
	this.options.renderer.render( this.options.scene, this.options.camera );
}

// a pretty interesting mistake
/*
function stretchRightCompactor(imgId, speed){
	var canvas = $('#cnv').get(0);
    var context = canvas.getContext('2d');
    var img = $('#' + imgId).get(0);
	var x = 0;
	function paint(){
		var xp = x * 1.0 / img.width;
		var cx = context.canvas.width * xp;
		context.drawImage(img, x, 0, img.width-x, img.height, 0, 0, cx, context.canvas.height);
		if(x > 0){	//paint rest
			context.drawImage(img, 0, 0, x, img.height, cx+1, 0, context.canvas.width-cx+1, context.canvas.height);
		}
		x = x + 1;	// TODO: Speed offset/increment > 1??
		if(x >= img.width){
			x = 0;
		}
	}
	var timer = setInterval(paint, speed);
}
*/
