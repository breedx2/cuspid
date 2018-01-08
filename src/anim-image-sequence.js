'use strict';

const THREE = require('three');

const DEFAULT_TIME = 500;

class ImageSequence {

  constructor(quads, time) {
    this.quads = quads;
    this.lastRender = 0;
    this.time = time;
  }

  tick(timeMult) {
    const now = new Date().getTime();
    if (now - this.lastRender > this.time) {
      this.quads.slice(1).forEach(quad => quad.position.copy(new THREE.Vector3(-1000000, 0, 0.0)));
      this.quads[0].position.copy(new THREE.Vector3(0, 0, 0.0));
      this.quads.push(this.quads.shift());
      this.lastRender = now;
    }
  }

  faster(amount) {
    this.time = Math.max(1, this.time - amount);
    return this;
  }

  slower(amount) {
    this.time = this.time + amount;
    return this;
  }

  setTime(time) {
    this.time = time;
  }

  static build(quads, time = DEFAULT_TIME) {
    return new ImageSequence(quads, time);
  }

}

module.exports = ImageSequence;
