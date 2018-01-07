'use strict';

const $ = require('jquery');

function toggleKeys(){
    if($('div#keys').is(':visible')){
        return $('div#keys').hide();
    }
    $('div#keys').show();
}

module.exports = {
  toggleKeys
}
