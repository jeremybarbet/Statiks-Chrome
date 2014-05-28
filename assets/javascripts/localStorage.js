var dataArray = {};

function saveProfile(site, username, followers) {
  if (localStorage != null) {
    dataArray[site] = {
      username: username,
      followers: followers
    };

    localStorage.setItem('user-data', JSON.stringify(dataArray));
  }
};

function renderData(site, username, followers) {
  var itemList = '<li class="' + site + '"><div class="left"><h2>' +  ((site === 'cinqcentpx') ? (site = '500px') : site) + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p>followers</p></div></li>';
  $('.list-social').find('ul').append(itemList);
};

function checkData() {
  if (localStorage.getItem('user-data') != null) {
    dataArray = JSON.parse(localStorage.getItem('user-data'));

    // Display if data
    $('.list-social').removeClass('fadeOut');
    $('.list-social').css('display', 'block');

    // Delete DOM
    $('.list-social').find('ul').empty();

    // Delete add social button
    $('.add-social').addClass('fadeOut');
    $('.add-social').css('display', 'none');

    // Hide choose social list
    $('.choose-social').addClass('fadeOut');

    setTimeout(function() {
      $('.choose-social').css('display', 'none');
    }, 300);

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

      var clear = $('<span class="icon-clear"></span>');

      if (!$('.choose-social').find('.' + key).find('.icon-clear').length) {
        $('.choose-social').find('.' + key).append(clear);
      }

      // Calculate total followers
      totalFollowers += parseInt(dataArray[key].followers);
    });

    // Display total followers and total network connected
    totalSites = Object.keys(dataArray).length + ((Object.keys(dataArray).length > 1) ? ' networks connected' : ' network connected');
    renderData('total', totalSites, totalFollowers);
  }
};
