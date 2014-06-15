/**
 * Declare global array to store data.
 * @global
 */
var dataObj = {};

dataObj['sites'] = {};

dataObj['graph'] = {
  followers: [0, 0, 0, 0, 0, 0, 0],
  following: [0, 0, 0, 0, 0, 0, 0]
};

dataObj['order'] = [];

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
    var itemList = '<li class="item ' + site + '"><div class="left"><h2>' + ((site === 'cinqcentpx') ? '500px' : site) + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + format(followers) + '</div><p><span></span>followers</p></div><ul class="detail-social ' + site + '"></ul></li>';

    if ( !$('.list-social').find('.item.' + site).length ) {
      $('.list-social').find('.social-wrapper').append(itemList);
    } else {
      $('.item.' + site).find('.left p').text(username);
      $('.item.' + site).find('.right .nbr').text(format(followers));
    }

    for (var key in details) {
      var itemDetail = '<li class="' + key + '"><div class="left">' + key + '</div><div class="right">' + format(details[key]) + '</div></li>';

      if ( !$('.item.' + site).find('.detail-social .' + key).length ) {
        $('.item.' + site).find('.detail-social').append(itemDetail);
      } else {
        $('.item.' + site).find('.' + key + ' .right').text(format(details[key]));
      }
    }
  },

  /**
   * Build item wrapper
   */
  build: function() {
    dataObj = storage.get('user-data');

    for (var site in dataObj.sites) {
      // if ( dataObj.sites[site].hasOwnProperty('details') !== false && dataObj.sites[site].hasOwnProperty('diff') !== false ) {
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

        // Display data on main screen
        data.render(site, dataObj.sites[site].username, dataObj.sites[site].followers, dataObj.sites[site].details);

        // Render usernames in config screen
        data.settings(site, dataObj.sites[site].username);

        // Finally display items and remove class after animation completed
        itemsData.fadeIn(timingEffect);

        itemsData.find('.item').bind('animationend webkitAnimationEnd', function() {
          $(this).removeClass('bounceIn');
        }).addClass('bounceIn');
      // } else {
      //   $('.loading').fadeIn(timingEffect).find('p').text('Upgrade to the new version');
      //   api[site]('upgrade', dataObj.sites[site].username, site);
      //   storage.rem('user-diff');
      // }
    }

    // Display total numbers
    data.total();
  },

  settings: function(site, username) {
    $('.choose-social')
      .find('.' + site + ' span')
        .css('marginLeft', '-240px')
      .parent()
        .find('input')
        .show()
        .val(username);

    var clear = $('<span class="icon-clear"></span>');

    if ( !$('.choose-social').find('.' + site + ' .icon-clear').length ) $('.choose-social').find('.' + site).append(clear);
  },

  total: function() {
    var totalFollowers = 0;
    var totalSites = Object.keys(dataObj.sites).length;

    for (var site in dataObj.sites) {
      totalFollowers += parseInt(dataObj.sites[site].followers);
    }

    var itemTotal = '<li class="item total"><div class="left"><h2>total</h2><p>' + totalSites + ' network' + (totalSites > 1 ? 's' : '') + ' connected</p></div><div class="right"><div class="nbr">' + format(totalFollowers) + '</div><p><span></span>followers</p></div><ul class="detail-social total"></ul></li>';

    if ( !$('.list-social').find('.total').length ) {
      // If not total sum up display to the last li child of ul
      $('.list-social').find('.item').last().parent().append(itemTotal);

      // Set up graph
      data.graph();
    } else {
      // Move to the total item bottom
      $('.list-social').find('.total').appendTo('.list-social .social-wrapper');

      // Update total data
      $('.list-social').find('.total').find('.left p').text(format(totalSites) + ' network' + (totalSites > 1 ? 's' : '') + ' connected');
      $('.list-social').find('.total').find('.right .nbr').text(format(totalFollowers));

      // Set up graph
      data.graph();
    }
  },

  graph: function() {
    var canvas = '<li><canvas width="295" id="graph"></canvas></li>';
    $('.total').find('.detail-social').append(canvas);

    var ctx = $('#graph').get(0).getContext('2d');
    var gray = '#A6A6A6';

    var data = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets : [
        {
          fillColor: 'rgba(220, 220, 220, 0.5)',
          strokeColor: 'rgba(220, 220, 220, 1)',
          pointColor: 'rgba(220, 220, 220, 1)',
          pointStrokeColor: '#fff',
          data: dataObj['graph'].following
        },
        {
          fillColor: 'rgba(70, 195, 64, 0.15)',
          strokeColor: 'rgba(70, 195, 64, 1)',
          pointColor: '#f4f4f4',
          pointStrokeColor: 'rgba(70, 195, 64, 1)',
          data: dataObj['graph'].followers
        }
      ]
    }

    var options = {
      scaleLineColor: gray,
      scaleShowLabels: false,
      scaleFontColor: gray,
      scaleFontSize: 10,
      scaleGridLineColor : 'rgba(0, 0, 0, .03)',
      bezierCurve: false,
      pointDotStrokeWidth: 1,
      datasetStrokeWidth: 1,
      dataLabel: true,
      dataLabelColor: gray,
      animation: false
    };

    if ( dataObj['graph'].followers && dataObj['graph'].following !== null ) new Chart(ctx).Line(data, options);
  }
};
