'use strict';

function clampPos(zoom, cur, amount) {
  var min = -1 * (zoom - 1.0);
  var max = zoom - 1.0;
  return Math.max(Math.min(cur + amount, max), min)
}

module.exports = clampPos;
