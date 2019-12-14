"use strict";

const THREE = require("three");
const zoomNudge = require("./zoom-nudge");

const DEFAULT_TIME = 500;

class ImageSequence {
  constructor(quads, time) {
    this.quads = quads;
    this.lastSwitch = 0;
    this.time = time;
    this.zoom = 1.0;
    this.position = { x: 0, y: 0 };
    this.deltaZoom = zoomNudge.deltaZoom.bind(this);
    this.setZoom = zoomNudge.setZoom.bind(this);
    this.deltaX = zoomNudge.deltaX.bind(this);
    this.deltaY = zoomNudge.deltaY.bind(this);
  }

  tick(timeMult) {
    const now = new Date().getTime();
    if (now - this.lastSwitch > this.time) {
      this._nextImage(now);
    }
    this.quads
      .slice(1)
      .forEach(quad => quad.position.copy(new THREE.Vector3(-100, 0, 0.0)));
    this.quads[0].position.copy(
      new THREE.Vector3(this.position.x, this.position.y, 0.0)
    );
    this.quads[0].scale.copy(new THREE.Vector3(this.zoom, this.zoom, 1.0));
  }

  faster(amount) {
    this.time = Math.max(1, this.time - amount);
    console.log(`Set time to ${this.time}`);
    return this;
  }

  slower(amount) {
    this.time = this.time + amount;
    console.log(`Set time to ${this.time}`);
    return this;
  }

  setTime(time) {
    this.time = time;
  }

  nextImage(){
    this._nextImage();
  }

  _nextImage(now = new Date().getTime()){
    this.quads.push(this.quads.shift());
    this.lastSwitch = now;
  }

  static build(quads, time = DEFAULT_TIME) {
    return new ImageSequence(quads, time);
  }
}

module.exports = ImageSequence;
