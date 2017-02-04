/*global require, module*/
/*jshint node:true*/



module.exports = function (grunt) {
  "use strict";

  var config = {
    app:  'src',
    dist: 'dist'
  };


  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });


  // Define the configuration for all the tasks
  grunt.initConfig({

    config: config,

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      js: {
        files: ['src/js/*.js'],
        tasks: ['jshint']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/js/*.js'
      ]
    },

    dist: {
      options: {
        background: false,
        server:     '<%= config.dist %>'
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      deploy: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*'
          ]
        }]
      },
      server: '.tmp'
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot:    true,
          cwd:    '<%= config.app %>',
          dest:   '<%= config.dist %>',
          src: [
            '*.{ico,png,txt,html}',
            'img/{,*/}*.{ico,png,jpg,jpeg,gif,txt,webp}',
            'css/{,*/}*.css',
            'js/{,*/}*.js'
            //'{,*/}*.html',
            //'**/*.html',
            //'fonts/{,*/}*.*'//,
            //'<%= config.app %>/js/{,*/}*.js',
            //'<%= config.app %>/css/{,*/}*.css'
          ]
        }]
      },
      deploy: {
        files: [{
          expand: true,
          dot:    true,
          cwd:    '<%= config.dist %>',
          dest:   'dist',
          src: [
            '*.{ico,png,txt}',
            'img/*.{ico,png,txt}',
            'img/{,*/}*.webp',
            //'{,*/}*.html',
            '**/*.html',
            'fonts/{,*/}*.*',
            'js/{,*/}*.js',
            'css/{,*/}*.css'
          ]
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= config.dist %>/css/style.min.css': [
            '.css/{,*/}*.css',
            '<%= config.app %>/css/{,*/}*.css'
          ]
        }
      }
    },
    // MarkerClusterGroup
    uglify: {
      dist: {
        files: {
          '<%= config.dist %>/js/script.min.js': [
            '<%= config.app %>/js/**/*.js'
          ]
        }
      }
    },

    "replace": {
      "dist": {
        "src":       ["dist/index.html"],
        "overwrite": true,
        "replacements": [
          {
            "from": '.css"',
            "to":   '.css?_v=' + new Date().toISOString().replace("T", "-").replace(/:/g, "-").substr(0, 19) + '"'
          },
          {
            "from": '.js"',
            "to":   '.js?_v=' + new Date().toISOString().replace("T", "-").replace(/:/g, "-").substr(0, 19) + '"'
          }
        ]
      }
    },
		
    "ftp-deploy": {
      "jyrto": {
        auth: {
          host:    "217.146.69.6",
          port:    21,
          authKey: "jyrto"
        },
        src: "dist",
        dest: "/",
        exclusions: [
          "Gruntfile.js",
          "package.json",
          ".ftppass"
        ],
        progress: false
      }
    }

  });
	
  grunt.loadNpmTasks("grunt-text-replace");

  grunt.registerTask('serve', 'start and preview', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }
    return grunt.task.run([
      'clean:server',
      'watch'
    ]);
  });

  grunt.registerTask("build:assets", [
    "copy:dist",
    "cssmin",
    "uglify"
  ]);

  grunt.registerTask("build", [
    "clean:dist",
    "copy:dist",
    "cssmin",
    "uglify"
  ]);

  grunt.registerTask("deploy", [
    "clean:dist",
    "copy:dist",
		"replace:dist",
    //"cssmin",
    //"uglify",
    "ftp-deploy:jyrto"
  ]);

  grunt.registerTask("default", [
    "newer:jshint"
  ]);

};
