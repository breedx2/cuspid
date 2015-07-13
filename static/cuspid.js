
var DEFAULT_DURATION = 55;
var animation = null;

function cuspidLoad(){
	resizeCanvasToWindow();
	window.onresize = function(event){
		resizeCanvasToWindow();
	}
	loadImages();
	$('body').get(0).addEventListener('keydown', handleKey);
}

function handleKey(event){
	console.log('I saw this key: ' + event.keyCode);
	if(animation && (event.keyCode == 32)){
		animation.pause();
	}
	else if(animation && (event.keyCode == 187) && (event.shiftKey)){
		console.log("Slowing animation speed");
		animation.deltaDuration(5);
	}
	else if(animation && (event.keyCode == 189) && (!event.shiftKey)){
		console.log("Increasing animation speed");
		animation.deltaDuration(-5);
	}
	else if((event.keyCode == 39) && (!event.shiftKey)){	//right arrow
		changeAnimation(scrollRight);
	}
	else if((event.keyCode == 37) && (!event.shiftKey)){	//left arrow
		changeAnimation(scrollLeft);
	}
	else if((event.keyCode == 38) && (!event.shiftKey)){	//up arrow
		changeAnimation(scrollUp);
	}
	else if((event.keyCode == 40) && (!event.shiftKey)){	//down arrow
		changeAnimation(scrollDown);
	}
	else if((event.keyCode == 38) && (event.shiftKey)){		//shift up arrow
		changeAnimation(zoomIn);
	}
	else if((event.keyCode == 40) && (event.shiftKey)){		//shift down arrow
		changeAnimation(zoomOut);
	}
	else if((event.keyCode == 39) && (event.shiftKey)){		//shift right arrow
		changeAnimation(paletteUp);
	}
	else if((event.keyCode == 37) && (event.shiftKey)){	//shift left arrow
		changeAnimation(paletteDown);
	}
	else if(event.keyCode == 13){	//enter key
		animation.options.paint();
	}
}

function changeAnimation(func){
	if(!animation){
		return;
	}
	animation.stop();
	animation = animate({
		duration: animation.options.duration,
		imageIds: animation.options.imageIds,
		paint: func(animation.options.imageIds[0], animation.options.jerkiness || 5)
	});
	animation.start();
}

function resizeCanvasToWindow(){
	var canvas = $('#cnv').get(0);
	var context = canvas.getContext('2d');
	context.canvas.width = window.innerWidth - 10;
	context.canvas.height = window.innerHeight - 10;
}

function imageLoaded(id){
	//TODO: All images must be converted to grayscale!
	animation = animate({
		duration: 33,//DEFAULT_DURATION,
		imageIds: [id],
		// paint: scrollDown(id, 10)
		// paint: boxScroll(id, "DOWN", 10, {x: 6, y: 0, dx: 120, dy: 80})
		jerkiness: 5,
		// paint: zoomer(id, "OUT", 5)
		paint: rotatePalette(id, "DOWN", 21)
	});
	animation.start();
}

function loadImages(){
	$('#imagepool').append("<img src='/static/cuspid.jpg' id='cuspid' onload='imageLoaded(\"cuspid\")'/>");
}
