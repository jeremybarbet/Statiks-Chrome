Statiks
========

Statiks is an easy-to-use chrome extension allowing you to connect several social networks and retrieve your followers data.
You can reload your data and consult for each network how many followers you gained (or lost).

This is a _MVP_ Minimal Valuable Product, I will keep improving, adding new networks and more stats. Feel free to contribute.

[Visit the application's website](http://statiks.jeremybarbet.com)

TODO
----

* Add graph for total stats
* Possibility to sort networks
* Add loader when adding networks take too much time, to avoid repetitive Enter press
* Remove scrollbar on Windows platform

Changelog
---------

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

Here we go, you are ready to edit the extension. Gratz!

Contributors
------------

* Jérémy Barbet [@JeremDsgn](https://twitter.com/JeremDsgn)
