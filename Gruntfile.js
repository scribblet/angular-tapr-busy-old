'use strict';
var path = require('path');

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    connect: {
      livereload: {
        options: {
          port: 8001,
          middleware: function(connect, options) {
            return [folderMount(connect, options.base)]
          }
        }
      }
    },
    regarde: {
      all: {
        files: ['**/*','!node_modules/**/*'],
        tasks: ['livereload']
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        smarttabs: true,
        globals: {
          jQuery: true,
          angular: true,
          console: true,
          $: true
        }
      },
      files: ['angular-tapr-busy.js']
    },
    jasmine: {
      unit: {
        src: ['./bower_components/jquery/jquery.js','./bower_components/angular/angular.js','./bower_components/angular-animate/angular-animate.js','./lib/angular-mocks.js','./bower_components/angular-promise-tracker/promise-tracker.js','./dist/angular-busy.js','./demo/demo.js'],
        options: {
          specs: 'test/*.js'
        }
      }
    },
    copy: {
      main: {
        files: [
          {src:'angular-tapr-busy.css',dest:'dist/'}
        ]
      }
    },
   ngtemplates: {
      main: {
        options: {
          module:'taprBusy',
          base:''
        },
        src:'template/angular-tapr-busy/angular-tapr-busy.html',
        dest: 'temp/templates.js'
      }
    },   
   concat: {
      main: {
        src: ['angular-tapr-busy.js', 'temp/templates.js'],
        dest: 'dist/angular-tapr-busy.js'
      }
    },    
    uglify: {
      main: {
        files: [
          {src:'dist/angular-tapr-busy.js',dest:'dist/angular-tapr-busy.min.js'}
        ]
      }
    },
    cssmin: {
      main: {
        files: {
          'dist/angular-tapr-busy.min.css': 'dist/angular-tapr-busy.css'
        }
      }
    }    
  });

  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('server', ['livereload-start','jshint','connect', 'regarde']);
  grunt.registerTask('build',['copy','ngtemplates','concat','uglify','cssmin']);
  grunt.registerTask('test',['build','jasmine']);
};