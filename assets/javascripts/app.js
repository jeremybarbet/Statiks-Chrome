// Global variables
var gui = require('nw.gui');
var win = gui.Window.get();

// Events
$(document).ready(function() {
  // Window events
  $('.win-close').on('click', function() {
    win.close();
  });

  $('.win-minimize').on('click', function() {
    win.minimize();
  });

  // Applications events
  $('.add-social').on('click', function() {
    var $this = $(this);

    $this.addClass('fadeOut');

    setTimeout(function() {
      $this.css('display', 'none');
      $('.choose-social').fadeIn('400');
      $('.choose-social').find('li').addClass('bounceIn');
    }, 300);
  });

  $('.choose-social').on('click', 'li', function() {
    var $this = $(this);
    var exception = $this.data('btn');

    if ( exception !== 'back' ) {
      $this.find('span').animate({
        marginLeft: '-240px'
      }, 400, function() {
        $this.find('input').show();
        $this.find('input').focus();
      });

      $this.on('submit', function(e) {
        var _social_site = $this.data('social');
        var _social_value = $this.find('input').val();

        console.log(_social_site, _social_value);

        e.preventDefault();
      });
    } else {
      $('.choose-social').addClass('fadeOut');

      setTimeout(function() {
        $('.choose-social').css('display', 'none');
      }, 300);
    }
  });

});
