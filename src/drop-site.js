'use strict';

const ImageLoader = require('./image-loader.js');
const _ = require('lodash');

function setup(useTheseImagesCallback){
  console.log('Performing drop site setup');

  if(!window.FileReader) {
    return console.log('Your browser does not support the HTML5 FileReader.');
  }
  // var status = document.getElementById('status');
  const drop = document.getElementById('dropsite');
  // var list   = document.getElementById('list');

  function cancel(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // Tells the browser that we *can* drop on this target
  drop.addEventListener('dragover', function(evt){
    evt.dataTransfer.dropEffect = 'copy';
    return cancel(evt);
  }, false);
  drop.addEventListener('dragenter', cancel, false);
  drop.addEventListener('dragleave', cancel, false);
  drop.addEventListener('drop', function (e) {
    try {
      console.log('Got drop event', e);
      e.preventDefault();
      e.stopPropagation();

      console.log(`x`)
      const dt = e.dataTransfer;
      const files = dt.files;
      console.log(e.dataTransfer.files[0]);
      loadAndPreview(e.dataTransfer.files);
      // Array.from(e.dataTransfer.files).forEach(file => {
      //   console.log("OMG FILE: ", file);
      //   readToPreview(file);
      // });
    }
    catch(e){
      console.log("***OUCH IT BURNS: ", e);
    }
    return false;
  }, false);

 const choosefiles = document.getElementById('choosefiles');
 choosefiles.addEventListener('change', chooseSomeFiles);

 const useSet = document.getElementById('useSet');
 useSet.onclick = () => {
   console.log('Applying image set...');
   const images = document.querySelectorAll('#imageset > img');
   useTheseImagesCallback(Array.from(images));
 };
 document.getElementById('random10').onclick = () => {
   pickRandom10();
 };
}

function appendThumb(img){
  img.className = 'thumb';
  const drop = document.getElementById('imageset');
  drop.appendChild(img);
}

function chooseSomeFiles(change){
  // console.log(change);
  // console.log(choosefiles.files);
  const choosefiles = document.getElementById('choosefiles');
  loadAndPreview(choosefiles.files);
}

function loadAndPreview(files){
  const promises = Array.from(files)
    .map(file => {
      return ImageLoader.loadAndCropFile(file)
        .then(image => {
          appendThumb(image);
          console.log('Wowwy wow, did image stuff');
        });
    });
  return Promise.all(promises);
}

async function loadToThumb(url){
  console.log(`loading to thumbnail: ${url}`);
  return ImageLoader.loadAndCrop(url)
    .then(image => {
      appendThumb(image);
    });
}

async function pickRandom10(){
  console.log('Picking 10 random images..');
  document.querySelector('div#imageset').innerHTML = "";
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


module.exports = {
  setup
};
