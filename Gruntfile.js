module.exports = function(grunt) {
	// Project config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
      dist: {
        src: [/*
          'src/js/jquery-1.10.1.js',
          'src/js/underscore.js',
          'src/js/backbone.js'*/
          'src/**/*.js'
          ],
        dest: 'vo.js'
      }
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['concat']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'watch']);
}
