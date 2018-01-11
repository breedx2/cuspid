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

const idToClients = {};

// EXTERNAL CONTROL OSC PORT
const oscUdpPort = 1984;
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscUdpPort
});
udpPort.on('message', message => {
	console.log('got message: ', message);
	idToClients['tony99'].forEach(ws => {
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
		for (const [clientId, clientList] of Object.entries(idToClients)) {
			const index = clientList.indexOf(ws);
			if(index >= 0){
				console.log(`Removing client from ${clientId}`);
				clientList.splice(index, 1);
			}
		}
	});
  ws.on('message', msg => {
		if(msg.match(/^listen::/)){
			const id = msg.replace(/^listen::/, '');
			if(_.isEmpty(idToClients[id])){
				idToClients[id] = [];
			}
			idToClients[id].push(ws);
			console.log(`Added new client for ${id}`);
			return ws.send(`ok::${id}`);
		}
		ws.send('Unknown message');
  });
});
