'use strict';

const $ = require('jquery');

function toggleKeys(){
  toggle('div#keys');
}

function toggleClientId(closeHandler){
  $('button#closeClientId').off('click');
  if(toggle('div#clientid')){
    setTimeout(() => {
      $('input#clientUid').attr('disabled', null);
      $('input#clientUid').focus();
    }, 10);
    if(closeHandler){
      $('button#closeClientId').click(closeHandler);
    }
    return true;
  }
  $('canvas#cnv').focus();
  $('input#clientUid').attr('disabled', 'disabled');
  return false;
}

function toggle(sel){
  if($(sel).is(':visible')){
      $(sel).hide();
      return false;
  }
  $(sel).show();
  return true;
}

function wsSetClientId(id){
  $('input#clientUid').val(id);
}

function changeClientClicked(fn){
  $('button#changeClientId')
}

function wsConnectStatus(connected){
  let img = '/static/disconnected.png';
  if(connected){
    img = '/static/conn-ok.png';
  }
  $('img#connstatus').attr('src', img);
}

module.exports = {
  toggleKeys,
  toggleClientId,
  wsConnectStatus,
  wsSetClientId
}
