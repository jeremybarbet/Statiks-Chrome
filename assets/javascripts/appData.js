/**
 * Declare global array to store data.
 * @global
 */
var dataArray = {};

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
 * Data namespace with related methods
 * @global
 */
var data = {
  /**
   * Launching's function app
   */
  loading: function() {
    if ( storage.get('user-data') !== null ) {
      // Hide add social button
      $('.add-social').hide();

      // Loading
      setTimeout(function() {
        $('.loading').fadeOut(timingEffect);
      }, timingEffect * 3);

      // Show data after loading
      setTimeout(function() {
        data.build();
      }, timingEffect * 4);
    } else {
      $('.loading').hide();
    }
  },

  /**
   * Generated and append items
   */
  render: function(site, username, followers, details) {
    followers = format(followers);

    var itemList = '<li class="item ' + site + '"><div class="left"><h2>' + ((site === 'cinqcentpx') ? '500px' : site) + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p><span></span>followers</p></div><ul class="detail-social ' + site + '"></ul></li>';
    var itemTotal = $('.list-social').find('.total');

    if ( site === 'total' ) {
      if ( !itemTotal.length ) {
        // If not total sum up display to the last li child of ul
        $('.list-social').find('.item').last().parent().append(itemList);
      } else {
        // Move to the total item bottom
        itemTotal.appendTo('.list-social .social-wrapper');

        // Update total data
        itemTotal.find('.left p').text(username);
        itemTotal.find('.right .nbr').text(followers);
      }
    } else {
      if ( !$('.list-social').find('.' + site).length ) $('.list-social').find('.social-wrapper').append(itemList);
      
      if ( site !== 'total' ) {
        for (var key in details) {
          // details[key] = format(details[key]);

          var itemDetail = '<li class="' + key + '"><div class="left">' + key + '</div><div class="right">' + details[key] + '</div></li>';

          if ( !$('.detail-social' + site).length ) $('.' + site).find('.detail-social').append(itemDetail);
        }
      }
    }
  },

  /**
   * Build item wrapper
   */
  build: function() {
    dataArray = storage.get('user-data');

    // Build item container
    if ( !$('.list-social').length ) {
      var itemsContainer = '<div class="list-social"><ul class="social-wrapper"></ul></div>';
      $(itemsContainer).insertAfter('.choose-social');
    }

    var itemsData = $('.list-social');

    // Hide choose social list
    $('.choose-social').hide();

    // Display parameters button
    $('.icon-settings, .icon-reload').fadeIn(timingEffect);
    $('.icon-back').fadeOut(timingEffect);

    var totalFollowers = 0;
    var totalSites = 0;

    // Display data on main screen
    for (var site in dataArray) {
      data.render(site, dataArray[site].username, dataArray[site].followers, dataArray[site].details);

      // Render username in config screen
      $('.choose-social').find('.' + site).find('span').css('marginLeft', '-240px').parent().find('input').show().val(dataArray[site].username);
      var clear = $('<span class="icon-clear"></span>');
      if ( !$('.choose-social').find('.' + site).find('.icon-clear').length ) $('.choose-social').find('.' + site).append(clear);

      // Calculate total followers
      totalFollowers += parseInt(dataArray[site].followers);
    };

    // Display total followers and total network connected
    totalSites = Object.keys(dataArray).length + ((Object.keys(dataArray).length > 1) ? ' networks connected' : ' network connected');
    data.render('total', totalSites, totalFollowers);

    // Finally display items and remove class after animation completed
    itemsData.fadeIn(timingEffect);

    itemsData.find('.item').bind('animationend webkitAnimationEnd', function() {
      $(this).removeClass('bounceIn');
    }).addClass('bounceIn');
  }
}
