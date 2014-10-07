Statiks
========

Statiks is an easy-to-use chrome extension allowing you to connect several social networks and retrieve your details stats.
You can reload your networks and consult for each network how many followers you gained (or lost) through a dynamic graph.

I keep improving, fixing, adding new networks and more stats. Feel free to contribute.

[Visit the application's website](http://statiks.jeremybarbet.com)

TODO
----

* Organize by default, by highest followers numbers
* Possibility to sort networks
* Share your stats on your favorites networks

Changelog
---------

__v1.3.0__

* Order your networks as you like
* Add deviantart integrations

__v1.2.3__

* Fix a loading error

__v1.2.2__

* Fix upgrade function

__v1.2.1__

* Add method to remove stats of a deleted networks
  * It removes followers/following stats from the graph, it didn't add a new point to the graph actually.

__v1.2.0__

* Add [chartnew.js](https://github.com/FVANCOP/ChartNew.js) for dynamic graph on total item with differents datas : 
  * You can follow the graph of followers and following stats.
  * You can reload your stats, and the graph is update automatically.
  * When the graph is full, and you decide to reload your data, the graph is empty and it begin again.
* Improve scrollbar on Windows OS 9e88d4e
* Add a loader when adding a network 4325f60
* Hover effect on item to show click possibility d3243e3
* Rewrite object data ac18cd9
* A global javascript file, for common functions and variables 3f0c8a7
* All libraries files are compiled on the same file e6e08b7
* Lot of fixes and improvements for a better stability

__v1.1.2__

* Fix instagram issue.

__v1.1.1__

* Add platform detection to avoid some weird issues.

__v1.1.0__

* New networks integrations : [Instagram](http://instagram.com), [Pinterest](http://www.pinterest.com), [Youtube](https://www.youtube.com), [Forrst](https://forrst.com) and [Soundcloud](https://soundcloud.com).
* Add networks details, like following, tweets, favorites, photos, and lot more for the differents networks.
* Add back button on header.
* Refactoring code to easily add news features.
* Add upgrade method for next releases.
* Avoid multiple ajax calls.
* Merge all data on the same object.
* Improve animations and timing effects.
* Fix a lot of bugs and make global improvement.

__v1.0.1__

* Improve global animations.
* Avoid user-select and create markup in renderData() function.
* Add a fail alert if there is no new followers after reloading data. Change alert color.
* Add bump and jshint dependencies.
* Fix warnings according to jshint.

__v1.0.0__

* First release.
* Allow you to retrieve your stats from [Dribbble](https://dribbble.com), [Twitter](https://twitter.com), [Behance](https://www.behance.net), [500px](http://500px.com), [GitHub](https://github.com), [Vimeo](https://vimeo.com).
* Reload your stats and consult how many followers you gained or lost since the last time.

Development
-----------

If you think about a new feature, or just fix some issues, feel free to fork this project.
There are only few things to set up.

__Repository__

You need first to [fork](https://github.com/JeremDsgn/statiks/fork) the project.

Now, make a clone of this fork on your computer.

`git clone https://github.com/[your_github_username]/statiks.git`  
`cd statiks`

__Running__

Statiks run with node.js and npm dependencies.

`npm install`  
`grunt`

__Launching__

* Go to Chrome -> Tools -> Extensions
* Activate Developer mode if false
* Load unpackage extension
* Choose the statiks folder (where you clone it)
* Voilà

Here we go, you are ready to edit the extension. Gratz!

Thanks
------

* Thanks to the guy behind [chartnew.js](https://github.com/FVANCOP/ChartNew.js) for the great support

Contributors
------------

* Jérémy Barbet [@JeremDsgn](https://twitter.com/JeremDsgn)
