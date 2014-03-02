var api = {
  dribbble: function($this, _social_value, _social_site) {
    var itemList = $('<li class="test"><div class="left"><h2>social</h2><p>Username</p></div><div class="right"><div class="nbr">1422</div><p>followers</p></div></li>')

    $.getJSON('http://api.dribbble.com/' + _social_value, function(data) {
      var success = $('<span class="icon-check"></span>');

      console.log(data.username, data.followers_count);

      $this.find('input').blur();
      $('.icon-error').remove();

      $this.append(success);


      saveProfile['dribbble'](data);


      // Test
      // Add data to template
      $('.list-social').find('ul').append(itemList);

      $('.test').addClass(_social_site);
      $('.test').find('.left h2').html(_social_site);
      $('.test').find('.left p').html(data.username);
      
      $('.test').find('.right .nbr').html(data.followers_count);
    })
    .fail(function() {
      var error = $('<span class="icon-error"></span>');

      $this.find('input').val('');
      $('.icon-check').remove();

      $this.append(error);
    });
  },



  twitter: function(_social_value) {
    console.log('twitter');
  },



  behance: function(_social_value) {
    console.log('behance');
  },



  google: function(_social_value) {
    console.log('google');
  },



  cinqcentpx: function($this, _social_value, _social_site) {
    var itemList = $('<li class="test"><div class="left"><h2>social</h2><p>Username</p></div><div class="right"><div class="nbr">1422</div><p>followers</p></div></li>')

    $.getJSON('https://api.500px.com/v1/photos?feature=user&username=' + _social_value + '&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3', function(data) {
      console.log(data.photos[0].user.username);

      var success = $('<span class="icon-check"></span>');

      console.log(data.photos[0].user.username, data.photos[0].user.followers_count);

      $this.find('input').blur();
      $('.icon-error').remove();

      $this.append(success);

      saveProfile['cinqcentpx'](data);

      // Test
      // Add data to template
      $('.list-social').find('ul').append(itemList);

      $('.test').addClass(_social_site);
      $('.test').find('.left h2').html('500px'); // To fix dynamically
      $('.test').find('.left p').html(data.photos[0].user.username);
      
      $('.test').find('.right .nbr').html(data.photos[0].user.followers_count);
    })
    .fail(function() {
      var error = $('<span class="icon-error"></span>');

      $this.find('input').val('');
      $('.icon-check').remove();

      $this.append(error);
    });
  },


  github: function($this, _social_value, _social_site) {
    var itemList = $('<li class="test"><div class="left"><h2>social</h2><p>Username</p></div><div class="right"><div class="nbr">1422</div><p>followers</p></div></li>')

    $.getJSON('https://api.github.com/users/' + _social_value, function(data) {
      var success = $('<span class="icon-check"></span>');

      console.log(data.login, data.followers);

      $this.find('input').blur();
      $('.icon-error').remove();

      $this.append(success);


      saveProfile['github'](data);


      // Test
      // Add data to template
      $('.list-social').find('ul').append(itemList);

      $('.test').addClass(_social_site);
      $('.test').find('.left h2').html(_social_site);
      $('.test').find('.left p').html(data.login);
      
      $('.test').find('.right .nbr').html(data.followers);
    })
    .fail(function() {
      var error = $('<span class="icon-error"></span>');

      $this.find('input').val('');
      $('.icon-check').remove();

      $this.append(error);
    });
  }
};
