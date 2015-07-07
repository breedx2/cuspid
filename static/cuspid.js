
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
}

function resizeCanvasToWindow(){
	var canvas = $('#cnv').get(0);
	var context = canvas.getContext('2d');
	context.canvas.width = window.innerWidth - 10;
	context.canvas.height = window.innerHeight - 10;
}

function imageLoaded(id){
	//TODO: All images must be converted to grayscale!
	// blitFull(id);
	//scrollRight(id, 125, 20);
	 //scrollDown(id, 55, 10);
	// scrollUp(id, 125, 20);
	animation = animate({
		duration: 55,
		paint: scrollDown(id, 55, 10)
	});
	animation.start();
}

function loadImages(){
	$('#imagepool').append("<img src='/static/cuspid.jpg' id='cuspid' onload='imageLoaded(\"cuspid\")'/>");
}
