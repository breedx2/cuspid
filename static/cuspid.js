
function cuspidLoad(){
	resizeCanvasToWindow();
	window.onresize = function(event){
		resizeCanvasToWindow();
	}
	loadImages();
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
	scrollLeft(id, 75, 5);
}

function loadImages(){
	$('#imagepool').append("<img src='/static/cuspid.jpg' id='cuspid' onload='imageLoaded(\"cuspid\")'/>");
}

function blitFull(id){
	var canvas = $('#cnv').get(0);
    var context = canvas.getContext('2d');
    var img = $('#' + id).get(0);
    context.drawImage(img, 0, 0, img.width, img.height, 0, 0, context.canvas.width, context.canvas.height);
}