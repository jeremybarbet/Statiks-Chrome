module.exports = function (grunt) {
  "use strict";

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'clean',
    'copy',
    'less:dev',
    'uglify:dev',
    'uglify:lib',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'clean',
    'copy',
    'less:dist',
    'uglify:dist',
    'uglify:lib',
    'zip'
  ]);

  grunt.registerTask('test', [
    'clean',
    'uglify:dev',
    'uglify:lib',
    'jshint'
  ]);

  // Initialization
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

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
            'assets/javascripts/appGlobal.js',
            'assets/javascripts/*.js'
          ]
        }
      },
      lib: {
        files: {
          'dist/lib.min.js': [
            'assets/javascripts/lib/jquery.min.js',
            'assets/javascripts/lib/jquery-ui.min.js',
            'assets/javascripts/lib/chartnew.js'
          ]
        }
      },
      dist: {
        files: {
          'dist/app.min.js': [
            'assets/javascripts/appGlobal.js',
            'assets/javascripts/*.js'
          ]
        }
      }
    },

    // Grunt-contrib-jshint
    jshint: {
      options: {
        ignores: ['assets/javascripts/lib/jquery.min.js']
      },
      files: ['assets/javascripts/*.js']
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
          'dist/*.css'
        ]
      },
      less: {
        files: ['assets/stylesheets/*.less'],
        tasks: ['less:dev']
      },
      dev: {
        files: ['assets/javascripts/*.js'],
        tasks: ['uglify:dev']
      },
      lib: {
        files: ['assets/javascripts/lib/*.js'],
        tasks: ['uglify:lib']
      }
    }
  });
};
