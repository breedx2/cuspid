'use strict';

function appendThumb(img, num = currentNum()){
  img.className = 'thumb';
  const set = document.getElementById(`imageset${num}`)
  set.appendChild(img);
}

function currentNum(){
  const useSet = document.getElementById('useSet');
  return useSet.getAttribute('num');
}

module.exports = {
    appendThumb,
    currentNum
};
