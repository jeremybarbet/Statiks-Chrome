/**
 * Global timing for differents fades.
 * Reload variable.
 * isMac match test
 * @global
 */
var timingEffect = 400;
var reload = 0;
var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

/**
 * Add social actions. Hide the button, and display
 * connect's form to add newtworks and type username.
 * Only display if there is no connected networks.
 */
$('.add-social').on('click', function() {
  var $this = $(this);

  $this.fadeOut(timingEffect);
  $('.icon-back').fadeIn(timingEffect);

  setTimeout(function() {
    $('.choose-social').fadeIn(timingEffect);
    $('.choose-social').find('li').addClass('bounceIn');
  }, timingEffect);
});

/**
 * Action to reload data with the connected networks.
 */
$('.icon-reload').on('click', function() {
  reload = 0;

  $(this).addClass('inprogress');

  if ( $(this).hasClass('pause') ) $(this).removeClass('pause');

  for (var site in dataArray) {
    api[site]('reload', dataArray[site].username, site);
  }

  $(document).ajaxStop(function() {
    $('.icon-reload').addClass('pause');
  });
});

/**
 * Another way to display the connect's form.
 * Display if there is at least one connected network.
 */
$('.icon-settings').on('click', function() {
  var itemsData = $('.list-social');
  var itemsParam = $('.choose-social');

  if ( itemsData.is(':visible') ) {
    $('.icon-reload').fadeOut(timingEffect);
    $('.icon-back').fadeIn(timingEffect);

    itemsData.fadeOut(timingEffect);
    itemsParam.fadeIn(timingEffect);

    itemsParam.find('li').bind('animationend webkitAnimationEnd', function() {
      $(this).removeClass('bounceIn');
    }).addClass('bounceIn');
  }
});

/**
 * Avoid the space characther on the form
 */
$('.choose-social').find('li input').on('keypress', function(e) {
  if ( e.which == 32 ) return false;
});

/**
 * Actions related to the connect's form.
 * - Displayed the input on click on an item
 * - Called the api function to retrieve related data
 */
$('.choose-social').on('click', 'li', function(e) {
  var $this = $(this);
  var exception = $this.data('btn');

  if ( $(e.target).attr('class') === 'icon-clear' ) return;

  if ( exception !== 'back' ) {
    $this.find('input').focusout(function() {
      if ( $this.find('input').val() === '' ) {
        $this.find('span').animate({
          marginLeft: '0'
        }, timingEffect, function() {
          $this.find('input').hide().val('');
        });
      }
    });

    $this.find('span').animate({
      marginLeft: '-240px'
    }, timingEffect, function() {
      $this.find('input').show().focus();
    });

    $this.off('submit').on('submit', function(e) {
      var site = $this.data('social');
      var value = $this.find('input').val();

      if ( value !== '' ) api[site]($this, value, site);

      e.preventDefault();
    });
  }
});

/**
 * Back buttons actions with the top button on the header
 * and the back button at the bottom of the settings views
 */
$('.choose-social .btn-back, .icon-back').on('click', function() {
  if ( isEmpty(dataArray) === true ) {
    $('.icon-settings, .icon-back, .choose-social').hide();
    $('.add-social').show();
  } else {
    if ( storage.get('user-data') !== null ) {
      $('.add-social, .loading').hide();
      data.build();
    }
  }
});

/**
 * Action to remove a connected network. Firstly, remove input
 * val, DOM element and finally, remove from the object
 */
$(document).on('click', '.icon-clear', function() {
  var $this = $(this).parent();
  var site = $this.data('social');

  $this.find('input').hide().val('').blur();

  $this.find('span').animate({
    marginLeft: '0'
  }, timingEffect);

  $(this).remove();
  $('.list-social').find('.' + site).remove();

  delete dataArray[site];

  if ( isEmpty(dataArray) === true ) {
    storage.rem('user-data');
  } else {
    storage.set('user-data', dataArray);
  }
});

/**
 * Show detail for networks
 */
$(document).on('click', '.item', function() {
  $(this).find('.detail-social').slideToggle(timingEffect);
});

/**
 * Initialization after loaded app
 */
$(window).load(function() {
  data.loading();
});
