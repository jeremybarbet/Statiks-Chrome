function renderData(site, username, followers) {
  var itemList = '<li class="' + site + '"><div class="left"><h2>' +  ((site === 'cinqcentpx') ? (site = '500px') : site) + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p>followers</p></div></li>';
  $('.list-social').find('ul').append(itemList);
};

function checkData() {
  if (localStorage.getItem('user-data') != null) {
    dataArray = JSON.parse(localStorage.getItem('user-data'));

    // Display if data
    $('.list-social').css('display', 'block');

    // Delete DOM
    $('.list-social').find('ul').empty();

    // Delete add social button
    $('.add-social').remove();

    // Display config button
    $('.icon-settings').css('display', 'block');

    // Vars
    var totalFollowers = 0;
    var totalSites;

    // Display data on main screen
    Object.keys(dataArray).forEach(function(key) {
      renderData(key, dataArray[key].username, dataArray[key].followers);

      // Render username in config screen
      $('.choose-social').find('.' + key)
        .find('span').css('marginLeft', '-240px')
        .parent()
        .find('input').show().focus().val(dataArray[key].username);

      // Calculate total followers
      totalFollowers += parseInt(dataArray[key].followers);
    });

    // Display total followers and total network connected
    totalSites = Object.keys(dataArray).length + ((Object.keys(dataArray).length > 1) ? ' networks connected' : ' network connected');
    renderData('total', totalSites, totalFollowers);
  }
};

// Applications events
$('.add-social').on('click', function() {
  var $this = $(this);

  $this.addClass('fadeOut');

  setTimeout(function() {
    $this.css('display', 'none');
    $('.choose-social').fadeIn('400');
    $('.choose-social').removeClass('fadeOut');
    $('.choose-social').find('li').addClass('bounceIn');
  }, 300);
});

// Settings
$('.icon-settings').on('click', function() {
  var $this = $(this);

  // Hide list social at this point
  $('.list-social').css('display', 'none');

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

      if ( value != '' ) api[site]($this, value, site);

      e.preventDefault();
    });
  } else {
    $('.choose-social').addClass('fadeOut');

    if ($('.list-social').find('li').length > 0) {
      $('.list-social').removeClass('fadeOut');
      $('.list-social').css('display', 'block');
      $('.list-social').find('li').addClass('bounceIn');

      $('.choose-social').addClass('fadeOut');

      console.log(dataArray);

      checkData();

      setTimeout(function() {
        $('.choose-social').css('display', 'none');
      }, 300);
    }
    else {
      $('.add-social').removeClass('fadeOut');
      $('.choose-social').addClass('fadeOut');

      setTimeout(function() {
        $('.add-social').css('display', 'block');
        $('.choose-social').css('display', 'none');
      }, 300);
    }
  }
});

$(document).on('click', '.icon-error', function() {
  var $this = $(this).parent();

  $this.find('span').animate({
    marginLeft: '0'
  }, 400, function() {
    $this.find('input').hide();
    $this.find('input').blur();
  });

  $(this).remove();
});

// Check local storage on load
$(window).load(function() {
  checkData();
});
