module.exports = function(grunt) {
	// Project config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
      dist: {
        src: [
          //'src/js/jquery-1.10.1.js'
          //, 'underscore.js'
          //, 'backbone.js'
          'src/js/*.js'
        ],
        dest: 'static/js/vo.js'
      }
    },
    watch: {
      files: ['src/js/*.js'],
      tasks: ['concat']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'watch']);
}
