/*
Check if there is some data into localStorage
Display the good username to the associated social account
function retrieveProfile() {
  if (localStorage) {
    var test = localStorage.getItem('dribbble_username');

    $('.choose-social').find('li span').animate({
      marginLeft: '-240px'
    }, 400, function() {
      $('.choose-social').find('li').find('input').show();
      $('.choose-social').find('li').find('input').val(test);
    });
  }
} retriveData();
*/

var saveProfile = {
  dribbble: function(data) {
    if (localStorage) {
      localStorage.setItem('dribbble_username', data.username);

      console.log(localStorage);
    }
  },

  cinqcentpx: function(data) {
    if (localStorage) {
      localStorage.setItem('500px_username', data.photos[0].user.username);

      console.log(localStorage);
    }
  },

  github: function(data) {
    if (localStorage) {
      localStorage.setItem('github_username', data.login);

      console.log(localStorage);
    }
  },


};
