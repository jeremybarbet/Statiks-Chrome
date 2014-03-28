var dataArray = [];

var saveProfile = {
  dribbble: function(username, itemList) {
    if (localStorage) {
      dataArray.push(username, itemList);
      localStorage['dribbble'] = JSON.stringify(dataArray);
    }
  },

  twitter: function(username, itemList) {
    if (localStorage) {
      dataArray.push(username, itemList);
      localStorage['twitter'] = JSON.stringify(dataArray);
    }
  },

  behance: function(username, itemList) {
    if (localStorage) {
      dataArray.push(username, itemList);
      localStorage['behance'] = JSON.stringify(dataArray);
    }
  },

  cinqcentpx: function(username, itemList) {
    if (localStorage) {
      dataArray.push(username, itemList);
      localStorage['500px'] = JSON.stringify(dataArray);
    }
  },
  
  github: function(username, itemList) {
    if (localStorage) {
      dataArray.push(username, itemList);
      localStorage['github'] = JSON.stringify(dataArray);
    }
  },

  vimeo: function(username, itemList) {
    if (localStorage) {
      dataArray.push(username, itemList);
      localStorage['vimeo'] = JSON.stringify(dataArray);
    }
  }
};
