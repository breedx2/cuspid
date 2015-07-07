

function animate(options){

	return {
		options: options,
		animTimer: null,
		running: false,
		start: function(){
			this.animTimer = setInterval(this.options.paint, options.duration);
			this.running = true;
			return this;
		},
		stop: function(){
			clearInterval(this.animTimer);
			this.running = false;
			return this;
		},
		deltaDuration: function(delta){
			this.options.duration = Math.max(1, this.options.duration + delta);
			this.restart();
			return this;
		},
		duration: function(duration){
			this.options.duration = duration;
			this.restart();
			return this;
		},
		restart: function(){
			this.stop();
			this.start();
		},
		pause: function(){
			if(this.running){
				this.stop();
			}
			else{
				return this.start();
			}
		}
	}
}

function scrollLeft(imgId, speed, jerkiness){
	return scrollHoriz(imgId, speed, jerkiness, true);
}

function scrollRight(imgId, speed, jerkiness){
	return scrollHoriz(imgId, speed, jerkiness, false);
}

function scrollHoriz(imgId, speed, jerkiness, leftNotRight){
	jerkiness = Math.abs(jerkiness) || 1;
	var inc = leftNotRight ? 1 : -1;
	var canvas = $('#cnv').get(0);
    var context = canvas.getContext('2d');
    var img = $('#' + imgId).get(0);
	var x = 0;
	return function(){
		var xp = x * 1.0 / img.width;
		var cx = context.canvas.width * xp;
		context.drawImage(img, x, 0, img.width-x, img.height, 0, 0, context.canvas.width-cx, context.canvas.height);
		if(x > 0){	//paint rest
			context.drawImage(img, 0, 0, x, img.height, context.canvas.width-cx, 0, cx, context.canvas.height);
		}
		x = x + (inc * jerkiness);
		if(leftNotRight && (x > img.width)){
			x = 0;
		}
		else if(!leftNotRight && (x < 0)){
			x = img.width;
		}
	}
}

function scrollDown(imgId, speed, jerkiness){
	return scrollVert(imgId, speed, jerkiness, false);
}

function scrollUp(imgId, speed, jerkiness){
	return scrollVert(imgId, speed, jerkiness, true);
}

//could probably combine this with horiz for code reuse/deduplication, but f it
function scrollVert(imgId, speed, jerkiness, upNotDown){
	jerkiness = Math.abs(jerkiness) || 1;
	var inc = upNotDown ? 1 : -1;
	var canvas = $('#cnv').get(0);
    var context = canvas.getContext('2d');
    var img = $('#' + imgId).get(0);
	var y = 0;
	return function(){
		var yp = y * 1.0 / img.height;
		var cy = context.canvas.height * yp;
		context.drawImage(img, 0, y, img.width, img.height - y, 0, 0, context.canvas.width, context.canvas.height-cy);
		if(y > 0){	//paint rest
			context.drawImage(img, 0, 0, img.width, y, 0, context.canvas.height-cy, context.canvas.width, cy);
		}
		y = y + (inc * jerkiness);
		if(upNotDown && (y > img.height)){
			y = 0;
		}
		else if(!upNotDown && (y < 0)){
			y = img.height;
		}
	}
}

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