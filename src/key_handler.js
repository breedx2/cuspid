'use strict';

const toggleKeys = require('./gui').toggleKeys;
const eventActions = require('./event_actions.js');

class KeyHandler {

    constructor(eventActions){
      this.eventActions = eventActions;
    }

    handleKey(event){
      console.log(event);
      const handler = this._keyMap()[event.key];
      if(!handler){
        return console.log('unbound');
      }
      return handler(event);
    }

    _keyMap(){
      return {
        'k': () => toggleKeys(),
        ' ': () => this.eventActions.pause(),
        '+': () => this.eventActions.speedUp(5),
        '-': () => this.eventActions.slowDown(5),
        'z': () => this.eventActions.zoomOut(0.1),
        'Z': () => this.eventActions.zoomIn(0.1),
        'f': () => this.eventActions.toggleFps(),
        'd': () => this.eventActions.toggleDotPass(),
        'i': () => this.eventActions.toggleInterpolation(),
        'n': () => this.eventActions.nextImage(),
        'q': () => this.eventActions.deltaDotScale(-0.02),
        'w': () => this.eventActions.deltaDotScale(0.02),
        's': () => this.eventActions.modeImageSequence(),
        'g': () => this.eventActions.toggleGlitchPass(),
        'Enter': () => this.eventActions.repaint(),
        'ArrowLeft': this._leftArrow.bind(this),
        'ArrowRight': this._rightArrow.bind(this),
        'ArrowUp': this._upArrow.bind(this),
        'ArrowDown': this._downArrow.bind(this),
      }
    }

    _leftArrow(event){
      if(event.shiftKey && event.ctrlKey){
        return console.log("UNBOUND");
      }
      if(event.shiftKey){
        return this.eventActions.modePaletteDown();
      }
      if(event.ctrlKey){
        return this.eventActions.nudgeLeft(0.1);
      }
      this.eventActions.modeLeft();
    }

    _rightArrow(event){
      if(event.shiftKey && event.ctrlKey){
        return console.log("UNBOUND");
      }
      if(event.shiftKey){
        return this.eventActions.modePaletteUp();
      }
      if(event.ctrlKey){
        return this.eventActions.nudgeRight(0.1);
      }
      this.eventActions.modeRight();
    }

    _upArrow(event){
      if(event.shiftKey && event.ctrlKey){	//ctrl+shift up arrow
        return console.log("UNBOUND");
      }
      if(event.shiftKey){						//shift up arrow
        return this.eventActions.modeZoomIn();
      }
      if(event.ctrlKey){						//control up arrow
        return this.eventActions.deltaY(-0.1);
      }
      this.eventActions.modeUp();
    }

    _downArrow(event){
      if(event.shiftKey && event.ctrlKey){	//ctrl+shift down arrow
        return console.log("UNBOUND");
      }
      if(event.shiftKey){						//shift down arrow
        return this.eventActions.modeZoomOut();
      }
      if(event.ctrlKey){						//control down arrow
        return this.eventActions.deltaY(0.1);
      }
      this.eventActions.modeDown();
    }
}

module.exports = KeyHandler;
