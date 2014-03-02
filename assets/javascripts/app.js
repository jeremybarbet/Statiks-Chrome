// Global variables
var gui = require('nw.gui');
var win = gui.Window.get();


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

// To fix
$('.icon-settings').on('click', function() {
  var $this = $(this);

  $('.list-social').addClass('fadeOut');
  $('.choose-social').removeClass('fadeOut').fadeIn('400');
  $('.choose-social').find('li').addClass('bounceIn');
});

// Avoid space character
$('.choose-social').find('li input').on('keypress', function(e) {
  if (e.which == 32) {
    return false;
  }
});

$('.choose-social').on('click', 'li', function() {
  var $this = $(this);
  var exception = $this.data('btn');

  // Hide list social at this point
  $('.list-social').css('display', 'none');

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

      api[_social_site]($this, _social_value, _social_site);
      e.preventDefault();
    });
  } else {
    $('.choose-social').addClass('fadeOut');

    $('.list-social').removeClass('fadeOut');
    $('.list-social').css('display', 'block');
    $('.list-social').find('li').addClass('bounceIn');


    setTimeout(function() {
      $('.choose-social').css('display', 'none');

      $('.icon-settings').css('display', 'block');
    }, 300);
  }
});
