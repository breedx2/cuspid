'use strict';

function toggleKeys(){
  toggle('div#keys');
}

function toggleClientId(closeHandler){
  if(toggle('div#clientid')){

    const escapeDismisser = event => {
      if(event.key === 'Escape') {
        dismissOverlays();
        if(closeHandler) closeHandler();
        document.querySelector('input#clientUid').removeEventListener('keydown', this);
      }
    };
    setTimeout(() => {
      document.querySelector('input#clientUid').disabled = null;
      document.querySelector('input#clientUid').focus();
      document.querySelector('input#clientUid').addEventListener('keydown', escapeDismisser);
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

function showHideDecoration(show){
  if(show){
    console.log('hiding decorations...');
  }
  else{
    console.log('showing decorations...');
  }
  const top = document.querySelector('#top');
  top.style.opacity = show ? 1 : 0;
  const cnv = document.querySelector('canvas#cnv');
  //TODO: Don't hard code style info, instead apply/remove a class?
  cnv.style.border = show ? 'solid white 5px' : '0px';
}

function dismissOverlays(){
  document.querySelector('div#keys').style.display = 'none';
  document.querySelector('div#clientid').style.display = 'none';
  document.querySelector('canvas#cnv').focus();
}

module.exports = {
  toggleKeys,
  toggleClientId,
  wsConnectStatus,
  wsSetClientId,
  showHideDecoration,
  dismissOverlays
}
