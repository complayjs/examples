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
					'./_output/canvas-form-data/js/app.js': ['./src/examples/canvas-form-data/js/main.js']
				}
			}
		},
		sync: {
			main: {
				files: [
					{cwd: 'src/complay/dist', src: ['complay.es5.min.js'], dest: '_output/basic-es5-component/js/'},
					{cwd: 'src/examples/', src: ['**/*.html'], dest: '_output/'},
					{cwd: 'src/examples/', src: ['**/*.css'], dest: '_output/css'}
				],
			    verbose: true, // Default: false 
				compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime" 
			}
		},
		browserSync: {
			options: {
				notify: true,
				host: "localhost",
				server: {
					baseDir: './_output',
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
				files: [
					'src/examples/**/*.js',
					'src/complay/helpers/**/*.js',
					'src/complay/extensions/**/*.js',
					'src/complay/lib/**/*.js',
					'src/complay/default-config.js'
				],
				tasks: ['browserify:examples'],
				options: {
					spawn: false
				}
			},
			assets: {
				files: [
					'src/examples/**/*.html', 
					'src/examples/**/*.css'
				],
				tasks: ['sync'],
				options: {
					spawn: false
				}	
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-sync');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'serve'
	]);

	grunt.registerTask('serve', [
		'browserify:examples', 
		'sync',
		'browserSync', 
		'watch'
	]);
};