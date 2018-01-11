'use strict';

const osc = require('osc');

// handles OSC events over websocket

function start(){
  const url = `ws://${location.host}/controls`;
  console.log(`Connecting to websocket on ${url}`);
  const socket = new WebSocket(url);
  socket.onopen = (event) => {
    console.log('OMFG OPENED');
    const id = 'tony99';
    socket.send(`listen::${id}`);
  };
  socket.onmessage = event => {
    // console.log(`recv: `, event.data);
    console.log(JSON.parse(event.data));
  }
}

module.exports = {
  start
};
