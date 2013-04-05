
/* start setup connect for livereload */
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect['static'](path.resolve(point));
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

    // setup jshint to behave
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
      files: [ 'Gruntfile.js', 'js/stack-scroll.js']
    },

// configure Sass/Compass for production (dist) and development (dev)
    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          cssDir: 'css',
          environment: 'production',
          outputStyle: 'compressed',
          noLineComments: true
        }
      },
      dev: {
        options: {
          sassDir: 'scss',
          cssDir: 'css',
          outputStyle: 'expanded',
          debugInfo: true, // write source map info: http://bricss.net/post/33788072565/using-sass-source-maps-in-webkit-inspector
          noLineComments: false
        }
      }
    },

    // delete all the files in the css folder to force recompile of all scss files for production
    clean: ["css"],

    // setup livereload server
    livereload: {
      port: 35729 // Default livereload listening port.
    },

    // setup demo server for livereload
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

    // load destination and host
    connection: grunt.file.readJSON('connection.json'),
    // define how and what rsync deploys
    rsync: {
      deploy: {
          src: "./",
          dest: '<%= connection.dest %>', // i.e. "/var/www"
          host: '<%= connection.host %>', // i.e. "user@server.com"
          recursive: true,
          syncDest: false,
          exclude: ["/node_modules", ".*"]
      }
    },

    // a different "watch" task that is preferred by livereload
    regarde: {
      js: {
        files: '**/*.js',
        tasks: ['jshint', 'livereload'],
        spawn: true
      },
      css: {
        files: '**/*.scss',
        events: true,
        tasks: ['compass:dev', 'livereload']
      }
    }
  });


  // $ grunt server 
  // used for dev. Will trigger livereload on scss and js change
  grunt.registerTask('server', ['livereload-start', 'clean', 'connect', 'regarde']);
  // $ grunt deploy
  // recompiles and pushes current version to production server
  grunt.registerTask('deploy', ['jshint', 'clean', 'compass:dist', 'rsync']);
  // $ grunt
  // test js and recompile Sass
  grunt.registerTask('default', ['jshint', 'compass']);


  // load required tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks("grunt-rsync");
  grunt.loadNpmTasks('grunt-contrib-clean');

};
