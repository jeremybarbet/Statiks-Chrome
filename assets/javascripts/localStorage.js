var dataArray = {};

function saveProfile(site, username, followers) {
  if (localStorage !== null) {
    dataArray[site] = {
      username: username,
      followers: followers
    };

    localStorage.setItem('user-data', JSON.stringify(dataArray));
  }
}

function renderData(site, username, followers) {
  // Formatting big numbers
  followers = (followers + "").replace(/.(?=(?:.{3})+$)/g, '$& ');

  var itemList = '<li class="' + site + '"><div class="left"><h2>' +  ((site === 'cinqcentpx') ? (site = '500px') : site) + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p>followers</p></div></li>';
  $('.list-social').find('ul').append(itemList);
}

function initData() {
  // Build item container
  if (!$('.list-social').length) {
    var itemsContainer = '<div class="list-social"><ul></ul></div>';
    $(itemsContainer).insertAfter('.choose-social');
  }

  var itemsData = $('.list-social');

  /*
  * Delete DOM to prevent any issue
  * Probably something to improve
  */
  itemsData.find('ul').empty();

  // Hide choose social list
  $('.choose-social').hide();

  // Display parameters button
  $('.icon-settings, .icon-reload').fadeIn(timingEffect);
  $('.icon-back').fadeOut(timingEffect);

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

  // Finally display items and remove class after animation completed
  itemsData.fadeIn(timingEffect);

  itemsData.find('li').bind('animationend webkitAnimationEnd', function() {
    $(this).removeClass('bounceIn');
  }).addClass('bounceIn');
}

function checkData(param, timer) {
  if (localStorage.getItem('user-data') !== null && param !== 'reload') {
    dataArray = JSON.parse(localStorage.getItem('user-data'));

    // Hide add social button
    $('.add-social').hide();

    // Loading
    setTimeout(function() {
      $('.loading').fadeOut(timingEffect);
    }, 1500);

    // Show data after loading or back btn action
    if (timer == 'clear') {
      initData();
    } else {
      timer = setTimeout(function() {
        initData();
      }, 2000);
    }
  } else if (localStorage.getItem('user-data') !== null) {
    dataArray = JSON.parse(localStorage.getItem('user-data'));
    dataDiff = JSON.parse(localStorage.getItem('user-diff'));

    var totalFollowers = 0;
    var totalDiff = 0;

    Object.keys(dataArray).forEach(function(key) {
      totalFollowers += parseInt(dataArray[key].followers);
    });

    Object.keys(dataDiff).forEach(function(key) {
      totalDiff += parseInt(dataDiff[key].diff);
    });

    // Render new data
    $('.total').find('.right .nbr').text(totalFollowers);

    $('.total').find('.right p span').remove();
    $('.total').find('.right p').prepend('<span></span>');
    if (dataDiff !== null) $('.total').find('.right p span').text((totalDiff > 0 ? '+' : '') + totalDiff);
  }
}
