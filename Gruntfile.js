/* global module */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
//    clean: ["build"],
    requirejs :
    {
        compile: 
        {
            options: 
            {
                baseUrl: "js/aui/",
                removeCombined: true,
                mainConfigFile: "js/aui/aUI.js",
                findNestedDependencies: true,
                name: "aUI",
                out: "build/aUI.js"
            }
        }
    }/*,
    concat: 
    {
      dist: 
      {
        src: ['src/js/jquery.js','src/js/intro.js', 'src/js/main.js', 'src/js/outro.js'],
        dest: 'dist/build.js'
      }
    },
    uglify: 
    {
      dist: 
      {
        files: 
        {
          'dist/build.min.js': ['dist/build.js']
        }
      }
    },
    imagemin: 
    {
      options: 
      {
        cache: false
      },

      dist: 
      {
        files: 
        [
            {
              expand: true,
              cwd: 'src/',
              src: ['** /*.{png,jpg,gif}'],
              dest: 'dist/'
            }
        ]
      }
    }*/
  });

//  grunt.loadNpmTasks('grunt-contrib-clean');
//  grunt.loadNpmTasks('grunt-contrib-concat');
//  grunt.loadNpmTasks('grunt-contrib-uglify');
//  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', [ 'requirejs' ]); /*'concat', 'uglify', 'imagemin'*/

};