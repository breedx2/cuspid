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

module.exports = {
  toggleKeys,
  toggleClientId
}
