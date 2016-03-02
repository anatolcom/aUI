/* global module */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
//    clean: ["build"],
        requirejs :
        {
            compile :
            {
                options :
                {
                    locale : "ru-ru",
                    baseUrl : "public_html/js/",
//                removeCombined: true,
//                findNestedDependencies: true,
                    optimize : 'uglify', // disables minification for all files
                    name : "aUI",
//                dir:"build"
                    out : "build/js/aUI_single.js",
                    uglify : {
                        toplevel : true,
                        ascii_only : false,
                        beautify : true,
                        max_line_length : 1000,
                        //Custom value supported by r.js but done differently
                        //in uglifyjs directly:
                        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
                        no_mangle : true
                    }
//                    ,generateSourceMaps: true
                }
            },
            compile_mini :
            {
                options :
                {
                    locale : "ru-ru",
                    baseUrl : "public_html/js/",
//                removeCombined: true,
//                findNestedDependencies: true,
                    optimize : "uglify",
                    name : "aUI",
                    out : "build/js/aUI_mini.js",
                    uglify : {
                        toplevel : true,
                        ascii_only : true,
                        beautify : false,
                        max_line_length : 1000,
                        no_mangle : false
                    }
//                    ,generateSourceMaps: false
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