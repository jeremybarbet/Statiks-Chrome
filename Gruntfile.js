module.exports = function (grunt) {
  "use strict";

  require('load-grunt-tasks')(grunt);

  // Configuration
  var configuration = {
    pkg : grunt.file.readJSON('package.json')
  };

  grunt.registerTask('default', [
    'compass:dev',
    'uglify',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'compass:dev',
    'uglify'
  ]);

  grunt.registerTask('deploy', [
    'nodewebkit'
  ]);

  // Initialization
  grunt.initConfig({
    config: configuration,

    // Grunt-contrib-compass
    compass: {
      options: {
        http_path: '/',
        sassDir: 'assets/stylesheets/',
        cssDir: 'dist/',
        imagesDir: 'assets/images/',
        javascriptsDir: 'assets/javascripts/',
        fontsDir: 'assets/fonts/',
        noLineComments: true,
        force: true
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'compressed'
        }
      },
      dev: {
        options: {
          environment: 'development',
          outputStyle: 'nested'
        },
        files: {
          'dist/app.css': 'assets/stylesheets/*.scss'
        }
      }
    },

    // Grunt-contrib-uglify
    uglify: {
      dev: {
        options: {
          beautify: true
        },
        files: {
          'dist/app.js': 'assets/javascripts/*.js'
        }
      },
      lib: {
        files: {
          'dist/jquery-1.11.0.min.js': 'assets/javascripts/lib/jquery-1.11.0.min.js'
        }
      }
    },

    // Grunt-node-webkit-builder
    nodewebkit: {
      options: {
        version: '0.9.2',
        build_dir: './build',
        // mac_icns: '',
        mac: true,
        win: false,
        linux32: false,
        linux64: false
      },
      src: './**/*'
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
      compass: {
        files: ['assets/stylesheets/*.scss'],
        tasks: ['compass:dev']
      },
      uglify: {
        files: ['assets/javascripts/*.js'],
        tasks: ['uglify:dev']
      }
    }
  });
};
