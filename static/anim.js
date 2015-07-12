

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

function scrollDown(imgId, jerkiness){
	return scrollVert(imgId, jerkiness, false);
}

function scrollUp(imgId, jerkiness){
	return scrollVert(imgId, jerkiness, true);
}

//could probably combine this with horiz for code reuse/deduplication, but f it
function scrollVert(imgId, jerkiness, upNotDown){
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

//TODO: Add srcX and srcY
function boxScroll(imgId, direction, jerkiness, srcWidth, srcHeight){
	var canvas = $('#cnv').get(0);
    var context = canvas.getContext('2d');
    var img = $('#' + imgId).get(0);

	jerkiness = Math.abs(jerkiness) || 1;
    if(srcWidth == "FULL") { srcWidth = img.width; }
    if(srcHeight == "FULL") { srcHeight = img.height; }

	var box = {x: 0, y: 0, dx: srcWidth, dy: srcHeight};
	var incFunction = _incFunction(direction, jerkiness);
    return function(){

    	var srcBox = _getSourceBox(box, img);
    	console.log("box: " + JSON.stringify(box) + ", srcBox: " + JSON.stringify(srcBox));

    	var dstBox = _getDestBox(srcBox, img, canvas);
    	console.log("                    dstBox: " + JSON.stringify(dstBox));

    	//maybe paint twice

    	_blit(img, context, srcBox[0], dstBox[0]);
    	if(srcBox.length > 1){
    		_blit(img, context, srcBox[1], dstBox[1]);
    	}

		box = incFunction(box);
		box = _wrapToImageDimensions(box, img);
    }
}

function _blit(img, context, src, dst){
	console.log("BLIT: ", src.x, src.y, src.dx, src.dy, dst.x, dst.y, dst.dx, dst.dy);
	context.drawImage(img, src.x, src.y, src.dx, src.dy, dst.x, dst.y, dst.dx, dst.dy);
}

function _getSourceBox(box, img){
	var box1 = {
		x: box.x,
		y: box.y,
		dx: box.dx,
		dy: box.dy
	}
	if(box1.x < 0){	//before left edge
		box1.x = img.width + box1.x;
		box1.dx = img.width - box1.x;
		return [ box1, { x: 0, y: box.y, dx: box1.x, dy: box.dy} ];
	}
	if(box1.x + box1.dx > img.width){	//past right edge
		box1.dx = img.width - box1.x;
		return [ box1, { x: 0, y: box.y, dx: box.dx - box1.dx, dy: box.dy}];
	}
	return [box];
	//TODO: do y scrolly parts
	//TODO: doesn't handle scrolling by both x and y
}

function _getDestBox(srcBox, img, canvas){
	if(srcBox.length == 1){
		return [{x: 0, y: 0, dx: canvas.width, dy: canvas.height}];
	}
	var px0 = srcBox[0].dx * 1.0 / img.width;	//first box horizontal percent
	var py0 = srcBox[0].dy * 1.0 / img.height;	//first box vertical percent
	var px1 = srcBox[1].dx * 1.0 / img.width;	//second box horizontal percent
	var py1 = srcBox[1].dy * 1.0 / img.height;	//second box vertical percent
	var width0 = px0 * canvas.width;
	var height0 = py0 * canvas.height;
	
	return [
		{x: 0, y: 0, dx: Math.round(canvas.width * px0), dy: canvas.height},
		{x: Math.round(canvas.width * px0), y: 0, dx: Math.round(px1 * canvas.width), dy: canvas.height}
	]
	console.log("Shouldn't be here yet, f it...");
}

function _wrapToImageDimensions(box, img){
	var x = box.x, y = box.y, dx = box.dx, dy = box.dy;
	if(x >= img.width){ x = 0; }
	if(y >= img.height){ y = 0; }
	if(x + dx <= 0){ x = img.width - 1; }
	if(y + dy < 0){ y = img.height - 1; }
	return { x: x, y: y, dx: dx, dy: dy };
}

function _incFunction(direction, jerkiness){
	switch(direction){
		case "UP":
			return function(box){ 
				return {x: box.x, y: box.y - jerkiness, dx: box.dx, dy: box.dy}
			}
		case "DOWN":
			return function(box){
				return {x: box.x, y: box.y + jerkiness, dx: box.dx, dy: box.dy}
			}
		case "LEFT":
			return function(box){ 
				return {x: box.x + jerkiness, y: box.y, dx: box.dx, dy: box.dy}
			}
		case "RIGHT":
			return function(box){ 
				return {x: box.x - jerkiness, y: box.y, dx: box.dx, dy: box.dy}
			}
		default:
			throw new Error("Unknown direction: " + direction);
	}
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