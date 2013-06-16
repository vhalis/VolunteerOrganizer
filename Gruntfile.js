module.exports = function(grunt) {
	// Project config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
      dist: {
        src: [
          'src/**/*.js'
        ],
        dest: 'static/js/vo.js'
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
