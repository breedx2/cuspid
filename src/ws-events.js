'use strict';

const osc = require('osc');
const gui = require('./gui');

// handles OSC events over websocket

const RECONNECT_DELAY = 1000;

class ControlSocket {

  constructor(eventActions, clientId){
    this.eventActions = eventActions;
    this.clientId = clientId;
    this.socket = null;
    this.reconnectTimer = null;
    this.wantReconnect = true;
  }

  connect(){
    const url = `${location.protocol.replace(/http/, 'ws')}//${location.host}/controls`;
    console.log(`Connecting to websocket on ${url} for ${this.clientId}`);
    this.socket = new WebSocket(url);
    this.wantReconnect = true;
    this.socket.addEventListener('open', e => this.onOpen(e));
    this.socket.addEventListener('message', e => this.onMessage(e));
    this.socket.addEventListener('close', e => this.onClose(e));
    this.socket.addEventListener('error', e => this.onError(e));
  }

  disconnect(){
    this.wantReconnect = false;
    gui.wsConnectStatus(false);
    this.clearTimer();
    this.socket.close();
  }

  onOpen(event) {
    console.log('control websocket established');
    gui.wsConnectStatus(true);
    this.clearTimer();
    this.socket.send(`listen::${this.clientId}`);
  }

  clearTimer(){
    if(this.reconnectTimer){
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null;
    }
  }

  onMessage(event){
    if(event.data.startsWith('{')){
      return handleControlEvent(JSON.parse(event.data), this.eventActions, this.clientId);
    }
    console.log(`recv: `, event.data);
  };

  onClose(event){
    console.log('websocket closed.');
    this.socket.close();
    if(this.wantReconnect){
      this.reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY);
    }
  };

  onError(event){
    console.log('websocket error: ', event);
  };

}

function handleControlEvent(oscEvent, eventActions, id){
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
   imageSequence: () => eventActions.modeImageSequence(),
   zoomSequenceIn: () => eventActions.modeZoomSequenceIn(),
   zoomSequenceOut: () => eventActions.modeZoomSequenceOut()
 }
 modeSwitch[modeName]();
}


module.exports = {
  ControlSocket
}
