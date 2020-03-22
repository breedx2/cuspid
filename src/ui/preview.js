'use strict';

function appendThumb(img){
  img.className = 'thumb';

  const num = currentNum();
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
