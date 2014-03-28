var id = $('.list-social').find('li').length;
var lastId;

function successSocialItem($this, _social_site, username, followers) {
  id = lastId + 1;
  lastId++;

  var itemList = '<li class="' + _social_site + '" id="' + id + '"><div class="left"><h2>' + _social_site + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p>followers</p></div></li>';
  var success = $('<span class="icon-check"></span>');

  $this.find('input').blur();
  $('.icon-error').remove();
  $this.append(success);

  $('.list-social').find('ul').append(itemList);
  saveProfile[_social_site](username, itemList);
};

function failSocialItem($this) {
  var error = $('<span class="icon-error"></span>');

  $this.find('input').val('');
  $('.icon-check').remove();

  $this.append(error);
}

var api = {
  dribbble: function($this, _social_value, _social_site) {
    $.getJSON('http://api.dribbble.com/' + _social_value, function(data) {
      console.log('dribbble');

      var username = data.username;
      var followers = data.followers_count;

      successSocialItem($this, _social_site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  },

  /*
   * There isn't any way to do it with the Twitter API.
   * So let's crawl the page and get the right followers div
   */

  twitter: function($this, _social_value, _social_site) {
    $.ajax({
      url: 'https://twitter.com/' + _social_value, success: function(data) {
        console.log(data);

        var username = _social_value;
        var followers = $('.follower_stats').find('.js-mini-profile-stat').html();

        successSocialItem($this, _social_site, username, followers);
      }
    });
  },

  behance: function($this, _social_value, _social_site) {
    $.getJSON('https://www.behance.net/v2/users/' + _social_value + '?api_key=pEb2TjTxS31kT7fv2TPma6WK8WF8Mlgf', function(data) {
      console.log('behance');
      
      var username = data.user.username;
      var followers = data.user.stats.followers;

      successSocialItem($this, _social_site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  },

  cinqcentpx: function($this, _social_value, _social_site) {
    $.getJSON('https://api.500px.com/v1/photos?feature=user&username=' + _social_value + '&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3', function(data) {
      console.log('500px');
      
      var username = data.photos[0].user.username;
      var followers = data.photos[0].user.followers_count;

      successSocialItem($this, _social_site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  },

  github: function($this, _social_value, _social_site) {
    $.getJSON('https://api.github.com/users/' + _social_value, function(data) {
      console.log('github');

      var username = data.login;
      var followers = data.followers;

      successSocialItem($this, _social_site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  },

  vimeo: function($this, _social_value, _social_site) {
    $.getJSON('http://vimeo.com/api/v2/' + _social_value + '/info.json', function(data) {
      console.log('vimeo');
      
      var username = _social_value;
      var followers = data.total_contacts;

      successSocialItem($this, _social_site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  }
};
