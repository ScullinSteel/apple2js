module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                src: [],
                dest: './dist/module.js',
                options: {
                    require: ['./js/main.js'],
                } 
            }
        },
        jshint: {
            files: [
                'Gruntfile.js',
                'js/*.js',
                'js/ui/*.js'
            ],
            options: {
                curly: true,
                forin: true,
                funcscope: true,
                newcap: true,
                node: true,
                quotmark: 'single',
                undef: true,
                unused: true
          }
        },
        clean: {
            dist: ['./dist'],
        },
        uglify: {
            dist: {
                files: {
                    './dist/module.min.js': ['./dist/module.js']
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint','browserify']
        }
    });
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['jshint', 'browserify', 'uglify']);  
};
