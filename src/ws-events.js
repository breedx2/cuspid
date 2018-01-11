'use strict';

const osc = require('osc');

// handles OSC events over websocket

function start(){
  const url = `ws://${location.host}/controls`;
  console.log(`Connecting to websocket on ${url}`);
  const socket = new WebSocket(url);
  socket.onopen = (event) => {
    console.log('control websocket established');
    const id = 'tony99';
    socket.send(`listen::${id}`);
  };
  socket.onmessage = event => {
    if(event.data.startsWith('{')){
      console.log(JSON.parse(event.data));

      //TODO: Dispatch this to event handlers

      return;
    }
    console.log(`recv: `, event.data);
  }
}

module.exports = {
  start
};
