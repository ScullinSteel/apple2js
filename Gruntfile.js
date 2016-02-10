module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                src: [],
                dest: './dist/module.js',
                options: {
                    extensions: ['.js'],
                    require: ['./js/main.js']
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
        connect: {
            server: {
                options: {
                    open: true,
                    port: 8000,
                    base: {
                        path: 'dist',
                        options: {
                            index: 'apple2js.html'
                        }
                    }
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        src: [
                            'json/**',
                            'img/**'
                        ],
                        dest: 'dist/'
                    },
                    {
                        src: 'html/apple2js.html',
                        dest: 'dist/',
                        expand: true,
                        flatten: true
                    },
                    {
                        cwd: 'node_modules/bootstrap/dist/',
                        src: '**/*',
                        dest: 'dist/',
                        expand: true
                    }
                ]
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    src: ['./css/*.scss'],
                    dest: './dist',
                    ext: '.css'
                }]
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
            scripts: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint','browserify']
            },
            html: {
                files: ['./html/*.html', 'img/*', 'json/*'],
                tasks: ['copy']
            },
            css: {
                files: ['./css/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', [
        'jshint',
        'sass',
        'browserify',
        'uglify',
        'copy'
    ]);

    grunt.registerTask('dev', [
        'default',
        'connect',
        'watch'
    ]);
};
