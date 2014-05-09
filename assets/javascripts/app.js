// Global variables
var gui = require('nw.gui');
var win = gui.Window.get();

$(window).load(function() {
  // TODO - clean each reload
  // localStorage.clear();
  checkData();
});

function renderData() {
  var itemList = '<li class="' + site + '"><div class="left"><h2>' + site + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p>followers</p></div></li>';
  $('.list-social').find('ul').append(itemList);
}

function checkData() {

  if (localStorage.getItem('userData') != null) {

    console.log( JSON.parse(localStorage.getItem('userData')) );

    // Site
    console.log( JSON.parse(localStorage.getItem('userData'))[0] );

    // Username
    console.log( JSON.parse(localStorage.getItem('userData'))[0]['site']['username'] );

    // Username
    console.log( JSON.parse(localStorage.getItem('userData'))[0]['site']['followers'] );




  }


  /*
  if (localStorage.getItem('dribbble') != null) {
    // console.log('storage');
    // console.log( JSON.parse(localStorage.getItem('dribbble'))[0] );

    // Delete add social button
    $('.add-social').remove();

    // Display config button
    $('.icon-settings').css('display', 'block');

    // Display data on main screen
    $('.list-social').find('ul').append(JSON.parse(localStorage.getItem('dribbble'))[1]);

    // Display usernames in config screen
    $('.choose-social').find('.dribbble span').css('marginLeft', '-240px');
    $('.choose-social').find('.dribbble input').show();
    $('.choose-social').find('.dribbble input').focus();
    $('.choose-social').find('.dribbble input').val(JSON.parse(localStorage.getItem('dribbble'))[0]);
  }
  */

}

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
      var site = $this.data('social');
      var value = $this.find('input').val();

      api[site]($this, value, site);
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
