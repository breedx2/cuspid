'use strict';

const ImageLoader = require('../image-loader.js');
const dropsite = require('./dropsite.js');
const _ = require('lodash');

function setup(useTheseImagesCallback){
  console.log('Performing imagepool setup');
  dropsite.setup(useTheseImagesCallback);
  setupTabHandlers();
}

function setupTabHandlers(){
  _.range(1,11).forEach(n => {
    const tab = document.getElementById(`settab${n}`);
    tab.onclick = tabClicked(n);
  });
}

function tabClicked(num){
  return () => {
    console.log('shit ' + num);
    _.range(1,11).filter(n => n != num).forEach(n => unselectTab(n));
    selectTab(num);
  };
}

function selectTab(num){
  const tab = document.getElementById(`settab${num}`);
  tab.classList.add("selected");
  const imgset = document.getElementById(`imageset${num}`);
  imgset.classList.add("selected");
}

function unselectTab(num){
  const tab = document.getElementById(`settab${num}`);
  tab.classList.remove("selected");
  const imgset = document.getElementById(`imageset${num}`);
  imgset.classList.remove("selected");
}

module.exports = {
  setup
};
