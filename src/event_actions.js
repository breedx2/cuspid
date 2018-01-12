'use strict';


const THREE = require('three');
const Animator = require('./Animator');
const TwoQuadBoxScrollAnimation = require('./anim-twoquadboxscroll');
const ZoomAnimation = require('./anim-zoomer');
const PaletteAnimation = require('./anim-palette');
const ImageSequence = require('./anim-image-sequence');

class EventActions {
  constructor(scene, camera, animator, textures, stats, renderer, quads){
      this.scene = scene;
      this.camera = camera;
      this.animator = animator;
      this.textures = textures;
      this.stats = stats;
      this.renderer = renderer;
      this.quads = quads; //maybe this shouldn't be here?
  }

  pause(what){
    this.animator.pause(what);
  }

  speedUp(amount = 5){
    console.log(`Increasing animation speed ${amount}`);
    if(this._currentlyImageSequence()){
      return this.animator.options.animation.faster(5 * amount);
    }
    this.animator.deltaDuration(amount);
  }

  slowDown(amount = 5){
    console.log(`Slowing animation speed ${amount}`);
    if(this._currentlyImageSequence()){
      return this.animator.options.animation.slower(5 * amount);
    }
    this.animator.deltaDuration(-1 * amount);
  }

  speed(delay){
    console.log(`setting duration to ${delay}`);
    this.animator.duration(delay);
  }

  zoomOut(amount = -0.1){
    console.log(`Zoom out ${amount}`);
    this.animator.deltaZoom(amount);
  }

  zoomIn(amount = 0.1){
    console.log(`Zoom in ${amount}`);
    this.animator.deltaZoom(-1 * amount);
  }

  zoom(zoomLevel){
    this.animator.zoom(zoomLevel);
  }

  nudgeLeft(amount = 0.1){
    this.animator.deltaX(-1 * amount);
  }

  nudgeRight(amount = 0.1){
    this.animator.deltaX(amount);
  }

  toggleFps(){
    if(!this.stats){
      return;
    }
    const display = this.stats.domElement.style.display;
    this.stats.domElement.style.display = (display==='none') ? 'block' : 'none';
  }

  toggleDotPass(){
    this.animator.toggleDotPass();
  }

  toggleGlitchPass(){
    this.animator.toggleGlitchPass();
  }

  // Toggle smooth/pixelated image scaling
  toggleInterpolation(){
    this.textures.forEach(texture => {
      let filter = texture.minFilter;
      console.log( 'eh?',filter );
      texture.minFilter = texture.magFilter = (filter===THREE.LinearFilter) ? THREE.NearestFilter : THREE.LinearFilter;
      texture.needsUpdate = true;	// Texture has changed, so tell ThreeJS to update it
    });
  }

  deltaY(amount){
    return this.animator.deltaY(amount);
  }

  deltaDotScale(amount){
    this.animator.deltaDotScale(amount);
  }

  repaint(){
    this.animator.options.paint();
  }

  nextImage(event){
    if(this._currentlyBoxScrolling()){
      return console.log('skipping next for box scroll');
    }
    // THIS IS STILL A TOTAL HACK THAT SHOULD BE ENCAPSULATED ELSEWHERE...
    const oldQuad = this.quads.shift();
    oldQuad.material.uniforms['colorCycle'].value = 0.0;
    this.quads.push(oldQuad);
    //sneak the new quad into the existing animator's animation
    this.quads[0].position.copy(new THREE.Vector3(0, 0, 0.0));
    this.animator.options.animation.quad = this.quads[0];
    this.scene.add(this.quads[0]);
    this.scene.remove(oldQuad);
  }

  modeLeft(){
    if(this._currentlyBoxScrolling()){
      if(this.animator.options.animation.direction === 'RIGHT'){
        return this.animator.options.animation.reverse();
      }
    }
    this._changeAnimation(TwoQuadBoxScrollAnimation.scrollLeft(this.quads, this.animator.options.jerkiness));
  }

  modeRight(){
    if(this._currentlyBoxScrolling()){
      if(this.animator.options.animation.direction === 'LEFT'){
        return this.animator.options.animation.reverse();
      }
    }
    this._changeAnimation(TwoQuadBoxScrollAnimation.scrollRight(this.quads, this.animator.options.jerkiness));
  }

  modeUp(){
    if(TwoQuadBoxScrollAnimation.prototype.isPrototypeOf(this.animator.options.animation)){
      if(this.animator.options.animation.direction === 'DOWN'){
        return this.animator.options.animation.reverse();
      }
    }
    this._changeAnimation(TwoQuadBoxScrollAnimation.scrollUp(this.quads, this.animator.options.jerkiness));
  }

  modeDown(){
    if(TwoQuadBoxScrollAnimation.prototype.isPrototypeOf(this.animator.options.animation)){
      if(this.animator.options.animation.direction === 'UP'){
        return this.animator.options.animation.reverse();
      }
    }
    this._changeAnimation(TwoQuadBoxScrollAnimation.scrollDown(this.quads, this.animator.options.jerkiness));
  }

  modeZoomIn(){
    return this._changeAnimation(ZoomAnimation.zoomIn(this.quads[0], this.animator.options.jerkiness));
  }

  modeZoomOut(){
    return this._changeAnimation(ZoomAnimation.zoomOut(this.quads[0], this.animator.options.jerkiness));
  }

  modeImageSequence(){
    this._changeAnimation(ImageSequence.build(this.quads));
  }

  modePaletteDown(){
    this._changeAnimation(PaletteAnimation.paletteDown(this.quads[0], this.animator.options.jerkiness));
  }

  modePaletteUp(){
    this._changeAnimation(PaletteAnimation.paletteUp(this.quads[0], this.animator.options.jerkiness));
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

  _currentlyBoxScrolling(){
    return TwoQuadBoxScrollAnimation.prototype.isPrototypeOf(this.animator.options.animation);
  }

  _currentlyImageSequence(){
    return ImageSequence.prototype.isPrototypeOf(this.animator.options.animation);
  }
}

module.exports = EventActions;