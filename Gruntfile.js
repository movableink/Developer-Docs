module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 4000,
          keepalive: true
        }
      }
    },
    sass: {
      dist: {
        files: {
          'css/style.css': 'scss/style.scss'
        }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'images/full',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'images/compress'
        }]
      }
    },
    watch: {
      // scripts: {
      //   files: ['js/*.js'],
      //   tasks: ['concat', 'uglify'],
      //   options: {
      //       spawn: true,
      //   }
      // },
      html: {
        files: ['index.html'],
      },
      sass: {
          files: ['**/*.scss'],
          tasks: ['sass']
      }, 
      imagemin: {
        files: ['images/full']
      }
    }


    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['sass', 'imagemin', 'watch', 'connect']);

};