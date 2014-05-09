// var id = $('.list-social').find('li').length;
// var lastId;

/*
function successSocialItem($this, site, username, followers) {
  id = lastId + 1;
  lastId++;

  var itemList = '<li class="' + site + '" id="' + id + '"><div class="left"><h2>' + site + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p>followers</p></div></li>';
  var success = $('<span class="icon-check"></span>');

  $this.find('input').blur();
  $('.icon-error').remove();
  $this.append(success);

  $('.list-social').find('ul').append(itemList);
  saveProfile[site](username, itemList);
};
*/

function successSocialItem($this, site, username, followers) {
  // id = lastId + 1;
  // lastId++;

  // var itemList = '<li class="' + site + '" id="' + id + '"><div class="left"><h2>' + site + '</h2><p>' + username + '</p></div><div class="right"><div class="nbr">' + followers + '</div><p>followers</p></div></li>';
  var success = $('<span class="icon-check"></span>');

  $this.find('input').blur();
  $('.icon-error').remove();
  $this.append(success);

  // $('.list-social').find('ul').append(itemList);
  // saveProfile[site](username, followers);
  
  saveProfile(site, username, followers);
};

function failSocialItem($this) {
  var error = $('<span class="icon-error"></span>');

  $this.find('input').val('');
  $('.icon-check').remove();

  $this.append(error);
}

var api = {
  dribbble: function($this, value, site) {
    $.getJSON('http://api.dribbble.com/' + value, function(data) {
      var username = data.username;
      var followers = data.followers_count;

      successSocialItem($this, site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
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

      successSocialItem($this, site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  },

  // API has changed FUCK IT
  // If term = bernard no way to find the first fucking username bernard
  // https://api.500px.com/v1/users/search?term=jeremdsgn&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3&type=users

  cinqcentpx: function($this, value, site) {
    $.getJSON('https://api.500px.com/v1/photos?feature=user&username=' + value + '&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3', function(data) {      
      var username = data.photos[0].user.username;
      var followers = data.photos[0].user.followers_count;

      successSocialItem($this, site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  },

  github: function($this, value, site) {
    $.getJSON('https://api.github.com/users/' + value, function(data) {
      var username = data.login;
      var followers = data.followers;

      successSocialItem($this, site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  },

  vimeo: function($this, value, site) {
    $.getJSON('http://vimeo.com/api/v2/' + value + '/info.json', function(data) {      
      var username = value;
      var followers = data.total_contacts;

      successSocialItem($this, site, username, followers);
    })
    .fail(function() {
      failSocialItem($this);
    });
  }
};
