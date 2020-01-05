'use strict';


const THREE = require('three');
const Animator = require('./Animator');
const TwoQuadBoxScrollAnimation = require('./anim-twoquadboxscroll');
const ZoomAnimation = require('./anim-zoomer');
const ZoomSeqAnimation = require('./anim-zoomer-seq');
const PaletteAnimation = require('./anim-palette');
const ImageSequence = require('./anim-image-sequence');
const BlendAnimation = require('./anim-blend')
const gui = require('./gui');

class EventActions {
  constructor(scene, camera, animator, stats, renderer, quads){
      this.scene = scene;
      this.camera = camera;
      this.animator = animator;
      this.stats = stats;
      this.renderer = renderer;
      this.quads = quads; //maybe this shouldn't be here?
  }

  pause(what){
    const res = this.animator.pause(what);
    gui.showHideDecoration(!res.running);
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
    if(this._currentlyImageSequence()){
      console.log(`setting duration to ${5 * delay}`);
      return this.animator.options.animation.setTime(5 * delay);
    }
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

  biasDelta(amount){
    console.log(`Bias delta: ${amount}`);
    this.animator.biasDelta(amount);
  }

  bias(amount){
    this.animator.bias(amount);
  }

  nudgeLeft(amount = 0.1){
    this.animator.deltaX(-1 * amount);
  }

  nudgeRight(amount = 0.1){
    this.animator.deltaX(amount);
  }

  nudgeUp(amount = 0.1){
    this.animator.deltaY(amount);
  }

  nudgeDown(amount = 0.1){
    this.animator.deltaY(-1 * amount);
  }

  toggleFps(){
    if(!this.stats){
      return;
    }
    const display = this.stats.domElement.style.display;
    this.stats.domElement.style.display = (display==='none') ? 'block' : 'none';
  }

  toggleDotPass(what){
    if(typeof what === 'undefined'){
      return this.animator.toggleDotPass();
    }
    what == 1 ? this.animator.enableDotPass() : this.animator.disableDotPass();
  }

  toggleGlitchPass(what){
    if(typeof what === 'undefined'){
      return this.animator.toggleGlitchPass();
    }
    what == 1 ? this.animator.enableGlitchPass() : this.animator.disableGlitchPass();
  }

  toggleInvertPass(what){
    if(typeof what === 'undefined'){
      return this.animator.toggleInvertPass();
    }
    what == 1 ? this.animator.enableInvertPass() : this.animator.disableInvertPass();
  }

  // Toggle smooth/pixelated image scaling
  toggleInterpolation(){
    const textures = this.quads.map(q => q.material.uniforms.texture.value);
    textures.forEach(texture => {
      let filter = texture.minFilter;
      console.log( 'eh?',filter );
      texture.minFilter = texture.magFilter = (filter===THREE.LinearFilter) ? THREE.NearestFilter : THREE.LinearFilter;
      texture.needsUpdate = true;	// Texture has changed, so tell ThreeJS to update it
    });
  }

  deltaY(amount){
    return this.animator.deltaY(amount);
  }

  dotScale(scale){
    this.animator.dotScale(scale);
  }

  deltaDotScale(amount){
    this.animator.deltaDotScale(amount);
  }

  repaint(){
    this.animator.options.paint();
  }

  nextImage(event){
    this.animator.nextImage();
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
    if(this._currentlyBoxScrolling()){
      if(this.animator.options.animation.direction === 'DOWN'){
        return this.animator.options.animation.reverse();
      }
    }
    this._changeAnimation(TwoQuadBoxScrollAnimation.scrollUp(this.quads, this.animator.options.jerkiness));
  }

  modeDown(){
    if(this._currentlyBoxScrolling()){
      if(this.animator.options.animation.direction === 'UP'){
        return this.animator.options.animation.reverse();
      }
    }
    this._changeAnimation(TwoQuadBoxScrollAnimation.scrollDown(this.quads, this.animator.options.jerkiness));
  }

  modeZoomIn(){
    return this._changeAnimation(ZoomAnimation.zoomIn(this.quads, 'LINEAR'));
  }

  modeZoomOut(){
    return this._changeAnimation(ZoomAnimation.zoomOut(this.quads, 'LINEAR'));
  }

  modeZoomSequenceIn(){
    return this._changeAnimation(ZoomSeqAnimation.zoomIn(this.quads, this.animator.options.jerkiness));
  }

  modeZoomSequenceOut(){
    return this._changeAnimation(ZoomSeqAnimation.zoomOut(this.quads, this.animator.options.jerkiness));
  }

  modeBlend(){
    return this._changeAnimation(new BlendAnimation(this.quads));
  }

  modeImageSequence(){
    this._changeAnimation(ImageSequence.build(this.quads));
  }

  modePaletteDown(){
    this._changeAnimation(PaletteAnimation.paletteDown(this.quads, this.animator.options.jerkiness));
  }

  modePaletteUp(){
    this._changeAnimation(PaletteAnimation.paletteUp(this.quads, this.animator.options.jerkiness));
  }

  advanceOneFrame(){
    this.animator.advanceOneFrame();
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
  		animation: animation,
      effectComposer: this.animator.effectComposer
  	});
  	this.animator.start(true);
    gui.showHideDecoration(false);
  }

  _currentlyBoxScrolling(){
    return this.animator.running &&
      TwoQuadBoxScrollAnimation.prototype.isPrototypeOf(this.animator.options.animation);
  }

  _currentlyImageSequence(){
    return this.animator.running &&
      ImageSequence.prototype.isPrototypeOf(this.animator.options.animation);
  }
}

module.exports = EventActions;
