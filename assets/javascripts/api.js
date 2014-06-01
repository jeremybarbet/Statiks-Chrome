function successItem($this, site, username, followers) {
  var success = $('<span class="icon-check"></span>');

  $this.find('input').blur();
  $this.find('.icon-error').remove();
  $this.find('.icon-clear').remove();

  if (!$this.find('.icon-check').length) {
    $this.append(success);

    setTimeout(function() {
      $this.find('.icon-check').remove();
    }, 1500);
  }
  
  saveProfile(site, username, followers);
}

function failItem($this, response) {
  var error = $('<span class="icon-error"></span>');

  if (!$('.alert').length) {
    var alert = '<div class="alert"><p></p></div>';
    $(alert).insertAfter('header');
  }

  if (response) {
    $('.alert').animate({
      marginTop: '41px',
      opacity: '1'
    }, timingEffect).find('p').text(response);

    setTimeout(function() {
      $('.alert').animate({
        marginTop: '-41px',
        opacity: '0'
      }, timingEffect);
    }, 4000);
  }

  if ($this !== null) {
    $this.find('input').val('');
    $this.find('.icon-check').remove();
    $this.find('.icon-clear').remove();

    if (!$this.find('.icon-error').length) {
      $this.append(error);

      setTimeout(function() {
        $this.find('.icon-error').remove();
      }, 1500);
    }
  }
}

function reloadData($this, site, followers) {
  var dataDiff = {};

  if ( dataArray[site].followers !== followers ) {
    var diff = followers - dataArray[site].followers;

    dataDiff[site] = {
      diff: diff
    };

    // Update value of object
    dataArray[site].followers = followers;

    // Push to localstorage
    localStorage.setItem('user-data', JSON.stringify(dataArray));
    localStorage.setItem('user-diff', JSON.stringify(dataDiff));

    // Render new data
    $('.list-social').find('.' + site + ' .right .nbr').text(followers);
    $('.list-social').find('.' + site + ' .right p span').remove();
    $('.list-social').find('.' + site + ' .right p').prepend('<span></span>');
    $('.list-social').find('.' + site + ' .right p span').text((diff > 0 ? '+' : '') + diff);

    // Change total value
    checkData('reload', null);
  } else {
    failItem(null, 'Nothing new :(');
  }
}

var api = {
  dribbble: function($this, value, site) {
    $.getJSON('http://api.dribbble.com/' + value, function(data) {
      var username = data.username;
      var followers = data.followers_count;

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failItem($this, response.responseJSON.message[1]);
    });
  },

  twitter: function($this, value, site) {
    $.ajax({
      url: 'https://twitter.com/' + value,
      success: function(data) {
        data = data.replace(/&quot;/g, '"');

        var regex = /\"followers_count\":([^\,]+)/;
        var getFollowers = data.match(regex);

        var username = value;
        var followers = getFollowers[1];

        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      }
    })
    .fail(function() {
      var errorCustomMessage = 'Invalid username.';
      failItem($this, errorCustomMessage);
    });
  },

  behance: function($this, value, site) {
    $.getJSON('https://www.behance.net/v2/users/' + value + '?api_key=pEb2TjTxS31kT7fv2TPma6WK8WF8Mlgf', function(data) {
      var username = data.user.username;
      var followers = data.user.stats.followers;

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failItem($this, response.responseJSON.http_code);
    });
  },

  cinqcentpx: function($this, value, site) {
    $.getJSON('https://api.500px.com/v1/users/show?username=' + value + '&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3', function(data) {
      var username = data.user.username;
      var followers = data.user.followers_count;

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failItem($this, response.responseJSON.error);
    });
  },

  github: function($this, value, site) {
    $.getJSON('https://api.github.com/users/' + value, function(data) {
      var username = data.login;
      var followers = data.followers;

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failItem($this, response.responseJSON.message);
    });
  },

  vimeo: function($this, value, site) {
    $.getJSON('http://vimeo.com/api/v2/' + value + '/info.json', function(data) {
      var username = value;
      var followers = data.total_contacts;

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failItem($this, response.responseText);
    });
  },

  instagram: function($this, value, site) {
    $.ajax({
      url: 'http://instagram.com/' + value,
      success: function(data) {
        data = data.replace(/\\/g, '');

        var regex = /\"followed_by\":([^\,]+)/g;
        var getFollowers = data.match(regex);

        var username = value;
        var followers = getFollowers[1].substr(getFollowers[1].indexOf(':') + 1);

        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      }
    })
    .fail(function() {
      var errorCustomMessage = 'Invalid username.';
      failItem($this, errorCustomMessage);
    });
  },

  pinterest: function($this, value, site) {
    $.ajax({
      url: 'http://www.pinterest.com/' + value,
      success: function(data) {
        data = data.replace(/\\/g, '');

        var regex = /\"follower_count\":([^\,]+)/g;
        var getFollowers = data.match(regex);

        var username = value;
        var followers = getFollowers[1].substr(getFollowers[1].indexOf(' ') + 1);

        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      }
    })
    .fail(function() {
      var errorCustomMessage = 'Invalid username.';
      failItem($this, errorCustomMessage);
    });
  },

  youtube: function($this, value, site) {
    $.getJSON('https://gdata.youtube.com/feeds/api/users/' + value + '?v=2&alt=json', function(data) {
      var username = data.entry.yt$username.$t;
      var followers = data.entry.yt$statistics.subscriberCount;

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          reloadData($this, site, followers);
        } else {
          successItem($this, site, username, followers);
        }
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failItem($this, response.statusText);
    });
  }
};
