'use strict';

function appendThumb(img){
  img.className = 'thumb';

  const num = currentNum();
  const set = document.getElementById(`imageset${num}`)

  // const set = document.getElementById('imageset3');
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
