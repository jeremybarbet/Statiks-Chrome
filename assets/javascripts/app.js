// Global variables
var gui = require('nw.gui');
var win = gui.Window.get();

var path = './';
var fs = require('fs');

fs.watch(path, [], function() {
if (location)
  location.reload(false);
});



// Events
$(document).ready(function() {
  $('.close').on('click', function() {
    win.close();
  });

  $('.minimize').on('click', function() {
    win.minimize();

  });

  $('.maximize').on('click', function() {
    win.maximize();

  });



});




