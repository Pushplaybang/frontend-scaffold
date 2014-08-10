/**
*	
*	Gulp Build Process : 
* 	=============================
*	This build process will create a public folder containting all the processed and 
*	optimized assets for your project, it relies on the bower.json setup which should be run 
*	first.  If you're not familiar with gulp follow the tutorials listed below to 
*	get started.  Learn more about gulp here : http://gulpjs.com/
*   
*   
*   
*	<**-	Make sure gulp and bower are installed (from terminal type) : 	-**>
*	npm isntall -g gulp
*	npm install -g bower
*	
*	<**- 	When starting a new project cd into the assets folder and run the following : 	-**>
*	npm isntall 					(this installs gulp and its dependancies)
*	bower install 					(this installs common front end libraries and packages)
*	gulp buidit 					(setup the project and project dependancies, NB re run this anytime you add new libraries or plugins)
*	gulp 							(default task that starts watching all the files for changes)
*	
*	
*	
*	Tutorials : 
*	- - - - - - - - - - - - - - -
*	http://www.smashingmagazine.com/2014/06/11/building-with-gulp/
*	http://code.tutsplus.com/tutorials/managing-your-build-tasks-with-gulpjs--net-36910
*	http://markgoodyear.com/2014/01/getting-started-with-gulp/
*
*
**/




/* Require the neccessary modules */
var gulp     	 = require('gulp'); 						// https://github.com/gulpjs/gulp/
var runSequence  = require('run-sequence'); 				// https://github.com/OverZealous/run-sequence/issues/4
var clean        = require('gulp-clean'); 					// https://github.com/peter-vilja/gulp-clean
var cache        = require('gulp-cache'); 					// https://github.com/wearefractal/gulp-cached
var order 		 = require("gulp-order"); 					// https://github.com/sirlantis/gulp-order
var rename       = require('gulp-rename'); 					// https://github.com/hparra/gulp-rename/pull/19
var merge   	 = require('merge-stream'); 				// https://github.com/grncdr/merge-stream
var notify       = require('gulp-notify'); 					// https://github.com/mikaelbr/gulp-notify
var livereload   = require('gulp-livereload'); 				// https://github.com/vohof/gulp-livereload
var sass         = require('gulp-ruby-sass'); 				// https://github.com/sindresorhus/gulp-ruby-sass
var autoprefixer = require('gulp-autoprefixer'); 			// https://github.com/Metrime/gulp-autoprefixer 
var jshint       = require('gulp-jshint'); 					// https://github.com/spenceralger/gulp-jshint
var uglify       = require('gulp-uglify'); 					// https://github.com/craigjennings11/gulp-uglifyjs
var concat       = require('gulp-concat'); 					// https://github.com/wearefractal/gulp-concat
var imagemin     = require('gulp-imagemin'); 				// https://github.com/sindresorhus/gulp-imagemin
var sourcemaps   = require('gulp-sourcemaps'); 				// https://github.com/floridoo/gulp-sourcemaps	
var psi 		 = require('psi'); 							// https://github.com/addyosmani/psi/

/* PSI Setup */
var $site 		 = 'http://movingtactics.co.za/';
var $strat 		 = 'desktop';

/* 

	SETUP :  directory paths 
	- - - - - - - - - - - - - - -
	based on this gulp file being in the 'assets' 
	folder with all of the raw projects files.

*/
dirs = {
	sass 			: 'sass/',
	sassLib 		: 'sass/lib/',
	js 				: 'js/',
	jsLib 			: 'js/lib/',
	jsPlugins		: 'js/plugins/',
	jsAdmin 		: 'js/admin/',
	jsScripts		: 'js/scripts/',
	jsSupport		: 'js/support/',
	img 			: 'img/',
	media 			: 'media/',
	fav		 		: 'favicons/',
	public 			: '../public/',
	publicCss 		: '../public/css/',
	publicJs		: '../public/js/',
	publicJsAdmin	: '../public/js/admin/',
	publicImg		: '../public/img/',
	publicMedia		: '../public/media/',
	publicFav		: '../public/favicons/',
	bower 			: 'bower_components/'
};




/* SASS */
gulp.task('sass', function() {
	return gulp.src(dirs.sass+'*.scss')
	.pipe(sass({ 
		style: 'compressed', 
		sourcemap: true,
		sourcemapPath: '../assets/sass', 
		errLogToConsole: false,
		cacheLocation: 'sass/',
        onError: function(err) {
            return notify().write(err);
        }}))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest( dirs.publicCss ))
	.pipe(notify({ message: 'Front End Sass task complete' }));
});




// /* Scripts */
gulp.task('scripts', function() {
  return gulp.src([
  		dirs.jsLib+'jquery.js',
  		dirs.jsLib+'underscore.js',
  		dirs.jsLib+'jquery.velocity.js',
  		dirs.jsLib+'velocity.ui.js',
  		dirs.jsLib+'fastclick.js',
  		dirs.jsPlugins+'**/*.js',
  		dirs.jsScripts+'**/*.js',
  	]).pipe(concat('all.js'))
    .pipe(rename({
    	suffix: '.min'
	}))
	.pipe(uglify())
	.pipe(sourcemaps.write())
    .pipe(gulp.dest( dirs.publicJs ))
    .pipe(notify({ message: 'Scripts task complete' }));
});




// /* Image Optimization */
gulp.task('images', function() {
	images = gulp.src(dirs.img+'**/*')
	.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	.pipe(gulp.dest(dirs.publicImg))
	.pipe(notify({ message: 'Images task complete' }));

	favicons = gulp.src(dirs.fav+'**/*.{png,jpg,gif}')
	.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	.pipe(gulp.dest(dirs.publicFav))
	.pipe(notify({ message: 'favicons task complete' }));

	copyfavextra = gulp.src([dirs.fac+'*.**','!'+dirs.fav+'**/*.{png,jpg,gif}']).pipe(gulp.dest(dirs.publicFav));

	return merge(images, favicons, copyfavextra);
});




/*

	GULP TASKS
	- - - - - - - - - - - - - - -
	Default task watches all the SASS, and JS files
	as well as the image, media and favicon files

*/

/* watch */
gulp.task('watch',function() {

	livereload.listen();

	gulp.watch([dirs.sass+'**/*.scss'], ['sass']).on('change', livereload.changed); 			// Watch .scss files
	gulp.watch(dirs.js+'**/*.js', ['scripts']).on('change', livereload.changed); 				// Watch .js files
	gulp.watch(dirs.img+'**/*', ['images']).on('change', livereload.changed); 					// Watch image files

});
	
/* default */
gulp.task('default',['sass', 'scripts', 'images', 'watch'], function() {});




/* 

	Build The Initial Project
	- - - - - - - - - - - - - - -
	Add additional Libraries, plugins, scripts and polyfills by 
	installing them with bower :  bower install <npkg> --save-dev 
	and then include them in the project as below.

*/

/* Essential SASS Libraries */
gulp.task('setupStyle', function() {
	var normalize   = gulp.src(dirs.bower+'normalize-css/normalize.css').pipe(rename({basename:'_normalize',extname:'.scss'})).pipe(gulp.dest(dirs.sassLib));	
	var knife 	    = gulp.src(dirs.bower+'knife/_knife.sass').pipe(gulp.dest(dirs.sassLib));
	var susy   		= gulp.src(dirs.bower+'susy/sass/**/*').pipe(gulp.dest(dirs.sassLib+'susy'));
	var breakpoint  = gulp.src(dirs.bower+'compass-breakpoint/stylesheets/**/*').pipe(gulp.dest(dirs.sassLib+'breakpoint'));

	return merge(normalize, knife, susy, breakpoint);
});

/* Essential JS Libraries */
gulp.task('setupJs',function() {
	var jq          = gulp.src(dirs.bower+'jquery/dist/jquery.js').pipe(gulp.dest(dirs.jsLib));
	var underscores = gulp.src(dirs.bower+'underscore/underscore.js').pipe(gulp.dest(dirs.jsLib));
	var velocity    = gulp.src(dirs.bower+'velocity/jquery.velocity.js').pipe(gulp.dest(dirs.jsLib));
	var velocityui  = gulp.src(dirs.bower+'velocity/velocity.ui.js').pipe(gulp.dest(dirs.jsLib));
	var fastclick   = gulp.src(dirs.bower+'fastclick/lib/fastclick.js').pipe(gulp.dest(dirs.jsLib));

	return merge( jq, underscores, velocity, velocityui, fastclick);
});

/* Essential Polyfils */
gulp.task('setupPolyfills',function() {
	var support 	= gulp.src(dirs.jsSupport+'**/*.js').pipe(gulp.dest(dirs.publicJs+'support/'));

	return support;
});

/* Fonts and Icons */
gulp.task('setupFonts', function() {
    var fontsA 		= gulp.src(dirs.bower+'font-awesome/fonts/*').pipe(gulp.dest(dirs.publicCss+'fonts/'));
    var fontAwesome = gulp.src(dirs.bower+'font-awesome/css/font-awesome.css').pipe(rename({basename:'_font-awesome',extname: 'scss'})).pipe(gulp.dest(dirs.sassLib));
});

gulp.task('buildit',['setupStyle','setupJs','setupPolyfills','setupFonts','images'], function() {});




/* 

	Page Speed Insights
	- - - - - - - - - - - - - - -
	Use this gulp task to  get insights into your sites
	performance, right in the terminal via the PageSpeed
	API.  Use the variables at the top of the file to
	set this up aand test online sites.

*/
gulp.task('psi', function (cb) {
	psi({
		nokey: 'true', // or use key: ‘YOUR_API_KEY’
		url: $site,
		strategy: $strat,
	}, cb);
});


