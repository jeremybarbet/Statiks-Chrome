/**
 * API namespace with related methods
 * Variables, success, fail, alert, store, graph, reload, reloadCount, check, upgrade and API connects
 * @global
 */
var api = {
  /*
   * Global variables
   */
  reloadNbr: 0,
  reloadAllow: false,
  buildGraph: false,
  curIndex: 0,
  curSite: [],

  /**
   * Alert messages
   */
  errorApi: 'Data from API are incorrect.',
  errorUsername: ' is not found.',
  noUpdate: 'Nothing new :(',

  /**
   * Success fallback when retrieve data
   */
  success: function($this, site, username, followers, details) {
    var success = $('<span class="icon-check"></span>');

    $this.find('input').blur();
    $this.find('.icon-error, .icon-clear, .api-loader').remove();

    /*
    * Display the check icon during a short time
    * Not add it on the DOM again, if is already append
    */
    if ( !$this.find('.icon-check').length ) {
      $this.append(success);

      setTimeout(function() {
        $this.find('.icon-check').remove();
      }, timingEffect * 3);
    }

    /*
    * Check if localstorage exist
    * Call function to store data
    */
    if ( localStorage !== null ) api.store(dataObj, site, username, followers, details);
  },

  /**
   * Fail fallback when can't retrieve data
   */
  fail: function($this) {
    var error = $('<span class="icon-error"></span>');

    $this.find('input').val('');
    $this.find('.icon-check, .icon-clear, .api-loader').remove();

    /*
    * Display the cross icon during a short time
    * Not add it on the DOM again, if is already append
    */
    if ( !$this.find('.icon-error').length ) {
      $this.append(error);

      setTimeout(function() {
        $this.find('.icon-error').remove();
      }, timingEffect * 3);
    }
  },

  /**
   * Alert messages
   */
  alert: function(message) {
    // Not add it on the DOM again, if is already append
    if ( !$('.alert').length ) {
      var alertWrapper = '<div class="alert"><p></p></div>';
      $(alertWrapper).insertAfter('header');
    }

    $('.alert').animate({
      marginTop: '41px',
      opacity: '1'
    }, timingEffect).find('p').text(message);

    setTimeout(function() {
      $('.alert').animate({
        marginTop: '-41px',
        opacity: '0'
      }, timingEffect);
    }, 4000);
  },

  /**
   * Function to store data to localstorage if all is good
   */
  store: function(dataObj, site, username, followers, details) {
    dataObj.sites[site] = {
      username: username,
      followers: followers,
      details: details,
      diff: {
        value: 0,
        followers: [0, 0, 0, 0, 0, 0, 0],
        following: [0, 0, 0, 0, 0, 0, 0]
      }
    };

    api.graph.sum.networks(site, followers, details);

    storage.set('user-data', dataObj);
  },

  /**
   * Clean classes to remove followers/following data on full arrays
   */
  graph: {
    // Detect when arrays are full and called the related function to clean them
    isFull: function() {
      for (var i = dataObj.graph.followers.length - 1; i >= 0; i--) {
        if ( isInArray(0, dataObj.graph.followers) === false ) {
          var totalFollowers = dataObj.graph.followers[i];
          var totalFollowing = dataObj.graph.following[i];

          for (var site in dataObj.sites) {
            var networksFollowers = dataObj.sites[site].diff.followers[i];
            var networksFollowing = dataObj.sites[site].diff.following[i];

            api.graph.clean.networks(site, networksFollowers, networksFollowing);
          }

          api.graph.clean.total(totalFollowers, totalFollowing);

          break;
        }
      }
    },

    sum: {
      // Add newtworks total
      networks: function(site, followers, details) {
        var tmp = storage.get('user-data');

        // Add followers/following numbers to related's site arrays
        for (i = 0; i < dataObj.graph.followers.length; i++) {
          if ( dataObj.graph.followers[i] === 0 ) {
            var curIndex = i;
            var curSite = site;

            dataObj.sites[site].diff.followers[i] = followers;
            if ( dataObj.sites[site].details.hasOwnProperty('following') ) dataObj.sites[site].diff.following[i] = details.following;

            break;
          }
        }

        if ( tmp !== null ) {
          // Enable the call to the function to sum up total followers/following
          for (var key in tmp.sites) {
            if ( !tmp.sites.hasOwnProperty(site) ) {
              // Copy last followers/following number to related index
              api.curIndex = curIndex;
              api.curSite.push(site);

              // Allow the build of graph data
              api.buildGraph = true;

              break;
            }
          }
        } else {
          api.buildGraph = true;
        }
      },

      // Method to sum up total of followers and following for all networks
      total: function() {
        for (var i = 0; i < dataObj.graph.followers.length; i++ ) {
          if ( dataObj.graph.followers[i] === 0 ) {
            for (site in dataObj.sites) {
              dataObj.graph.followers[i] += parseInt(dataObj.sites[site].diff.followers[i]);
              dataObj.graph.following[i] += parseInt(dataObj.sites[site].diff.following[i]);
            }
          }
        }

        storage.set('user-data', dataObj);
      },

      // Method to sum up missing followers/following values of previous networks
      missing: function(index, site) {
        for (var key in dataObj.sites) {
          for (var i = 0; i < site.length; i++) {
            if ( key !== site[i] ) {
              // First loop to store the value with the highest index
              for (var i = index; i >= 0; i--) {
                if ( isSame(dataObj.sites[key].diff.followers) === true ) var followersValue = followingValue = 0;

                if ( dataObj.sites[key].diff.followers[i] !== 0 ) {
                  var followersValue = dataObj.sites[key].diff.followers[i];
                  var followingValue = dataObj.sites[key].diff.following[i];
                }
              }

              // Second loop to complete and according to current index
              for (var i = index; i >= 0; i--) {
                if ( dataObj.sites[key].diff.followers[i] === 0 ) {
                  dataObj.sites[key].diff.followers[i] = followersValue;
                  if ( dataObj.sites[key].details.hasOwnProperty('following') ) dataObj.sites[key].diff.following[i] = followingValue;
                }
              }

              storage.set('user-data', dataObj);

              break;
            }
          }
        }
      },
    },

    // Clean classes to remove followers/following data on full arrays
    clean: {
      // Clean data for each networks
      networks: function(site, followers, following) {
        for (var i = 0; i < dataObj.sites[site].diff.followers.length; i++) {
          dataObj.sites[site].diff.followers[i] = 0;
          dataObj.sites[site].diff.following[i] = 0;

          if ( i === 0 ) {
            dataObj.sites[site].diff.followers[i] = followers;
            dataObj.sites[site].diff.following[i] = following;
          }
        }

        storage.set('user-data', dataObj);
      },

      // Clean total data
      total: function(followers, following) {
        for (var i = 0; i < dataObj.graph.followers.length; i++) {
          dataObj.graph.followers[i] = 0;
          dataObj.graph.following[i] = 0;

          if ( i === 0 ) {
            dataObj.graph.followers[i] = followers;
            dataObj.graph.following[i] = following;
          }
        }

        storage.set('user-data', dataObj);
      }
    }
  },

  /**
   * Method to reload data and store on another object
   * the diff since the last app launched.
   */
  reload: function($this, site, followers, details) {
    // Store followers/following data for building graph
    for (var i = 0; i < dataObj.graph.followers.length; i++) {
      if ( dataObj.graph.followers[i] === 0 ) {
        dataObj.sites[site].diff.followers[i] = followers;
        if ( dataObj.sites[site].details.hasOwnProperty('following') ) dataObj.sites[site].diff.following[i] = details.following;

        break;
      }
    }

    storage.set('user-data', dataObj);

    if ( dataObj.sites[site].followers !== followers ) {
      var diff = followers - dataObj.sites[site].followers;
      var socialItem = $('.list-social').find('.' + site + ' .right');
      var totalItem = $('.total').find('.right');

      // Update value of object
      dataObj.sites[site].diff.value = diff;
      dataObj.sites[site].followers = followers;

      // Push to localstorage
      storage.set('user-data', dataObj);

      // Render new data for each networks
      socialItem.find('.nbr').text(format(followers));
      socialItem.find('p span').text((diff > 0 ? '+' : '') + diff);

      var totalFollowers = 0;
      var totalDiff = 0;

      for (site in dataObj.sites) {
        totalFollowers += parseInt(dataObj.sites[site].followers);
        totalDiff += parseInt(dataObj.sites[site].diff.value);
      }

      totalItem.find('.nbr').text(format(totalFollowers));
      if ( totalDiff !== null && typeof totalDiff === 'number' ) totalItem.find('p span').text((totalDiff > 0 ? '+' : '') + totalDiff);
    } else if ( JSON.stringify(dataObj.sites[site].details) !== JSON.stringify(details) ) {
      // Update value of object
      dataObj.sites[site].details = details;

      // Push to localstorage
      storage.set('user-data', dataObj);

      for (var key in details) {
        $('.' + site).find('.' + key + ' .right').text(format(details[key]));
      }
    } else {
      api.reloadCount();
    }
  },

  /**
   * If there is no new followers for each networks, display an alert message
   */
  reloadCount: function() {
    api.reloadNbr++;

    if ( Object.keys(dataObj.sites).length === api.reloadNbr ) api.alert(api.noUpdate);
  },

  /**
   * Method to ckeck if upgrade is needed to a new version of Statiks
   */
  check: function() {
    var v = storage.get('statiks-version');

    if ( (v <= '1.1.0' || v === null) && storage.get('user-data') !== null ) {
      tmpObj = storage.get('user-data');

      for (var site in tmpObj) {
        api[site]('upgrade', tmpObj[site].username, site);
        delete tmpObj[site];
      }

      $(document).ajaxStop(function() {
        api.graph();
      });
    }

    app.version();
  },

  /**
   * Method to upgrade with new data
   */
  upgrade: function($this, site, username, followers, details) {
    $('.loading').fadeIn(timingEffect).find('p').text('Upgrade to the new version');
    api.store(dataObj, site, username, followers, details);
  },

  /**
   * Dribbble API connection
   */
  dribbble: function($this, value, site) {
    $.getJSON('http://api.dribbble.com/' + value, function(data) {
      var username = data.username;
      var followers = data.followers_count;

      var details = {
        following: data.following_count,
        likes: data.likes_received_count,
        comments: data.comments_received_count,
        shots: data.shots_count
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Twitter scrapper and catch followers from json on the page
   */
  twitter: function($this, value, site) {
    $.ajax({
      url: 'https://twitter.com/' + value,
      success: function(data) {
        data = data.replace(/&quot;/g, '"');

        var getFollowers = data.match(/\"followers_count\":([^\,]+)/);
        var getFollowing = data.match(/\"friends_count\":([^\,]+)/);
        var getTweets = data.match(/\"statuses_count\":([^\,]+)/);
        var getFavorites = data.match(/\"favourites_count\":([^\,]+)/);
        var getListed = data.match(/\"listed_count\":([^\,]+)/);

        var username = value;
        var followers = getFollowers[1];

        var details = {
          following: getFollowing[1],
          tweets: getTweets[1],
          favorites: getFavorites[1],
          listed: getListed[1]
        };

        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Behance API connection
   */
  behance: function($this, value, site) {
    $.getJSON('https://www.behance.net/v2/users/' + value + '?api_key=pEb2TjTxS31kT7fv2TPma6WK8WF8Mlgf', function(data) {
      var username = data.user.username;
      var followers = data.user.stats.followers;

      var details = {
        following: data.user.stats.following,
        likes: data.user.stats.appreciations,
        comments: data.user.stats.comments,
        views: data.user.stats.views
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * 500px API connection
   */
  cinqcentpx: function($this, value, site) {
    $.getJSON('https://api.500px.com/v1/users/show?username=' + value + '&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3', function(data) {
      var username = data.user.username;
      var followers = data.user.followers_count;

      var details = {
        following: data.user.friends_count,
        affection: data.user.affection,
        favorites: data.user.in_favorites_count,
        photos: data.user.photos_count,
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * GitHub API connection
   */
  github: function($this, value, site) {
    $.getJSON('https://api.github.com/users/' + value, function(data) {
      var username = data.login;
      var followers = data.followers;

      var details = {
        following: data.following,
        repo: data.public_repos,
        gist: data.public_gists
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Vimeo API connection
   */
  vimeo: function($this, value, site) {
    $.getJSON('http://vimeo.com/api/v2/' + value + '/info.json', function(data) {
      var username = value;
      var followers = data.total_contacts;

      var details = {
        videos: data.total_videos_uploaded,
        likes: data.total_videos_liked,
        albums: data.total_albums
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Instagram scrapper and catch followers from json on the page
   */
  instagram: function($this, value, site) {
    $.ajax({
      url: 'http://instagram.com/' + value,
      success: function(data) {
        data = data.replace(/\\/g, '');

        var getFollowers = data.match(/\"followed_by\":([^\,]+)/g);
        var getFollowing = data.match(/\"follows\":([^\}]+)/g);
        var getMedias = data.match(/\"media\":([^\,]+)/g);

        var username = value;
        var followers = (getFollowers.length == 2) ? getFollowers[1].substr(getFollowers[1].indexOf(':') + 1) : getFollowers[0].substr(getFollowers[0].indexOf(':') + 1);

        var details = {
          following: getFollowing[0].substr(getFollowing[0].indexOf(':') + 1),
          medias: getMedias[0].substr(getMedias[0].indexOf(':') + 1)
        };

        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Pinterest scrapper and catch followers from json on the page
   */
  pinterest: function($this, value, site) {
    $.ajax({
      url: 'http://www.pinterest.com/' + value,
      success: function(data) {
        data = data.replace(/\\/g, '');

        var getFollowers = data.match(/\"follower_count\":([^\,]+)/g);
        var getFollowing= data.match(/\"following_count\":([^\,]+)/g);
        var getPins = data.match(/\"pin_count\":([^\,]+)/g);
        var getBoards = data.match(/\"board_count\":([^\,]+)/g);
        var getLikes = data.match(/\"like_count\":([^\,]+)/g);

        var username = value;
        var followers = getFollowers[1].substr(getFollowers[1].indexOf(' ') + 1);

        var details = {
          following: getFollowing[1].substr(getFollowing[1].indexOf(' ') + 1),
          pins: getPins[1].substr(getPins[1].indexOf(' ') + 1),
          boards: getBoards[1].substr(getBoards[1].indexOf(' ') + 1),
          likes: getLikes[1].substr(getLikes[1].indexOf(' ') + 1)
        };

        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Youtube API connection
   */
  youtube: function($this, value, site) {
    $.getJSON('https://gdata.youtube.com/feeds/api/users/' + value + '?v=2&alt=json', function(data) {
      var username = data.entry.yt$username.$t;
      var followers = data.entry.yt$statistics.subscriberCount;

      var details = {
        views: data.entry.yt$statistics.totalUploadViews
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Forrst API connection
   */
  forrst: function($this, value, site) {
    $.getJSON('https://forrst.com/api/v2/users/info?username=' + value, function(data) {
      var username = data.resp.username;
      var followers = data.resp.followers;

      var details = {
        following: data.resp.following,
        posts: data.resp.posts,
        likes: data.resp.likes,
        comments: data.resp.comments
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  },

  /**
   * Soundcloud API connection
   */
  soundcloud: function($this, value, site) {
    $.getJSON('http://api.soundcloud.com/users/' + value + '.json?client_id=6ff9d7c484c5e5d5517d1965ca18eca9', function(data) {
      var username = data.permalink;
      var followers = data.followers_count;

      var details = {
        following: data.followings_count,
        tracks: data.track_count,
        playlist: data.playlist_count,
        favorites: data.public_favorites_count
      };

      if ( username !== undefined && followers !== undefined ) {
        if ( $this === 'reload' ) {
          api.reload($this, site, followers, details);
        } else if ( $this === 'upgrade' ) {
          api.upgrade($this, site, username, followers, details);
        } else {
          api.success($this, site, username, followers, details);
        }
      } else {
        api.fail($this);
        api.alert(api.errorApi);
      }
    })
    .fail(function() {
      api.fail($this);
      api.alert(value + api.errorUsername);
    });
  }
};
