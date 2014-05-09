var dataArray = {};

function saveProfile(site, username, followers) {
  if (localStorage != null) {
    dataArray[site] = {
      username: username,
      followers: followers
    };

    localStorage.setItem('user-data', JSON.stringify(dataArray));
    console.log(dataArray);
  }
};
