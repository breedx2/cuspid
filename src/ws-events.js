'use strict';

const osc = require('osc');
const gui = require('./gui');

// handles OSC events over websocket

const RECONNECT_DELAY = 1000;

function start(eventActions){
  const url = `ws://${location.host}/controls`;
  console.log(`Connecting to websocket on ${url}`);

  let connTimer = null;
  const socket = new WebSocket(url);

  socket.addEventListener('open', event => {
    console.log('control websocket established');
    gui.wsConnectStatus(true);
    if(connTimer){
      clearInterval()
      connTimer = null;
    }
    const id = 'tony99';
    socket.send(`listen::${id}`);
  });
  socket.addEventListener('message', event => {
    if(event.data.startsWith('{')){
      return handleControlEvent(JSON.parse(event.data), eventActions);
    }
    console.log(`recv: `, event.data);
  });

  socket.addEventListener('close', event => {
    console.log('websocket closed.');
    gui.wsConnectStatus(false);
    socket.close();
    if(!connTimer){
      connTimer = setTimeout(() => start(eventActions), RECONNECT_DELAY);
    }
  });
  socket.addEventListener('error', event => {
    console.log('websocket error: ', event);
  });
}

function handleControlEvent(oscEvent, eventActions){
 const id = 'tony99';
 switch(oscEvent.address){
   case `/${id}/mode`:
    return switchMode(oscEvent.args[0], eventActions);
  case `/${id}/togglePause`:
    return eventActions.pause();
  case `/${id}/nextImage`:
    return eventActions.nextImage();
  case `/${id}/toggleInterpolation`:
    return eventActions.toggleInterpolation();
  case `/${id}/toggleFps`:
    return eventActions.toggleFps();
  case `/${id}/toggleDotPass`:
    return eventActions.toggleDotPass();
  case `/${id}/dotPass`:
    return eventActions.toggleDotPass(oscEvent.args[0]);
  case `/${id}/dotScale`:
    return eventActions.dotScale(oscEvent.args[0]);
  case `/${id}/deltaDotScale`:
    return eventActions.deltaDotScale(oscEvent.args[0]);
  case `/${id}/toggleGlitchPass`:
    return eventActions.toggleGlitchPass();
  case `/${id}/glitchPass`:
    return eventActions.toggleGlitchPass(oscEvent.args[0]);
  case `/${id}/pause`:
    return eventActions.pause(oscEvent.args[0]);
  case `/${id}/speedUp`:
    return eventActions.speedUp(oscEvent.args[0]);
  case `/${id}/speed`:
    return eventActions.speed(oscEvent.args[0]);
  case `/${id}/slowDown`:
    return eventActions.slowDown(oscEvent.args[0]);
  case `/${id}/zoom`:
    return eventActions.zoom(oscEvent.args[0]);
  case `/${id}/nudgeLeft`:
    return eventActions.nudgeLeft(oscEvent.args[0]);
  case `/${id}/nudgeRight`:
    return eventActions.nudgeRight(oscEvent.args[0]);
  case `/${id}/nudgeUp`:
    return eventActions.nudgeUp(oscEvent.args[0]);
  case `/${id}/nudgeDown`:
    return eventActions.nudgeDown(oscEvent.args[0]);
 }
 console.log(oscEvent)
}

function switchMode(modeName, eventActions){
 const modeSwitch = {
   up: () => eventActions.modeUp(),
   down: () => eventActions.modeDown(),
   left: () => eventActions.modeLeft(),
   right: () => eventActions.modeRight(),
   zoomIn: () => eventActions.modeZoomIn(),
   zoomOut: () => eventActions.modeZoomOut(),
   paletteUp: () => eventActions.modePaletteUp(),
   paletteDown: () => eventActions.modePaletteDown(),
   imageSequence: () => eventActions.modeImageSequence()
 }
 modeSwitch[modeName]();
}


module.exports = {
  start
}
