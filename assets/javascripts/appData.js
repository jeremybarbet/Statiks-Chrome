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
  render: function(site, username, followers, details, index, id) {
    var itemList = '<li id="' + index + '" class="item ' + site + '"><div class="left"><h2>' + ((site === 'cinqcentpx') ? '500px' : site) + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + format(followers) + '</div><p><span></span>followers</p></div><ul class="detail-social ' + site + '"></ul></li>';

    if ( !$('.list-social').find('.item.' + site).length ) {
      if ( index == id ) $(itemList).appendTo('.list-social .social-wrapper');
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
    var itemsData;

    dataObj = storage.get('user-data');

    for (var i = 0; i < dataObj.order.length; i++) {
      var index = 0;

      for (var site in dataObj.sites) {
        // Build item container
        if ( !$('.list-social').length ) {
          var itemsContainer = '<div class="list-social"><ul class="social-wrapper"></ul></div>';
          $(itemsContainer).insertAfter('.choose-social');
        }

        itemsData = $('.list-social');

        // Hide choose social list
        $('.choose-social').hide();

        // Display parameters button
        $('.icon-settings, .icon-reload').fadeIn(timingEffect);
        $('.icon-back').fadeOut(timingEffect);

        // Display data on main screen
        data.render(site, dataObj.sites[site].username, dataObj.sites[site].followers, dataObj.sites[site].details, index, dataObj.order[i]);

        // Render usernames in config screen
        data.settings(site, dataObj.sites[site].username);

        index++;
      }
    }

    // Finally display items and remove class after animation completed
    itemsData.fadeIn(timingEffect);

    itemsData.find('.item').bind('animationend webkitAnimationEnd', function() {
      $(this).removeClass('bounceIn');
    }).addClass('bounceIn');

    // Order item and save it
    $('.list-social ul').sortable({
      cancel: '.item.total',
      start: function(event, ui) {
        ui.item.addClass('sort');
      },
      stop: function(event, ui) {
        ui.item.removeClass('sort');
      },
      update: function() {
        var order = $(this).sortable('toArray');

        dataObj.order = order;
        storage.set('user-data', dataObj);
      }
    });

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

    var itemTotal = '<li id="' + Object.keys(dataObj.sites).length + '" class="item total"><div class="left"><h2>total</h2><p>' + totalSites + ' network' + (totalSites > 1 ? 's' : '') + ' connected</p></div><div class="right"><div class="nbr">' + format(totalFollowers) + '</div><p><span></span>followers</p></div><ul class="detail-social total"></ul></li>';

    if ( !$('.list-social').find('.total').length ) {
      // If not total sum up display to the last li child of ul
      $('.list-social').find('.item').last().parent().append(itemTotal);
    } else {
      // Move to the total item bottom
      $('.list-social').find('.item.total').appendTo('.list-social .social-wrapper');

      // Update total data
      $('.list-social').find('.item.total').find('.left p').text(format(totalSites) + ' network' + (totalSites > 1 ? 's' : '') + ' connected');
      $('.list-social').find('.item.total').find('.right .nbr').text(format(totalFollowers));
    }

    // Set up graph
    data.graph();
  },

  graph: function() {
    if ( !$('#graph').length ) {
      var canvas = '<li><canvas width="295" height="200" id="graph"></canvas></li>';
      $('.total').find('.detail-social').append(canvas);

      var ctx = $('#graph').get(0).getContext('2d');
      chart = new Chart(ctx);
    }

    var maxFollowers = Math.max.apply(Math, dataObj.graph.followers);
    var maxFollowing = Math.max.apply(Math, dataObj.graph.following);
    var scaleW = (maxFollowers > maxFollowing) ? parseInt(maxFollowers / 7) : parseInt(maxFollowing / 7);
    var gray = '#A6A6A6';
    var animStart;

    // Get the index of last dataObj value of followers array
    for (var i = 0; i < dataObj.graph.followers.length; i++) {
      if ( dataObj.graph.followers[i] === 0 ) {
        animStart = i - 1;
        break;
      }

      if ( typeof(animStart) === undefined || i === dataObj.graph.followers.length - 1 ) animStart = dataObj.graph.followers.length - 1;
    }

    var data = {
      labels: ['', '', '', '', '', '', ''],
      datasets: [
        {
          fillColor: 'rgba(220, 220, 220, 0.5)',
          strokeColor: 'rgba(220, 220, 220, 1)',
          pointColor: 'rgba(220, 220, 220, 1)',
          pointStrokeColor: '#fff',
          data: dataObj.graph.following
        },
        {
          fillColor: 'rgba(70, 195, 64, 0.15)',
          strokeColor: 'rgba(70, 195, 64, 1)',
          pointColor: '#f4f4f4',
          pointStrokeColor: 'rgba(70, 195, 64, 1)',
          data: dataObj.graph.followers
        }
      ]
    };

    var options = {
      scaleOverride: true,
      scaleStartValue: 0,
      scaleSteps: 8,
      scaleStepWidth: scaleW,
      scaleLineColor: gray,
      scaleShowLabels: false,
      scaleFontColor: gray,
      scaleFontSize: 10,
      scaleGridLineColor: 'rgba(0, 0, 0, .03)',
      bezierCurve: false,
      pointDotStrokeWidth: 1,
      datasetStrokeWidth: 1,
      animation: true,
      animationStartWithData: animStart,
      inGraphDataShow: true,
      inGraphDataPaddingX: 6,
      inGraphDataPaddingY: 4,
      inGraphDataFontSize: 10,
      inGraphDataFontColor: gray,
      scaleXGridLinesStep: 0
    };

    if ( dataObj.graph.followers !== null && dataObj.graph.following !== null ) chart.Line(data, options);
  }
};
