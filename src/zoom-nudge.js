'use strict';

const clampPos = require('./clamp-pos');

function monkeyPatch(obj){
  obj.zoom = 1.0;
  obj.position = {x: 0, y: 0};
  obj.deltaZoom = deltaZoom.bind(obj);
  obj.setZoom = setZoom.bind(obj);
  obj.deltaX = deltaX.bind(obj);
  obj.deltaY = deltaY.bind(obj);
}

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
  deltaX,
  monkeyPatch
}
