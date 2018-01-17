'use strict';

const clampPos = require('./clamp_pos');

function deltaZoom( amount ){
  this.setZoom(this.zoom + amount);
}

function setZoom(zoomLevel){
  this.zoom = Math.max(1.0, zoomLevel);
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
  setZoom,
  deltaY,
  deltaX
}
