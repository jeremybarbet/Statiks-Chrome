function successSocialItem($this, site, username, followers) {
  var success = $('<span class="icon-check"></span>');

  $this.find('input').blur();
  $('.icon-error').remove();
  
  if (!$('.icon-check').length) $this.append(success);
  
  saveProfile(site, username, followers);
};

function failSocialItem($this, response) {
  var error = $('<span class="icon-error"></span>');

  if (response) {
    $('.alert').animate({marginTop: '41px', opacity: '1'}, 500).find('p').text(response);

    setTimeout(function() {
      $('.alert').animate({marginTop: '-41px', opacity: '0'}, 500);
    }, 4000);    
  }

  $this.find('input').val('');
  $('.icon-check').remove();

  if (!$('.icon-error').length) $this.append(error);
};

var api = {
  dribbble: function($this, value, site) {
    $.getJSON('http://api.dribbble.com/' + value, function(data) {
      var username = data.username;
      var followers = data.followers_count;

      if ( username != undefined && followers != undefined ) {
        successSocialItem($this, site, username, followers);
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failSocialItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failSocialItem($this, response.responseJSON.message[1]);
    });
  },

  /*
   * There isn't any way to do it with the Twitter API.
   * So let's crawl the page and get the right followers div
   */

  twitter: function($this, value, site) {
    $.ajax({
      url: 'https://twitter.com/' + value, success: function(data) {
        console.log(data);

        var username = value;
        var followers = $('.follower_stats').find('.js-mini-profile-stat').html();

        successSocialItem($this, site, username, followers);
      }
    });
  },

  behance: function($this, value, site) {
    $.getJSON('https://www.behance.net/v2/users/' + value + '?api_key=pEb2TjTxS31kT7fv2TPma6WK8WF8Mlgf', function(data) {
      var username = data.user.username;
      var followers = data.user.stats.followers;

      if ( username != undefined && followers != undefined ) {
        successSocialItem($this, site, username, followers);
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failSocialItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failSocialItem($this, response.responseJSON.http_code);
    });
  },

  // API has changed FUCK IT
  // If term = bernard no way to find the first fucking username bernard
  // https://api.500px.com/v1/users/search?term=jeremdsgn&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3&type=users

  cinqcentpx: function($this, value, site) {
    $.getJSON('https://api.500px.com/v1/photos?feature=user&username=' + value + '&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3', function(data, response) {
      var username = data.photos[0].user.username;
      var followers = data.photos[0].user.followers_count;

      if ( username != undefined && followers != undefined ) {
        successSocialItem($this, site, username, followers);
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failSocialItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failSocialItem($this, response.responseJSON.error);
    });
  },

  github: function($this, value, site) {
    $.getJSON('https://api.github.com/users/' + value, function(data) {
      var username = data.login;
      var followers = data.followers;

      if ( username != undefined && followers != undefined ) {
        successSocialItem($this, site, username, followers);
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failSocialItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failSocialItem($this, response.responseJSON.message);
    });
  },

  vimeo: function($this, value, site) {
    $.getJSON('http://vimeo.com/api/v2/' + value + '/info.json', function(data) {
      var username = value;
      var followers = data.total_contacts;

      if ( username != undefined && followers != undefined ) {
        successSocialItem($this, site, username, followers);
      } else {
        var errorCustomMessage = 'Data from API are incorrect.';
        failSocialItem($this, errorCustomMessage);
      }
    })
    .fail(function(response) {
      failSocialItem($this, response.responseText);
    });
  }
};
