
/* start setup connect for livereload */
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
  //return connect.use(connect['static'](path.resolve(point)));
};
/* end setup connect for livereload */

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/** \n' +
      ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
      ' * web: <%= pkg.homepage %> \n' +
      ' * issues: <%= pkg.bugs.url %> \n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> \n */\n',

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
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          YUI: true,
          require:true
        }
      },
      files: [ /*'Gruntfile.js',*/ 'js/stack-scroll.js']
      // Gruntfile doesn't Lint right now because of connect.static()
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },

    livereload: {
      port: 35729 // Default livereload listening port.
    },

    connect: {
      livereload: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, options.base)];
          }
        }
      }
    },

    rsync: {
      deploy: {
          src: "./",
          dest: "~/resume.ginader.com",
          host: "ssh-153524-ginader@ginader.com",
          recursive: true,
          syncDest: false,
          exclude: ["/node_modules", ".*"]
      }
    },

    regarde: {
      js: {
        files: '**/*.js',
        tasks: ['jshint', 'livereload'],
        spawn: true
      },
      css: {
        files: '**/*.scss',
        events: true,
        tasks: ['compass', 'livereload']
      }
    }
  });


  grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('deploy', ['rsync']);
  grunt.registerTask('default', ['jshint', 'compass']);


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks("grunt-rsync");

};
