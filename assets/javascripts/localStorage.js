var dataArray = [];

function saveProfile(site, username, followers) {
  if (localStorage) {
    dataArray.push({
      site: {
        username: username,
        followers: followers
      }
    });

    localStorage.setItem('userData', JSON.stringify(dataArray));
    console.log(dataArray);
  }
}

/*
var saveProfile = {
  dribbble: function(username, followers) {
    if (localStorage) {
      dataArray.push({
        dribbble: {
          username : username,
          followers : followers
        }
      });

      localStorage.setItem('all', JSON.stringify(dataArray));

      console.log(dataArray);

      // dataArray['dribbble'].push(username, followers);

      // dataArray.push(username, followers);
      // localStorage['dribbble'] = JSON.stringify(dataArray);
    }
  },

  twitter: function(username, followers) {
    if (localStorage) {
      dataArray.push(username, followers);
      localStorage['twitter'] = JSON.stringify(dataArray);
    }
  },

  behance: function(username, followers) {
    if (localStorage) {

      dataArray.push({
        behance: {
          username : username,
          followers : followers
        }
      });

      localStorage.setItem('all', JSON.stringify(dataArray));

      console.log(dataArray);

      // dataArray.push(username, followers);
      // localStorage['behance'] = JSON.stringify(dataArray);
    }
  },

  cinqcentpx: function(username, followers) {
    if (localStorage) {
      dataArray.push(username, followers);
      localStorage['500px'] = JSON.stringify(dataArray);
    }
  },
  
  github: function(username, followers) {
    if (localStorage) {
      dataArray.push(username, followers);
      localStorage['github'] = JSON.stringify(dataArray);
    }
  },

  vimeo: function(username, followers) {
    if (localStorage) {
      dataArray.push(username, followers);
      localStorage['vimeo'] = JSON.stringify(dataArray);
    }
  }
};
*/
