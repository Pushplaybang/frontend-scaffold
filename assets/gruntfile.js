// The grunt wrapper
module.exports = function(grunt) {

	/* Cool task timer */
	require('time-grunt')(grunt);

	/* Init */
	grunt.initConfig({
		pkg 	: grunt.file.readJSON('package.json'), 	 // link to package file
		
		/* SETUP :  directory paths */
		dirs 	: {
			sass 		: 'css/sass',
			css 		: 'css',
			js 			: 'js',
			jsLib 		: 'js/lib',
			jsPlugins	: 'js/plugins',
			jsBuild 	: 'js/build',
			img 		: 'img',
			favicon 	: 'favicon',
			public 		: '../public',
			publicCss 	: '../public/css',
			publicJs	: '../public/js',
			publicImg	: '../public/img',
			publicFav	: '../public/favicon',
		},




		/*
			Auto run / default tasks 
			- - - - - - - - - - - - - - - - - - - - - -
			these are handled in the correct order by the grunt 
			watch task, these are all triggered by simply running
			the grunt command.
		
		TASK : Compile SASS */
		sass 	: {
			options : {   
				// require 		: 'sass-media_query_combiner', // FIXME: NOT WORKING be sure to have installed the GEM : gem install sass-media_query_combiner                    			
				style 			: 'compressed',
				// trace 		: true,
				sourcemap 		: true,
				cacheLocation 	: '<%= dirs.sass %>/.sass-cache',
				noCache 		: false,
			 },
			dist 	: {
				files 	: [{
					expand 	: true,
					cwd 	: '<%= dirs.sass %>/', 			// search relative to this path
					src 	: ['*.scss'],					// pattern to match
					dest 	: '<%= dirs.css %>/',			// destination path
					ext 	: '.min.css'					// Dest filepaths will have this extension.
				}]
			}
		},

		// TASK : concatenate JS plugin files
		concat 	: {
			options : {
					 separator  : '; \n \n',	// safety ; and 16 line breaks
				 },
			doLib 	: {
				src 	: [
					'<%= dirs.jsLib %>/jquery.js',
					'<%= dirs.jsLib %>/underscore.js',
					'<%= dirs.jsLib %>/velocity.js',
					'<%= dirs.jsLib %>/velocityui.js',
					'<%= dirs.jsLib %>/fastclick.js',
				],
				dest 	: '<%= dirs.jsBuild %>/libs.js',
			},
			doPlugins : {
				src 	: '<%= dirs.jsPlugins %>/*.js',
				dest 	: '<%= dirs.jsBuild %>/plugins.js'
			},
		},

		// TASK : minify scripts 
		uglify: {
			my_target: {
				options : {
					sourceMap: true
				},
				files: [{
					expand 	: true,
					cwd 	: '<%= dirs.jsBuild %>',
					src 	: '*.js',
					dest 	: '<%= dirs.js %>',
					ext 	: '.min.js'
				}]
			}
		}, 

		// TASK : Watch files for changes and run tasks
		watch 	: {
			css 	: {
				options: {
					livereload 	: true, // will require the browser extension to be installed
				    spawn 		: false // may cause errors
				},
				files 	: 'css/sass/*.scss',
				tasks	: ['sass']
			},
			js 		: {
				files 	: ['<%= dirs.jsPlugins %>/*.js','<%= dirs.jsLib %>/*.js'],
				tasks 	: ['concat']
			},
			mini 	: {
				files 	: '<%= dirs.jsBuild %>',
				tasks 	: ['uglify']
			}
		},




		/* 
			NON Automated Tasks  
			- - - - - - - - - - - - - - - - - - - - - -
			these need to run explicity from the command line 
			by running grunt <task-name>, look for the regstered task names
			at the end of the file.
		*/

		// Test Js
		testjs 	: {
			jshint: {
			    all: ['js/*.js', '!js/plugins.min.js', '!js/lib.min.js']
			  }
		}, 

		// TASK : combine all the media queries
		cmq 	: {
			your_target: {
				files: {
					'<%= dirs.css %>'	: ['<%= dirs.css %>/*.css','!<%= dirs.css %>/*.min.css']
				}
			}
		},

		// TASK : minfy css as cmq task uncompresses the process sass
		cssmin: {
			minify: {
				expand: true,
				cwd: '<%= dirs.css %>/',
				src: ['*.css', '!*.min.css'],
				dest: '<%= dirs.css %>',
				ext: '.min.css'
			}
		},

		// Image Optimazation task
		imagemin: {                          		
			doimages : {                         	 	
				options: {                       	
					optimizationLevel: 3,
				},
				files: [{
					expand: true,                  
					cwd: 'src/',                   
					src: [' **/*.{png,jpg,gif}'],   
					dest: 'dist/'                  
				}]
			}
		},

		//Bower Build
		bowercopy: {
		    options: {
		        srcPrefix: 'bower_components'
		    },
		    jslibs: {
		        options: {
		            destPrefix: 'js/lib'
		        },
		        files: {
		            'jquery.js'			: 'jquery/dist/jquery.js',
		            'underscore.js'		: 'underscore/underscore.js',
		            'velocity.js'		: 'velocity/jquery.velocity.js',
		            'velocityui.js'		: 'velocity/velocity.ui.js',
		            'fastclick.js'		: 'fastclick/:main'
		        }
		    },
		    sassPlugins: {
		    	options: {
		    		destPrefix: 'css/sass/lib'
		    	},
		    	files : {
		    		'_normalize.scss' 	: 'normalize-css/:main',
		    		'_knife.sass' 		: 'knife/_knife.sass',
		    		'susy' 				: 'susy/sass/*',
		    		'breakpoint' 		: 'compass-breakpoint/stylesheets/*'
		    	}
		    }
		}

	});
	



	/* 
		Set up Grunt Plugin Dependencies 
		- - - - - - - - - - - - - - - - - - - - - -
		NB : doing this explicity for easier 
		control that autoloading 
	*/
	grunt.loadNpmTasks('grunt-contrib-sass');  				// https://github.com/gruntjs/grunt-contrib-sass
	grunt.loadNpmTasks('grunt-contrib-cssmin');				// https://github.com/gruntjs/grunt-contrib-cssmin
	grunt.loadNpmTasks('grunt-combine-media-queries');		// https://github.com/buildingblocks/grunt-combine-media-queries
	grunt.loadNpmTasks('grunt-contrib-copy');				// https://github.com/gruntjs/grunt-contrib-copy
	grunt.loadNpmTasks('grunt-contrib-clean');				// https://github.com/gruntjs/grunt-contrib-clean
	grunt.loadNpmTasks('grunt-bowercopy');					// https://github.com/timmywil/grunt-bowercopy
	grunt.loadNpmTasks('grunt-contrib-concat');  			// https://www.npmjs.org/package/grunt-contrib-concat
	grunt.loadNpmTasks('grunt-contrib-uglify');  			// https://www.npmjs.org/package/grunt-contrib-uglify
	grunt.loadNpmTasks('grunt-contrib-watch');				// https://github.com/gruntjs/grunt-contrib-watch
	grunt.loadNpmTasks('grunt-notify');						// https://github.com/dylang/grunt-notify
	grunt.loadNpmTasks('grunt-contrib-jshint'); 			// https://github.com/gruntjs/grunt-contrib-jshint
	grunt.loadNpmTasks('grunt-contrib-imagemin');			// https://github.com/gruntjs/grunt-contrib-imagemin




	/*
		 Setup Tasks 
		- - - - - - - - - - - - - - - - - - - - - -
		grunt 				 	-  build all the basic assets and begin watch
		grunt cssoptimize 		-  run a task that combines all our media queries and re minifies our CSS
		grunt testjs			-  run jshint on OUR js code
		grunt buildit 			-  copy out the basic dependancies from the bower_components folder
	*/
	grunt.registerTask('default',['sass','concat','uglify', 'watch']);	//  Default Tasks to run on start
	grunt.registerTask('cssoptimize', ['cmq','cssmin']); 
	grunt.registerTask('testjs', ['jshint']);
	grunt.registerTask('buildit', ['bowercopy']);


}; // end Grunt File