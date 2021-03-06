/**
 * Declare global array to store data.
 * @global
 */
var dataObj = {};

dataObj.sites = {};

dataObj.graph = {
  followers: [0, 0, 0, 0, 0, 0, 0],
  following: [0, 0, 0, 0, 0, 0, 0]
};

dataObj.order = [];

/**
 * Add Statiks version to storage for easily upgrade
 * @global
 */
var app = {
  version: function() {
    $.getJSON('package.json').done(function(data) {
      var version = data.version;
      storage.set('statiks-version', version);
    });
  }
};

/**
 * Global timing for differents fades.
 * isMac match test
 * @global
 */
var timingEffect = 400;
var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

/**
 * Function to check if an object is empty
 * @global
 */
function isEmpty(o) {
  for (var i in o) {
    if ( o.hasOwnProperty(i) ) return false;
  }

  return true;
}

/**
 * Function to check if an array contains a value
 * @global
 */
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/**
 * Function to check if an array contains all the same values
 * @global
 */
function isSame(array) {
  for (var i = 0; i < array.length - 1; i++) {
    if ( array[i] != array[i + 1] ) return false;
  }

  return true;
}

/**
 * Formatting big numbers
 * @global
 */
function format(nbr) {
  return (nbr + '').replace(/.(?=(?:.{3})+$)/g, '$& ');
}

/**
 * Localstorage methods
 * @global
 */
var storage = {
  set: function(item, value) {
    localStorage.setItem(item, JSON.stringify(value));
  },
  get: function(item) {
    return JSON.parse(localStorage.getItem(item));
  },
  rem: function(item) {
    localStorage.removeItem(item);
  }
};

/**
 * Custom scrollbar for Windows platfom
 * @global
 */
if ( !isMac ) {
  $('body').addClass('custom-scroll');
}
