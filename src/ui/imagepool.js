'use strict';

const ImageLoader = require('../image-loader.js');
const dropsite = require('./dropsite.js');
const _ = require('lodash');

function setup(useTheseImagesCallback){
  console.log('Performing imagepool setup');
  dropsite.setup(useTheseImagesCallback);
}


module.exports = {
  setup
};
