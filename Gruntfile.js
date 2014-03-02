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
    'uglify',
    'watch'
  ]);

  grunt.registerTask('dev', [
    'clean',
    'copy',
    'less:dev',
    'uglify'
  ]);

  grunt.registerTask('deploy', [
    'nodewebkit'
  ]);

  // Initialization
  grunt.initConfig({
    config: configuration,

    // Grunt-contrib-clean
    clean: {
      dist: ['dist/']
    },

    // Grunt-contrib-clean
    copy: {
      files: {
        expand: true,
        flatten: true,
        src: ['assets/fonts/*'],
        dest: 'dist/fonts/'
      },
    },

    // Grunt-contrib-less
    less: {
      dev: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'assets/stylesheets/main.css.map',
          sourceMapRootpath: '/'
        },
        files: {
          'dist/app.css': 'assets/stylesheets/main.less'
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
