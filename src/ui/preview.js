'use strict';

function appendThumb(img, num = currentNum()){
  img.className = 'thumb';
  const set = document.getElementById(`imageset${num}`)
  const div = _makeThumbComponent(set, img, num);
  set.appendChild(div);
}

function _makeThumbComponent(set, img, num){
  const div = document.createElement('div')
  div.setAttribute('class', 'thumb');
  div.appendChild(img);

  const xicon = _makeLink(set);
  xicon.onclick = () => {
    set.removeChild(div);
  }

  div.onmouseover = () => {
    xicon.style.visibility = 'visible';
    // console.log('mouseover');
  };
  div.onmouseout = () => {
    xicon.style.visibility = 'hidden';
    // console.log('mouseout');
  };

  div.appendChild(xicon);
  return div;
}

function _makeLink(set){
  const link = document.createElement('a');
  link.setAttribute('class', 'xclose');
  link.setAttribute('href', '#');
  const xicon = document.createElement('img');
  xicon.setAttribute('src', '/static/x-icon.svg');
  xicon.setAttribute('class', 'xclose');
  link.appendChild(xicon);
  return link;
}

function currentNum(){
  const useSet = document.getElementById('useSet');
  return useSet.getAttribute('num');
}

module.exports = {
    appendThumb,
    currentNum
};
