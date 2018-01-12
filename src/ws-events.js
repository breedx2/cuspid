'use strict';

const osc = require('osc');

// handles OSC events over websocket

class WsEvents {

  constructor(eventActions){
    this.eventActions = eventActions;
  }

  start(){
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
        return this._handleControlEvent(JSON.parse(event.data));
      }
      console.log(`recv: `, event.data);
    };
 }

 _handleControlEvent(oscEvent){
   const id = 'tony99';
   switch(oscEvent.address){
     case `/${id}/mode`:
      return this._switchMode(oscEvent.args[0]);
    case `/${id}/togglePause`:
      return this.eventActions.pause();
    case `/${id}/nextImage`:
      return this.eventActions.nextImage();
    case `/${id}/toggleDotPass`:
      return this.eventActions.toggleDotPass();
    case `/${id}/toggleGlitchPass`:
      return this.eventActions.toggleGlitchPass();
    case `/${id}/pause`:
      return this.eventActions.pause(oscEvent.args[0]);
    case `/${id}/speedUp`:
      return this.eventActions.speedUp(oscEvent.args[0]);
    case `/${id}/speed`:
      return this.eventActions.speed(oscEvent.args[0]);
    case `/${id}/slowDown`:
      return this.eventActions.slowDown(oscEvent.args[0]);
    case `/${id}/zoom`:
      return this.eventActions.zoom(oscEvent.args[0]);
   }
   console.log(oscEvent)
 }

 _switchMode(modeName){
   const modeSwitch = {
     up: () => this.eventActions.modeUp(),
     down: () => this.eventActions.modeDown(),
     left: () => this.eventActions.modeLeft(),
     right: () => this.eventActions.modeRight(),
     zoomIn: () => this.eventActions.modeZoomIn(),
     zoomOut: () => this.eventActions.modeZoomOut(),
     paletteUp: () => this.eventActions.modePaletteUp(),
     paletteDown: () => this.eventActions.modePaletteDown(),
     imageSequence: () => this.eventActions.modeImageSequence()
   }
   modeSwitch[modeName]();
 }

}

module.exports = WsEvents;
