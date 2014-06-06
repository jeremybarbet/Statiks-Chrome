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
 * Data namespace with related methods
 * @global
 */
var data = {
  /**
   * Launching's function app
   */
  loading: function() {
    if ( localStorage.getItem('user-data') !== null ) {
      // Hide add social button
      $('.add-social').hide();

      // Display diff number
      data.diff();

      // Loading
      setTimeout(function() {
        $('.loading').fadeOut(timingEffect);
      }, 1500);

      // Show data after loading
      setTimeout(function() {
        data.build();
      }, 2000);
    } else {
      $('.loading').hide();
    }
  },

  /**
   * Sum up and display diff numbers
   */
  diff: function() {
    var notifwrapper = '<p class="notification"></p>';
    var totalDiff = 0;

    Object.keys(dataArray).forEach(function(site) {
      totalDiff += parseInt(dataArray[site].diff);
    });

    if ( !$('.notification').length ) $('.loading').append(notifwrapper);

    var notif = $('.loading').find('.notification');

    if ( totalDiff < 0 ) {
      notif.show().html('<span>' + totalDiff + '</span> followers');
    } else if ( totalDiff == 1 ) {
      notif.show().html('<span>+' + totalDiff + '</span> new follower');
    } else if ( totalDiff > 1 ) {
      notif.show().html('<span>+' + totalDiff + '</span> news followers');
    }
  },

  /**
   * Generated and append items
   */
  render: function(site, username, followers) {
    // Formatting big numbers
    followers = (followers + "").replace(/.(?=(?:.{3})+$)/g, '$& ');

    var itemList = '<li class="' + site + '"><div class="left"><h2>' +  ((site === 'cinqcentpx') ? '500px' : site) + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p><span></span>followers</p></div></li>';
    var itemTotal = $('.list-social').find('.total');

    if ( site === 'total' ) {
      if ( !itemTotal.length ) {
        // If not total sum up display to the last li child of ul
        $('.list-social').find('li').last().parent().append(itemList);
      } else {
        // Move to the total item bottom
        itemTotal.appendTo('.list-social ul');

        // Update total data
        itemTotal.find('.left p').text(username);
        itemTotal.find('.right .nbr').text(followers);
      }
    } else {
      if ( !$('.list-social').find('.' + site).length ) $('.list-social').find('ul').append(itemList);
    }
  },

  /**
   * Build item wrapper
   */
  build: function() {
    dataArray = JSON.parse(localStorage.getItem('user-data'));

    // Build item container
    if ( !$('.list-social').length ) {
      var itemsContainer = '<div class="list-social"><ul></ul></div>';
      $(itemsContainer).insertAfter('.choose-social');
    }

    var itemsData = $('.list-social');

    // Hide choose social list
    $('.choose-social').hide();

    // Display parameters button
    $('.icon-settings, .icon-reload').fadeIn(timingEffect);
    $('.icon-back').fadeOut(timingEffect);

    // Add count data
    data.count();

    // Finally display items and remove class after animation completed
    itemsData.fadeIn(timingEffect);

    itemsData.find('li').bind('animationend webkitAnimationEnd', function() {
      $(this).removeClass('bounceIn');
    }).addClass('bounceIn');
  },

  count: function() {
    var totalFollowers = 0;
    var totalSites = 0;

    // Display data on main screen
    Object.keys(dataArray).forEach(function(site) {
      data.render(site, dataArray[site].username, dataArray[site].followers);

      // Render username in config screen
      $('.choose-social').find('.' + site).find('span').css('marginLeft', '-240px').parent().find('input').show().val(dataArray[site].username);

      var clear = $('<span class="icon-clear"></span>');
      if ( !$('.choose-social').find('.' + site).find('.icon-clear').length ) $('.choose-social').find('.' + site).append(clear);

      // Calculate total followers
      totalFollowers += parseInt(dataArray[site].followers);
    });

    // Display total followers and total network connected
    totalSites = Object.keys(dataArray).length + ((Object.keys(dataArray).length > 1) ? ' networks connected' : ' network connected');
    data.render('total', totalSites, totalFollowers);
  },

  check: function() {
    if ( localStorage.getItem('user-data') !== null ) {
      // Hide add social button
      $('.add-social').hide();

      // Loading
      setTimeout(function() {
        $('.loading').fadeOut(timingEffect);
      }, 1500);

      // Show data back btn action
      data.build();
    }
  }
}
