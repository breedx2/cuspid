'use strict';

const ImageLoader = require('../image-loader.js');
const dropsite = require('./dropsite.js');
const preview = require('./preview.js');
const _ = require('lodash');

function setup(useTheseImagesCallback, imagePool){
  console.log('Performing imagepool setup');
  dropsite.setup();
  console.log(imagePool.currentQuads());
  setupTabHandlers();

  document.getElementById('useSet').onclick = () => {
    console.log('Applying image set...');
    const num = preview.currentNum();
    const images = document.querySelectorAll(`#imageset${num} > img`);
    useTheseImagesCallback(num-1, Array.from(images));
  };
  document.getElementById('random10').onclick = () => {
    pickRandom10();
  };
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

async function pickRandom10(){
  console.log('Picking 10 random images..');
  const num = preview.currentNum();
  document.querySelector(`div#imageset${num}`).innerHTML = "";
  fetch('/static/index/largeset.json')
    .then(response => response.json())
    .then(json => {
        const promises = _.shuffle(json.items)
          .slice(0, 10)
          .map(f => `/static/largeset/${f}`)
          .map(loadToThumb);
        return Promise.all(promises);
    });
}

async function loadToThumb(url){
  console.log(`loading to thumbnail: ${url}`);
  return ImageLoader.loadAndCrop(url)
    .then(image => {
      preview.appendThumb(image);
    });
}

module.exports = {
  setup
};
