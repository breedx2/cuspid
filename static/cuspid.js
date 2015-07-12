
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
	else if(event.keyCode == 39){
		changeDirection(scrollRight);
	}
	else if(event.keyCode == 37){
		changeDirection(scrollLeft);
	}
	else if(event.keyCode == 38){
		changeDirection(scrollUp);
	}
	else if(event.keyCode == 40){
		changeDirection(scrollDown);
	}
	else if(event.keyCode == 13){	//enter key
		animation.options.paint();
	}
}

function changeDirection(func){
	if(!animation){
			return;
		}
		animation.stop();
		animation = animate({
			duration: animation.options.duration,
			imageIds: animation.options.imageIds,
			paint: func(animation.options.imageIds[0], 10)
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
		duration: 40,//DEFAULT_DURATION,
		imageIds: [id],
		// paint: scrollDown(id, 10)
		paint: boxScroll(id, "LEFT", 10, {x: 0, y: 0, dx: 85, dy: "FULL"})
	});
	animation.start();
}

function loadImages(){
	$('#imagepool').append("<img src='/static/cuspid.jpg' id='cuspid' onload='imageLoaded(\"cuspid\")'/>");
}
