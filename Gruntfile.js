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
        eslint: {
            files: [
                'Gruntfile.js',
                'js/*.js',
                'js/roms/*.js',
                'js/ui/*.js'
            ]
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
                    },
                    livereload: true
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
        sasslint: {
            target: ['./css/*.scss']
        },
        clean: {
            dist: ['./dist']
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
                files: ['<%= eslint.files %>'],
                tasks: ['eslint','browserify'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['./html/*.html', 'img/*', 'json/*'],
                tasks: ['copy'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['./css/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');

    grunt.registerTask('lint', [
        'eslint',
        'sasslint'
    ]);

    grunt.registerTask('default', [
        'lint',
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
