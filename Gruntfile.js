module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				},
				exclude: ['jquery'],
				transform: [
					[
						'babelify',
						{
							'loose': 'all',
							'sourceMaps': true,
							'modules': 'common',
							'optional': []
						}
					]
			]},
			examples: {
				files: { 
					'./_output/canvas-form-data/js/app.js': ['./src/canvas-form-data/js/app/main.js']
				}
			}
		},
		browserSync: {
			options: {
				notify: true,
				host: "localhost",
				server: {
					baseDir: './_ouput',
					index: "index.html"
				},
				watchTask: true,
				ghostMode: {
					clicks: true,
					scroll: true,
					forms: true
				}
			},
			bsFiles: {
				src: [
					'./_output/**/*.js',
					'./_output/**/*.css',
					'./_output/**/*.html'
				]
			}
		},
		watch: {
			scripts: {
				files: ['src/js/**/*.js', 'src/conduitjs/js/**/*.js'],
				tasks: ['browserify:examples'],
				options: {
					spawn: false,
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'serve'
	]);
	
	grunt.registerTask('serve', [
		'browserify:examples', 
		'browserSync', 
		'watch'
	]);
};