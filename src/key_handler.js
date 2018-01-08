'use strict';

const THREE = require('three');
const toggleKeys = require('./gui').toggleKeys;
const Animator = require('./Animator');
const TwoQuadBoxScrollAnimation = require('./anim-twoquadboxscroll');
const ZoomAnimation = require('./anim-zoomer');
const PaletteAnimation = require('./anim-palette');
const ImageSequence = require('./anim-image-sequence');

class KeyHandler {

    constructor(scene, camera, animator, textures, stats, renderer, quads){
        this.scene = scene;
        this.camera = camera;
        this.animator = animator;
        this.textures = textures;
        this.stats = stats;
        this.renderer = renderer;
        this.quads = quads; //maybe this shouldn't be here?
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
        ' ': this._pause.bind(this),
        '+': this._speedUp.bind(this),
        '-': this._slowDown.bind(this),
        'z': this._zoomOut.bind(this),
        'Z': this._zoomIn.bind(this),
        'f': this._toggleFps.bind(this),
        'i': this._toggleInterpolation.bind(this),
        'k': event => toggleKeys(),
        'n': this._nextImage.bind(this),
        'ArrowLeft': this._leftArrow.bind(this),
        'ArrowRight': this._rightArrow.bind(this),
        'ArrowUp': this._upArrow.bind(this),
        'ArrowDown': this._downArrow.bind(this),
        'Enter': this._paint.bind(this)
      }
    }

    _pause(event){
    	this.animator.pause();
    }

    _speedUp(event){
      console.log("Increasing animation speed");
      if(this._currentlyImageSequence){
        return this.animator.options.animation.faster(25);
      }
      this.animator.deltaDuration(5);
    }

    _slowDown(event){
      console.log("Slowing animation speed");
      if(this._currentlyImageSequence){
        return this.animator.options.animation.slower(25);
      }
      this.animator.deltaDuration(-5);
    }

    _zoomOut(event){
      console.log('Zoom out');
      this.animator.deltaZoom(-0.1);
    }

    _zoomIn(event){
      console.log('Zoom in');
      this.animator.deltaZoom(0.1);
    }

    _toggleFps(event){
      if(!this.stats){
        return;
      }
      const display = this.stats.domElement.style.display;
      this.stats.domElement.style.display = (display==='none') ? 'block' : 'none';
    }

    // Toggle smooth/pixelated image scaling
    _toggleInterpolation(event){
      this.textures.forEach(texture => {
        let filter = texture.minFilter;
        console.log( 'eh?',filter );
        texture.minFilter = texture.magFilter = (filter===THREE.LinearFilter) ? THREE.NearestFilter : THREE.LinearFilter;
        texture.needsUpdate = true;	// Texture has changed, so tell ThreeJS to update it
      });
    }

    _nextImage(event){
      if(this._currentlyBoxScrolling()){
        return console.log('skipping next for box scroll');
      }
      // THIS IS STILL A TOTAL HACK THAT SHOULD BE FIXED...
      let oldQuad = this.quads.shift();
      this.quads.push(oldQuad);
      //sneak the new quad into the existing animator's animation
      this.quads[0].position.copy(new THREE.Vector3(0, 0, 0.0));
      this.animator.options.animation.quad = this.quads[0];
      this.scene.add(this.quads[0]);
      this.scene.remove(oldQuad);
    }

    _leftArrow(event){
      if(event.shiftKey && event.ctrlKey){
        return console.log("UNBOUND");
      }
      if(event.shiftKey){
        return this._changeAnimation(PaletteAnimation.paletteDown(this.quads[0], this.animator.options.jerkiness));
      }
      if(event.ctrlKey){
        return this.animator.deltaX(-0.1);
      }
      if(this._currentlyBoxScrolling()){
        if(this.animator.options.animation.direction === 'RIGHT'){
          return this.animator.options.animation.reverse();
        }
      }
      this._changeAnimation(TwoQuadBoxScrollAnimation.scrollLeft(this.quads, this.animator.options.jerkiness));
    }

    _rightArrow(event){
      if(event.shiftKey && event.ctrlKey){
        return console.log("UNBOUND");
      }
      if(event.shiftKey){
        console.log(this.animator.options.jerkiness);
        return this._changeAnimation(PaletteAnimation.paletteUp(this.quads[0], this.animator.options.jerkiness));
      }
      if(event.ctrlKey){
        return this.animator.deltaX(0.1);
      }
      if(this._currentlyBoxScrolling()){
        if(this.animator.options.animation.direction === 'LEFT'){
          return this.animator.options.animation.reverse();
        }
      }
      this._changeAnimation(TwoQuadBoxScrollAnimation.scrollRight(this.quads, this.animator.options.jerkiness));
    }

    _currentlyBoxScrolling(){
      return TwoQuadBoxScrollAnimation.prototype.isPrototypeOf(this.animator.options.animation);
    }

    _currentlyImageSequence(){
      return ImageSequence.prototype.isPrototypeOf(this.animator.options.animation);
    }

    _upArrow(event){
      if(event.shiftKey && event.ctrlKey){	//ctrl+shift up arrow
        return console.log("UNBOUND");
      }
      if(event.shiftKey){						//shift up arrow
        return this._changeAnimation(ZoomAnimation.zoomIn(this.quads[0], this.animator.options.jerkiness));
      }
      if(event.ctrlKey){						//control up arrow
        return this.animator.deltaY(-0.1);
      }
      if(TwoQuadBoxScrollAnimation.prototype.isPrototypeOf(this.animator.options.animation)){
        if(this.animator.options.animation.direction === 'DOWN'){
          return this.animator.options.animation.reverse();
        }
      }
      this._changeAnimation(TwoQuadBoxScrollAnimation.scrollUp(this.quads, this.animator.options.jerkiness));
    }

    _paint(event){
      this.animator.options.paint();
    }

    _downArrow(event){
      if(event.shiftKey && event.ctrlKey){	//ctrl+shift down arrow
        return console.log("UNBOUND");
      }
      if(event.shiftKey){						//shift down arrow
        return this._changeAnimation(ZoomAnimation.zoomOut(this.quads[0], this.animator.options.jerkiness));
      }
      if(event.ctrlKey){						//control down arrow
        return this.animator.deltaY(0.1);
      }
      if(TwoQuadBoxScrollAnimation.prototype.isPrototypeOf(this.animator.options.animation)){
        if(this.animator.options.animation.direction === 'UP'){
          return this.animator.options.animation.reverse();
        }
      }
      this._changeAnimation(TwoQuadBoxScrollAnimation.scrollDown(this.quads, this.animator.options.jerkiness));
    }

    _changeAnimation(animation){
    	if(this.animator){
    		this.animator.stopAndReset();
    	}
    	this.animator = new Animator({
    		renderer: this.renderer,
    		scene: this.scene,
    		camera: this.camera,
    		stats: this.stats,
    		jerkiness: this.animator.options.jerkiness,
    		duration: this.animator.options.duration,
    		imageIds: this.animator.options.imageIds,
    		animation: animation
    	});
    	this.animator.start(true);
    }
}

module.exports = KeyHandler;
