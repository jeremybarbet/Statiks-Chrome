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

  // Hide list social at this point
  $('.list-social').css('display', 'none');

  if ( exception !== 'back' ) {
    $this.find('input').focusout(function() {
      if ( $this.find('input').val() == '' ) {
        $this.find('span').animate({
          marginLeft: '0'
        }, 400, function() {
          $this.find('input').hide();
          $this.find('input').val('');
        });
      }
    });

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
  }
});

// Back button
$('.choose-social').on('click', '.btn-back', function() {
  if (isEmpty(dataArray) == true) {
    $('.add-social').removeClass('fadeOut');
    $('.choose-social').addClass('fadeOut');

    setTimeout(function() {
      $('.add-social').css('display', 'block');
      $('.choose-social').css('display', 'none');
    }, 300);
  } else {
    checkData(null, 'clear');
  }
});

// Check if object if empty
function isEmpty(o) {
  for (var i in o) {
    if (o.hasOwnProperty(i)) return false;
  }

  return true;
}

$(document).on('click', '.icon-clear', function() {
  var $this = $(this).parent();
  var site = $this.data('social');

  $this.find('input').val('');
  $this.find('input').blur();

  $this.find('span').animate({
    marginLeft: '0'
  }, 400, function() {
    $this.find('input').hide();
  });

  $(this).remove();
  delete dataArray[site];

  if ( isEmpty(dataArray) == true ) {
    localStorage.removeItem('user-data');
  } else {
    localStorage.setItem('user-data', JSON.stringify(dataArray));
  }
});

// Check local storage on load
$(window).load(function() {
  if (localStorage.getItem('user-data') != null) {
    if (localStorage.getItem('user-diff') != null) {
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
