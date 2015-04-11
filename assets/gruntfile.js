/*
	Nona Grunt Tasks
	- - - - - - - - - - - - - - - - - - - - - -
	grunt buildit 			- copy out the basic dependancies from the bower_components folder
	grunt 				 	- build all the production assets and begin watch (slow)
	grunt dev 				- slimmer build for dev.
	grunt admin 			- build admin.
	grunt imgoptimize 		- optimize images.
	grunt favoptimize 		- optimize the favicons
	grunt cleanit 			- Clean out the public folder.
	grunt checkit 			- Check the js in the scripts folder.
	grunt stats 			- get all sorts of stats.   FIXME : not working currently
	TODO : Watch images assets folder, and delete files in the public folder.
	TODO : Autoprefixr for production
*/



// The grunt wrapper
module.exports = function(grunt) {

	/* Cool task timer */
	require('jit-grunt')(grunt);

	/* Cool task timer */
	require('time-grunt')(grunt);

	/* Init */
	grunt.initConfig({
		pkg 	: grunt.file.readJSON('package.json'), 	 // link to package file

		/* SETUP :  directory paths  - NB : if adjusting this check copy task */
		dirs 	: {
			sass 			: 'sass',
			sassLib 		: 'sass/lib',
			js 				: 'js',
			jsLib 			: 'js/lib',
			jsPlugins		: 'js/plugins',
			jsAdmin 		: 'js/admin',
			jsBuild 		: 'js/build',
			jsScripts		: 'js/scripts',
			img 			: 'img',
			fonts 			: 'fonts',
			fav		 		: 'favicons',
			public 			: '../public',
			publicCss 		: '../public/css',
			publicJs		: '../public/js',
			publicJsAdmin	: '../public/js/admin',
			publicImg		: '../public/img',
			publicFav		: '../public/favicons',
			publicFonts		: '../public/fonts',
			bower 			: 'bower_components'
		},




		/*
			Continuous Build tasks
			- - - - - - - - - - - - - - - - - - - - - -
			these are handled in the correct order by the grunt watch task, running
			the default grunt task will run these and reprocess all source files
			into a PRODUCTION build unless you use the dev task.

		TASK : Compile SASS */
		sass 	: {
			style 	: {
				options : {
					outputStyle 	: 'compressed',
					sourcemap 		: true
				 },
				files: {
				    '<%= dirs.publicCss %>/style.min.css': 'sass/style.scss'
				}
			},
			devStyle 	: {
				options : {
					outputStyle 	: 'expanded',
					sourcemap 		: true
				 },
				files: {
				    '<%= dirs.publicCss %>/style.min.css': 'sass/style.scss'
				}
			},
			admin 	: {
				options : {
					outputStyle 	: 'compressed',
					sourcemap 		: true
				},
				files: {
				    '<%= dirs.publicCss %>/admin.min.css'	: 'sass/admin.scss',
				    '<%= dirs.publicCss %>/editor.min.css'	: 'sass/editor.scss',
				    '<%= dirs.publicCss %>/login.min.css'	: 'sass/login.scss',
				}
			}
		},

		// TASK : concatenate JS plugin files
		concat 	: {
			options : {
					 separator  : '; \n \n',	// safety ; and 16 line breaks
				 },
			doInc 		: {
				src 	: [
					'<%= dirs.jsLib %>/jquery.js', 
					'<%= dirs.jsLib %>/underscore.js',
					'<%= dirs.jsLib %>/velocity.js',
					'<%= dirs.jsLib %>/velocityui.js',
					'<%= dirs.jsPlugins %>/*.js'
				],
				dest 	: '<%= dirs.jsBuild %>/includes.js',
			},
			doBuild 	: {
				src 	: [
					'<%= dirs.jsBuild %>/includes.js',
					'<%= dirs.jsScripts %>/main.js',
					'!<%= dirs.jsBuild %>/all.min.js'
				],
				dest 	: '<%= dirs.jsBuild %>/all.min.js'
			},
			devBuild 	: {
				src 	: [
					'<%= dirs.jsBuild %>/includes.js',
					'<%= dirs.jsScripts %>/main.js',
					'!<%= dirs.jsBuild %>/all.min.js'
				],
				dest 	: '<%= dirs.publicJs %>/all.min.js'
			},
			adminBuild 	: {
				src 	: [
					'<%= dirs.jsLib %>/jquery.js ',
					'<%= dirs.jsAdmin %>/login.js'
				],
				dest 	: '<%= dirs.jsAdmin %>/loginbuild.js'
			}
		},

		// TASK : minify scripts
		uglify: {
			pubjs: {
				options : {
					sourceMap: true
				},
				files: [{
					expand 	: true,
					cwd 	: '<%= dirs.jsBuild %>',
					src 	: 'all.min.js',
					dest 	: '<%= dirs.publicJs %>',
					ext 	: '.min.js'
				}]
			},
			adminjs: {
				options : {
					sourceMap: true
				},
				files: [{
					expand 	: true,
					cwd 	: '<%= dirs.jsAdmin %>',
					src 	: ['*.js', '!login.js'],
					dest 	: '<%= dirs.publicJsAdmin %>',
					ext 	: '.min.js'
				}]
			}
		},


		/*
			NON Continuous Tasks
			- - - - - - - - - - - - - - - - - - - - - -
			these need to either be run explicity from the command line
			by running grunt <task-name>, (look for the regstered task names
			at the end of the file), or may be included at the begining of
			the production build.
		*/


		// Image Optimazation task
		imagemin: {
			doImages : {
				options: {
					optimizationLevel: 3,
					progressive: true,
					interlaced: true,
				},
				files: [{
					expand: true,
					cwd: '<%= dirs.img %>',
					src: [' **/*.{png,jpg,gif,.svg}'],
					dest: '<%= dirs.publicImg %>'
				}]
			},
			doFav : {
				options: {
					optimizationLevel: 3,
				},
				files: [{
					expand: true,
					cwd: '<%= dirs.fav %>',
					src: [' **/*.{png,jpg,gif}'],
					dest: '<%= dirs.publicFav %>'
				}]
			}
		},

		// Copy Fav XML
		copy: {
			fav: {
				files: [{
					expand: true,
					src 	: ['<%= dirs.fav %>/*.xml','<%= dirs.fav%>/*.ico'],
					dest 	: '<%= dirs.public %>/',
					filter 	: 'isFile'
				}]
			},
			js: {
				files: [{
					expand: true,
					src 	: ['<%= dirs.js %>/support/*'],
					dest 	: '<%= dirs.public %>/',
					filter 	: 'isFile'
				}]
			},
			fonts: {
				files: [{
					expand 	: true,
					flatten : true,
					src 	: '<%= dirs.fonts %>/*',
					dest 	: '<%= dirs.publicFonts %>/',
					filter 	: 'isFile'
				}]
			}
		},

		// Bower Build
		bowercopy: {
		    options: {
		        srcPrefix: '<%= dirs.bower %>'
		    },
		    jslibs: {
		        options: {
		            destPrefix: '<%= dirs.jsLib %>'
		        },
		        files: {
		            'jquery.js'			: 'jquery/dist/jquery.js',
		            'underscore.js'		: 'underscore/underscore.js',
		            'velocity.js'		: 'velocity/velocity.js',
		            'velocityui.js'		: 'velocity/velocity.ui.js',
		            // 'fastclick.js'		: 'fastclick/:main'
		        }
		    },
		    jsPlugs: {
		        options: {
		            destPrefix: '<%= dirs.jsPlugins %>'
		        },
		        files: {
		            // 'bigSlide.js'			: 'bigSlide/dist/bigSlide.js',
		            'fitvids.js'			: 'fitvids/:main',
		            // 'cycle2.js'			: 'jquery-cycle2/:main',  //
		            // 'unveil.js'				: 'jquery-unveil/:main',
		            // 'magnific-popup.js'		: 'magnific-popup/dist/jquery.magnific-popup.js',
		            // 'matchHeight.js'		: 'matchHeight/jquery.matchHeight.js',
		        }
		    },
		    sassPlugins: {
		    	options: {
		    		destPrefix: '<%= dirs.sassLib %>'
		    	},
		    	files : {
		    		'_normalize.scss' 		: 'normalize-css/normalize.css',
		    		'_font-awesome.scss' 	: 'font-awesome/css/font-awesome.css',
		    		'_knife.scss' 			: 'knife/_knife.scss',
		    		'susy' 					: 'susy/sass/*',
		    		'breakpoint' 			: 'compass-breakpoint/stylesheets/*',
		    		// '_magnific-popup.scss' 	: 'magnific-popup/dist/magnific-popup.css'
		    	}
		    },
		    fonts: {
		    	options: {
		    		destPrefix: '<%= dirs.fonts %>/'
		    	},
		    	files : {
		    		'fonts' 	: 'font-awesome/fonts/*',
		    	}
		    }
		    //TODO: add essential Admin js plugin deps IE
		    //TODO: add essential login js plugin deps IE
		},

		// TASK : Create unique sets of the watch tasks listed below
		focus 	: {
			dev 		: {
				include : ['devcss', 'jsdev','images']
			},
			production 	: {
				include : ['css','jsScripts','images','adminCss','adminJs' ]
			},
			admin 		: {
				include : ['adminCss','adminJs']
			}
		},

		// TASK : All watch tasks : Watch files for changes and run tasks
		watch 	: {
			css 	: {
				options : {
					livereload 	: true, // will require the browser extension to be installed
				    spawn 		: true // may cause errors
				},
				files 	: ['<%= dirs.sass %>/*.scss','<%= dirs.sass %>/**/*.scss'],
				tasks	: ['sass:style']
			},
			jsScripts 	: {
				files 	: ['<%= dirs.jsScripts %>/*.js','<%= dirs.jsBuild %>/*.js', '!<%= dirs.jsBuild %>/all.min.js'],
				tasks 	: ['concat:doBuild','uglify:pubjs']
			},
			images  	: {
				files 	: '<%= dirs.img %>/*',
				tasks 	: ['newer:imagemin:doImages']
			},
			devcss 		: {
				options: {
					livereload 	: true, // will require the browser extension to be installed
				    spawn 		: true // may cause errors
				},
				files 	: ['<%= dirs.sass %>/*.scss','<%= dirs.sass %>/**/*.scss','!<%= dirs.sass %>/admin.scss', '!<%= dirs.sass %>/editor.scss','!<%= dirs.sass %>/login.scss'],
				tasks	: ['sass:devStyle']
			},
			jsdev 		: {
				files 	: ['<%= dirs.jsScripts %>/main.js'],
				tasks 	: ['concat:devBuild']
			},
			adminCss  	: {
				options: {
					livereload 	: true, // will require the browser extension to be installed
				    spawn 		: true // may cause errors
				},
				files 	: ['<%= dirs.sass %>/*.scss','<%= dirs.sass %>/**/*.scss','!<%= dirs.sass %>/style.scss' ],
				tasks 	: ['sass:admin']
			},
			adminJs	: {
				files 	: '<%= dirs.admin %>/*.js',
				tasks 	: ['concat:adminBuild', 'uglify:adminjs']
			},
		},

		// RUN BUILD TASKS CONCURRENTLY
		concurrent : {
			productionPrep : {
				tasks : ['sass:style', 'concat:doInc', 'imagemin', 'copy']
			},
			productionBuild : {
				tasks : ['sass:admin', 'concat:doBuild', 'concat:adminBuild']
			},
			devPrep : {
				tasks : ['sass:devStyle', 'concat:doInc', 'imagemin', 'copy']
			},
			devBuild : {
				tasks : ['sass:admin', 'concat:devBuild']
			},
			adminPrep : {
				tasks : ['sass:admin', 'concat:adminBuild']
			}

		},

		// TASK : Clean out the public Folder
		clean : {
			build : {
				options : {
					force: true,
					// noWrite : true
				},
				src : ["../public/*", "js/lib/*", "js/plugins/*", "sass/lib/*"]
			}
		}

	});



	/*
		Grunt Plugins we're using :
		- - - - - - - - - - - - - - - - - - - - - -
		NB : These Are autoloaded with JIT-GRUNT, they're
		listed here as a reference.

		https://github.com/shootaroo/jit-grunt
		https://github.com/joeytrapp/grunt-focus
		https://github.com/tschaub/grunt-newer
		https://github.com/gruntjs/grunt-contrib-copy
		https://github.com/gruntjs/grunt-contrib-clean
		https://github.com/gruntjs/grunt-contrib-jshint
		https://www.npmjs.org/package/grunt-contrib-concat
		https://www.npmjs.org/package/grunt-contrib-uglify
		https://github.com/gruntjs/grunt-contrib-watch
		https://github.com/gruntjs/grunt-contrib-sass // deprecated
		https://github.com/sindresorhus/grunt-sass
		https://github.com/gruntjs/grunt-contrib-imagemin
		https://github.com/timmywil/grunt-bowercopy
		https://github.com/dylang/grunt-notify
		https://github.com/dylang/grunt-time
		https://www.npmjs.org/package/grunt-css-metrics
	 */



	/*
		Setup Tasks
		- - - - - - - - - - - - - - - - - - - - - -
		grunt setup 			- run all production setup tasks
		grunt devSetup 			- run all development setup tasks
		grunt buildit 			- copy out the basic dependancies from the bower_components folder
		grunt devbuildit 		- copy out the basic dependancies from the bower_components folder and build dev assets
		grunt 				 	- build all the production assets and begin watch (slow)
		grunt dev 				- slimmer build for dev.
		grunt admin 			- build WP admin scripts and styles.
		grunt imgoptimize 		- optimize images.
		grunt favoptimize 		- optimize the favicons
		grunt cleanit 			- Clean out the public folder.
	*/

	// Internal
	grunt.registerTask('setup', [ 'concurrent:productionPrep','concurrent:productionBuild', 'uglify']);  // sass:style','sass:admin', 'concat:doInc', 'concat:doBuild', 'concat:adminBuild', 'uglify', 'imagemin', 'copy'
	grunt.registerTask('devsetup', ['concurrent:devPrep', 'concurrent:devBuild']); // 'sass:devStyle', 'sass:admin', 'concat:doInc', 'concat:devBuild', 'imagemin', 'copy'

	// Build
	grunt.registerTask('buildit', ['clean', 'bowercopy', 'setup']);
	grunt.registerTask('devbuildit', ['clean', 'bowercopy', 'devsetup']);

	// Public
	grunt.registerTask('default', ['setup', 'focus:production']);	//  Default Tasks to run on start
	grunt.registerTask('dev' , ['devsetup', 'focus:dev']);
	grunt.registerTask('admin' , ['concurrent:adminPrep', 'uglify:adminjs', 'focus:admin']); // WordPress Specific
	grunt.registerTask('imgoptimize', ['imagemin:doimages']);
	grunt.registerTask('favoptimize', ['imagemin:dofav', 'copy:fav']);
	grunt.registerTask('cleanit', ['clean']);

}; // end Grunt File