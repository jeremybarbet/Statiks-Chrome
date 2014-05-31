module.exports = function (grunt) {
  "use strict";

  require('load-grunt-tasks')(grunt);

  // Configuration
  var configuration = {
    pkg : grunt.file.readJSON('package.json')
  };

  grunt.registerTask('default', [
    'clean',
    'copy',
    'less:dev',
    'uglify:dev',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'clean',
    'copy',
    'less:dist',
    'uglify:dist',
    'zip'
  ]);

  grunt.registerTask('release', [
    'bump'
  ]);

  // Initialization
  grunt.initConfig({
    config: configuration,

    // Grunt-contrib-clean
    clean: {
      dist: ['dist/'],
      zip: ['statiks.zip']
    },

    // Grunt-contrib-clean
    copy: {
      dist: {
        files: [{
          expand: true,
          flatten: true,
          src: ['assets/fonts/*'],
          dest: 'dist/fonts/'
        },
        {
          'dist/jquery.min.js': 'assets/javascripts/lib/jquery.min.js'
        },
        {
          'dist/popup.js': 'assets/javascripts/popup.js'
        }]
      }
    },

    // Grunt-contrib-less
    less: {
      dev: {
        files: {
          'dist/app.min.css': 'assets/stylesheets/main.less'
        }
      },
      dist: {
        options: {
          compress: true
        },
        files: {
          'dist/app.min.css': 'assets/stylesheets/main.less'
        }
      }
    },

    // Grunt-bump
    bump: {
      options: {
        files: [
          'package.json',
          'manifest.json'
        ],
        commitFiles: [
          'package.json',
          'manifest.json'
        ],
        tagName: '%VERSION%',
        push: false
      }
    },

    // Grunt-contrib-uglify
    uglify: {
      dev: {
        options: {
          beautify: true
        },
        files: {
          'dist/app.min.js': [
            'assets/javascripts/app.js',
            'assets/javascripts/*.js'
          ]
        }
      },
      dist: {
        files: {
          'dist/app.min.js': [
            'assets/javascripts/app.js',
            'assets/javascripts/*.js'
          ]
        }
      }
    },

    zip: {
      'statiks.zip': [
        'popup.html',
        'manifest.json',
        'icon19.png',
        'icon38.png',
        'icon48.png',
        'icon128.png',
        'dist/**'
      ]
    },

    // Grunt-contrib-watch
    watch: {
      options: {
        forever: true
      },
      files: {
        files: [
          '*.html',
          'dist/*.css',
          'dist/*.js'
        ]
      },
      less: {
        files: ['assets/stylesheets/*.less'],
        tasks: ['less:dev']
      },
      uglify: {
        files: ['assets/javascripts/*.js'],
        tasks: ['uglify:dev']
      }
    }
  });
};
