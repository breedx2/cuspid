'use strict';

function toggleKeys(){
  toggle('div#keys');
}

function toggleClientId(closeHandler){
  if(toggle('div#clientid')){
    setTimeout(() => {
      document.querySelector('input#clientUid').disabled = null;
      document.querySelector('input#clientUid').focus();
    }, 10);
    if(closeHandler){
      document.querySelector('button#closeClientId')
        .addEventListener('click', closeHandler, { once: true} );
    }
    return true;
  }
  document.querySelector('canvas#cnv').focus();
  document.querySelector('input#clientUid').disabled = 'disabled';
  return false;
}

function toggle(sel){
  const x = document.querySelector(sel);
  if(x.offsetParent === null){
    x.style.display = 'inline-block';
    return true;
  }
  x.style.display = 'none';
  return false;
}

function wsSetClientId(id){
  document.querySelector('input#clientUid').value = id;
}

function changeClientClicked(fn){
  //TODO: Is this supposed to do something fun?
  // $('button#changeClientId')
  document.querySelector('button#changeClientId')
}

function wsConnectStatus(connected){
  let img = '/static/disconnected.png';
  if(connected){
    img = '/static/conn-ok.png';
  }
  document.querySelector('img#connstatus').src = img;
}

module.exports = {
  toggleKeys,
  toggleClientId,
  wsConnectStatus,
  wsSetClientId
}
