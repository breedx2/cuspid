

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

function scrollLeft(imgId, jerkiness){
	return scrollHoriz(imgId, jerkiness, true);
}

function scrollRight(imgId, jerkiness){
	return scrollHoriz(imgId, jerkiness, false);
}

function scrollHoriz(imgId, jerkiness, leftNotRight){
	jerkiness = Math.abs(jerkiness) || 1;
	return boxScroll(imgId, leftNotRight ? "LEFT" : "RIGHT", jerkiness, 
						{ x: 0, y: 0, dx: "FULL", dy: "FULL"});
}

function scrollDown(imgId, jerkiness){
	return scrollVert(imgId, jerkiness, false);
}

function scrollUp(imgId, jerkiness){
	return scrollVert(imgId, jerkiness, true);
}

//could probably combine this with horiz for code reuse/deduplication, but f it
function scrollVert(imgId, jerkiness, upNotDown){
jerkiness = Math.abs(jerkiness) || 1;
	return boxScroll(imgId, upNotDown ? "UP" : "DOWN", jerkiness, 
						{ x: 0, y: 0, dx: "FULL", dy: "FULL"});
}

function _blit(img, context, src, dst){
	// console.log("BLIT: ", src.x, src.y, src.dx, src.dy, dst.x, dst.y, dst.dx, dst.dy);
	context.drawImage(img, src.x, src.y, src.dx, src.dy, dst.x, dst.y, dst.dx, dst.dy);
}

// a pretty interesting mistake
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