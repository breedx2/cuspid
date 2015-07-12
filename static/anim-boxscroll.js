
function boxScroll(imgId, direction, jerkiness, startBox){
	var canvas = $('#cnv').get(0);
    var context = canvas.getContext('2d');
    var img = $('#' + imgId).get(0);

	jerkiness = Math.abs(jerkiness) || 1;
    if(startBox.dx == "FULL") { startBox.dx = img.width; }
    if(startBox.dy == "FULL") { startBox.dy = img.height; }

	var box = {x: startBox.x, y: startBox.y, dx: startBox.dx, dy: startBox.dy };
	var incFunction = _incFunction(direction, jerkiness);
    return function(){

    	var srcBox = _getSourceBox(box, img);
    	console.log("box: " + JSON.stringify(box) + ", srcBox: " + JSON.stringify(srcBox));

    	var dstBox = _getDestBox(srcBox, img, canvas, direction);
    	console.log("                                    dstBox: " + JSON.stringify(dstBox));

    	//now paint, maybe twice
    	_blit(img, context, srcBox[0], dstBox[0]);
    	if(srcBox.length > 1){
    		_blit(img, context, srcBox[1], dstBox[1]);
    	}

		box = incFunction(box);
		box = _wrapToImageDimensions(box, img);
    }
}


function _getSourceBox(box, img){
    var box1 = {
        x: box.x,
        y: box.y,
        dx: box.dx,
        dy: box.dy
    }
    if(box.x < 0){  //before left edge
        box1.x = img.width + box.x;
        box1.dx = -1 * box.x;
        return [ box1, { x: 0, y: box.y, dx: box.dx - box1.dx, dy: box.dy} ];
    }
    if(box.x + box.dx > img.width){ //past right edge
        box1.dx = img.width - box1.x;
        return [ box1, { x: 0, y: box.y, dx: box.dx - box1.dx, dy: box.dy}];
    }
    if(box.y < 0){  //above top
        console.log("ABOVE TOP");
        box1.y = img.height + box.y;
        box1.dy = -1 * box.y;
        return [ box1, { x: box.x, y: 0, dx: box.dx, dy: box.dy - box1.dy} ];   
    }
    if(box.y + box.dy > img.height){    //below bottom
        console.log("BELOW BOTTOM");
        box1.dy = img.height - box1.y;
        return [ box1, { x: box.x, y: 0, dx: box.dx, dy: box.dy - box1.dy}];
    }
    return [box];
    //TODO: doesn't handle scrolling by both x and y
}

function _getDestBox(srcBox, img, canvas, direction){
    if(srcBox.length == 1){
        return [{x: 0, y: 0, dx: canvas.width, dy: canvas.height}];
    }
    var boxdx = srcBox[0].dx + srcBox[1].dx;
    var boxdy = srcBox[0].dy + srcBox[1].dy;
    var px0 = srcBox[0].dx * 1.0 / boxdx;   //first box horizontal percent
    var py0 = srcBox[0].dy * 1.0 / boxdy;   //first box vertical percent
    // var px1 = srcBox[1].dx * 1.0 / boxdx;    //second box horizontal percent
    // var py1 = srcBox[1].dy * 1.0 / img.height;   //second box vertical percent
    // var width0 = px0 * canvas.width;
    // var height0 = py0 * canvas.height;

    if(direction == "LEFT" || direction == "RIGHT"){
        return [
            {x: 0, y: 0, dx: Math.round(canvas.width * px0), dy: canvas.height},
            {x: Math.round(canvas.width * px0), y: 0, dx: canvas.width - Math.round(canvas.width * px0), dy: canvas.height}
        ]   
    }
    else{
        return [
            {x: 0, y: 0, dx: canvas.width, dy: Math.round(canvas.height * py0)},
            {x: 0, y: Math.round(canvas.height * py0), dx: canvas.width, dy: canvas.height - Math.round(canvas.height * py0)}
        ]
    }
    
    console.log("Shouldn't be here yet, f it...");
}

function _wrapToImageDimensions(box, img){
    var x = box.x, y = box.y, dx = box.dx, dy = box.dy;
    if(x >= img.width){ x = 0; }
    if(y >= img.height){ y = 0; }
    if(x + dx <= 0){ x = img.width - dx; }
    if(y + dy <= 0){ y = img.height - dy; }
    return { x: x, y: y, dx: dx, dy: dy };
}

function _incFunction(direction, jerkiness){
    switch(direction){
        case "UP":
            return function(box){ 
                return {x: box.x, y: box.y + jerkiness, dx: box.dx, dy: box.dy}
            }
        case "DOWN":
            return function(box){
                return {x: box.x, y: box.y - jerkiness, dx: box.dx, dy: box.dy}
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
