'use strict';

const clampPos = require('./clamp_pos');

function deltaZoom( amount ){
  this.zoom = Math.max(1.0, this.zoom + amount);
  this.position.x = clampPos(this.zoom, this.position.x, 0);
  this.position.y = clampPos(this.zoom, this.position.y, 0);
}

function deltaY( amount ){
  this.position.y = clampPos(this.zoom, this.position.y, amount);
}

function deltaX( amount ){
  this.position.x = clampPos(this.zoom, this.position.x, amount);
}

module.exports = {
  deltaZoom,
  deltaY,
  deltaX
}
