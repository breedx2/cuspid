'use strict';

const express = require('express');
const osc = require('osc');
const _ = require('lodash');

const app = express();
const expressWs = require('express-ws')(app);

app.use('/static', express.static(__dirname + '/static', {
	index: false
}));
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.get('/workspace', function(req, res){
	res.render('workspace', {});
});

app.listen(8080);
console.log("Server listening on port 8080");

const clientMap = {};

// EXTERNAL CONTROL OSC PORT
const oscUdpPort = 1984;
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscUdpPort
});
udpPort.on('message', message => {
	console.log('got message: ', message);
	clientMap['tony99'].forEach(ws => {
		ws.send(JSON.stringify(message));
	});
});
udpPort.open();

app.ws('/controls', (ws, req) => {
	ws.on('error', e => {
		console.log(`ERROR on a client websocket: ${e}`);
	});
	ws.on('close', e => {
		console.log(`client websocket closed. ${e}`);
		clientMap[id]
	});
  ws.on('message', msg => {
		if(msg.match(/^listen::/)){
			const id = msg.replace(/^listen::/, '');
			if(_.isEmpty(clientMap[id])){
				clientMap[id] = [];
			}
			clientMap[id].push(ws);
			console.log(`Added new client for ${id}`);
			return ws.send(`ok::${id}`);
		}
		ws.send('Unknown message');
  });
});
