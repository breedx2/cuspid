
function cuspidLoad(){
	resizeCanvasToWindow();
	window.onresize = function(event){
		resizeCanvasToWindow();
	}
}

function resizeCanvasToWindow(){
	var canvas = document.getElementById('cnv');
	var context = canvas.getContext('2d');
	context.canvas.width = window.innerWidth - 10;
	context.canvas.height = window.innerHeight - 10;
}