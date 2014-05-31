// Applications events
$('.add-social').on('click', function() {
  var $this = $(this);
  $this.fadeOut('400');

  setTimeout(function() {
    $('.choose-social').fadeIn('400');
    $('.choose-social').find('li').addClass('bounceIn');
  }, 400);
});

// Settings
$('.icon-settings').on('click', function() {
  var itemsData = $('.list-social');
  var itemsParam = $('.choose-social');

  if (itemsData.is(':visible')) {
    $('.icon-reload').fadeOut('400');
    $('.icon-back').fadeIn('400');

    itemsData.fadeOut('400');
    itemsParam.fadeIn('400');

    itemsParam.find('li').bind('animationend webkitAnimationEnd', function() {
      $(this).removeClass('bounceIn');
    }).addClass('bounceIn');
  }
});

$('.icon-reload').on('click', function() {
  $(this).addClass('inprogress');

  Object.keys(dataArray).forEach(function(key) {
    api[key]('reload', dataArray[key].username, key);
  });

  $(document).ajaxStop(function() {
    $('.icon-reload').removeClass('inprogress');
  });
});

// Avoid space character
$('.choose-social').find('li input').on('keypress', function(e) {
  if (e.which == 32) return false;
});

// Add username to retrieve stats
$('.choose-social').on('click', 'li', function() {
  var $this = $(this);
  var exception = $this.data('btn');

  if ( exception !== 'back' ) {
    $this.find('input').focusout(function() {
      if ( $this.find('input').val() === '' ) {
        $this.find('span').animate({
          marginLeft: '0'
        }, 400, function() {
          $this.find('input').hide().val('');
        });
      }
    });

    $this.find('span').animate({
      marginLeft: '-240px'
    }, 400, function() {
      $this.find('input').show().focus();
    });

    $this.on('submit', function(e) {
      var site = $this.data('social');
      var value = $this.find('input').val();

      if ( value !== '' ) api[site]($this, value, site);

      e.preventDefault();
    });
  }
});

// Back button
$('.choose-social .btn-back, .icon-back').on('click', function() {
  if (isEmpty(dataArray) === true) {
    $('.icon-settings').hide();
    $('.choose-social').hide();
    $('.add-social').show();
  } else {
    checkData(null, 'clear');
  }
});

// Check if object is empty
function isEmpty(o) {
  for (var i in o) {
    if (o.hasOwnProperty(i)) return false;
  }

  return true;
}

$(document).on('click', '.icon-clear', function() {
  var $this = $(this).parent();
  var site = $this.data('social');

  $this.find('input').val('').blur();

  $this.find('span').animate({
    marginLeft: '0'
  }, 400, function() {
    $this.find('input').hide();
  });

  $(this).remove();
  delete dataArray[site];

  if ( isEmpty(dataArray) === true ) {
    localStorage.removeItem('user-data');
  } else {
    localStorage.setItem('user-data', JSON.stringify(dataArray));
  }
});

// Check local storage on load
$(window).load(function() {
  if (localStorage.getItem('user-data') !== null) {
    if (localStorage.getItem('user-diff') !== null) {
      // Change new followers value on loading screen
      dataDiff = JSON.parse(localStorage.getItem('user-diff'));

      var totalDiff = 0;

      Object.keys(dataDiff).forEach(function(key) {
        totalDiff += parseInt(dataDiff[key].diff);
      });

      $('.loading').find('p').show();
      $('.loading').find('p span').text((totalDiff > 0 ? '+' : '') + totalDiff);
    } else {
      $('.loading').find('p').hide();
    }
  } else {
    $('.loading').hide();
  }

  checkData();
});
