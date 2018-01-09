'use strict';

const THREE = require('three');
require('three/CopyShader'); //monkey patches THREE
require('three/EffectComposer'); //monkey patches THREE, has to come before passes
require('three/ShaderPass'); //monkey patches THREE
require('three/DotScreenShader'); //monkey patches THREE
require('three/DotScreenPass'); //monkey patches THREE
require('three/DigitalGlitch'); //monkey patches THREE
require('three/GlitchPass');    //monkey patches THREE
require('three/RenderPass');    //monkey patches THREE
require('three/TexturePass');   //monkey patches THREE

const DOT_PASS = 'dotPass';
const GLITCH_PASS = 'glitchPass';

class EffectComposer {
  constructor(options, composer, enabled = []) {
    this.options = options;
    this.composer = composer;
    this.enabled = enabled;
  }

  render() {
    if (this._anyEnabled()) {
      this.composer.render(this.composer.clock.getDelta());
    }
  }

  toggleDotPass() {
    this._toggle(DOT_PASS);
  }

  setDotScale() {

  }

  deltaDotScale(amount) {
    this.options.dotScale = Math.max(0.05, this.options.dotScale + amount);
    this.composer = buildComposer(this.options, this.enabled);
  }

  toggleGlitchPass(){
    this._toggle(GLITCH_PASS);
  }

  _toggle(name){
    if (this.enabled.includes(name)) {
      console.log(`Disabling ${name}`);
      this.enabled.splice(this.enabled.indexOf(name), 1);
    }
    else {
      console.log(`Enabling ${name}`);
      this.enabled.push(name);
    }
    this.composer = buildComposer(this.options, this.enabled);
  }

  _anyEnabled() {
    return this.enabled.length > 0;
  }
}

function buildComposer(options, enabled = []) {
  if (enabled.length == 0) {
    console.log('No effects!  No composer!  No soup for you!');
    return null;
  }
  const rtParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
    stencilBuffer: true
  };
  const webGlTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParameters);
  const composer = new THREE.EffectComposer(options.renderer, webGlTarget);
  composer.addPass(new THREE.RenderPass(options.scene, options.camera));

  if (enabled.includes(DOT_PASS)) {
    options.dotAngle = options.dotAngle || 0.5;
    options.dotScale = options.dotScale || 0.5;
    const dotScreenPass = new THREE.DotScreenPass(new THREE.Vector2(0, 0), options.dotAngle, options.dotScale);
    composer.addPass(dotScreenPass);
  }
  if (enabled.includes(GLITCH_PASS)) {
    const glitchPass = new THREE.GlitchPass();
    glitchPass.goWild = true; // BUCK WILD OVER HERE
    composer.addPass(glitchPass);
  }

  const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;
  composer.addPass(effectCopy);
  composer.clock = new THREE.Clock();
  return composer;
}

function build(options, enabled) {
  const composer = buildComposer(options, enabled);
  return new EffectComposer(options, composer, enabled);
}

module.exports = {
  build
}
