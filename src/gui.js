'use strict';

const $ = require('jquery');

function toggleKeys(){
  toggle('div#keys');
}

function toggleClientId(){
  toggle('div#clientid');
}

function toggle(sel){
  if($(sel).is(':visible')){
      return $(sel).hide();
  }
  $(sel).show();
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
  wsConnectStatus
}
