'use strict';

const ImageLoader = require('../image-loader.js');
const dropsite = require('./dropsite.js');
const _ = require('lodash');

function setup(useTheseImagesCallback, imagePool){
  console.log('Performing imagepool setup');
  dropsite.setup(useTheseImagesCallback);
  console.log(imagePool.currentQuads());
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
    _.range(1,11).filter(n => n != num).forEach(n => unselectTab(n));
    selectTab(num);
  };
}

function selectTab(num){
  const tab = document.getElementById(`settab${num}`);
  tab.classList.add("selected");
  const imgset = document.getElementById(`imageset${num}`);
  imgset.classList.add("selected");
  const useSetButton = document.getElementById('useSet');
  useSetButton.setAttribute("num", num);
  useSetButton.value = `use as set ${num}`;
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
