

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
			this.running = false;
			console.log("STOPPING");
			clearInterval(this.animTimer);
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

function scrollLeft( quad, jerkiness){
	return scrollHoriz( quad, jerkiness, true);
}

function scrollRight( quad, jerkiness){
	return scrollHoriz( quad, jerkiness, false);
}

function scrollHoriz( quad, jerkiness, leftNotRight){
	jerkiness = Math.abs(jerkiness) || 1;
	return boxScroll( quad, leftNotRight ? "LEFT" : "RIGHT", jerkiness );
}

function scrollDown( quad, jerkiness){
	return scrollVert( quad, jerkiness, false);
}

function scrollUp( quad, jerkiness){
	return scrollVert( quad, jerkiness, true);
}

//could probably combine this with horiz for code reuse/deduplication, but f it
function scrollVert( quad, jerkiness, upNotDown){
	jerkiness = Math.abs(jerkiness) || 1;
	return boxScroll( quad, upNotDown ? "UP" : "DOWN", jerkiness );
}

function zoomIn( quad, jerkiness ){
	return zoomer( quad, "IN", Math.abs(jerkiness) || 1);
}

function zoomOut( quad, jerkiness ){
	return zoomer( quad, "OUT", Math.abs(jerkiness) || 1);
}

function paletteUp( quad, jerkiness){
	return rotatePalette( quad, "UP", jerkiness );
}

function paletteDown( quad, jerkiness ){
	return rotatePalette( quad, "DOWN", jerkiness );
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
