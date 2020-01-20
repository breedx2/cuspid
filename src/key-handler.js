'use strict';

const gui = require('./gui');
const eventActions = require('./event-actions.js');

class KeyHandler {

    constructor(eventActions){
      this.eventActions = eventActions;
      this.enabled = true;
    }

    handleKey(event){
      if(!this.enabled) return;
      console.log(event);
      const handler = this._keyMap()[event.key];
      if(!handler){
        return console.log('unbound');
      }
      return handler(event);
    }

    disable(){
      this.enabled = false;
    }

    enable(){
      this.enabled = true;
    }

    _keyMap(){
      const self = this;
      return {
        '?': () => gui.toggleKeys(),
        'k': () => gui.toggleKeys(),
        'c': () => this.enabled = !gui.toggleClientId(() => {
            gui.toggleClientId();
            self.enabled = true;
        }),
        'Escape': () => gui.dismissOverlays(),
        ' ': () => this.eventActions.pause(),
        '+': () => this.eventActions.speedUp(5),
        '-': () => this.eventActions.slowDown(5),
        'z': () => this.eventActions.zoomOut(0.1),
        'Z': () => this.eventActions.zoomIn(0.1),
        'f': () => this.eventActions.toggleFps(),
        'd': () => this.eventActions.toggleDotPass(),
        'i': () => this.eventActions.toggleInterpolation(),
        'I': () => this.eventActions.toggleInvertPass(),
        'n': () => this.eventActions.nextImage(),
        'q': () => this.eventActions.deltaDotScale(-0.02),
        'w': () => this.eventActions.deltaDotScale(0.02),
        's': () => this.eventActions.modeImageSequence(),
        'S': () => this.eventActions.modeStillImage(),
        't': () => this.eventActions.modeZoomSequenceIn(),
        'T': () => this.eventActions.modeZoomSequenceOut(),
        'b': () => this.eventActions.modeBlend(),
        'g': () => this.eventActions.toggleGlitchPass(),
        'F': () => this.eventActions.advanceOneFrame(),
        '[': () => this.eventActions.biasDelta(-0.01),
        ']': () => this.eventActions.biasDelta(0.01),
        '1': () => this.eventActions.useQuadSet1(),
        '2': () => this.eventActions.useQuadSet2(),
        '\\': () => this.eventActions.toggleAddImages(),
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
