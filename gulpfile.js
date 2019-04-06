var themeName 		= 'stanleywp';

var gulp 			= require('gulp'),
	autoprefixer 	= require('gulp-autoprefixer'),
	browserSync 	= require('browser-sync').create(),
	reload 			= browserSync.reload,
	sass 			= require('gulp-sass'),
	cleanCSS		= require('gulp-clean-css'),
	sourcemaps 		= require('gulp-sourcemaps'),
	concat 			= require('gulp-concat'),
	imagemin		= require('gulp-imagemin'),
	changed 		= require('gulp-changed'),
	uglify			= require('gulp-uglify'),
	lineec 			= require('gulp-line-ending-corrector');

var root 			= './',
	scss			= root + 'sass/',
	js 				= root + 'js/',
	jsdist			= root + 'dist/js/';

var phpWatchFiles 	= root + '**/*.php',
	styleWatchFiles	= scss + '**/*.scss';

var jsSRC 			= [
	js + '/src/site.js',
	js + 'manifest.js'
];

var cssSRC 			= [
	root + 'style.css'
];
// 	root + '',

var imgSRC 			= root + 'src/images/*',
	imgDEST			= root + 'dist/images';

function css() {
	return gulp.src([scss + 'style.scss'])
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sass({
		outputStyles: 'expanded'
	}).on('error', sass.logError))
	.pipe(autoprefixer('last 2 versions'))
	.pipe(sourcemaps.write())
	.pipe(lineec())
	.pipe(gulp.dest(root));
}

function concatCSS () {
	return gulp.src(cssSRC)
	.pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
	.pipe(concat('style.min.css'))
	.pipe(cleanCSS())
	.pipe(sourcemaps.write('./maps/'))
	.pipe(lineec())
	.pipe(gulp.dest(scss));
}

function javascript() {
	return gulp.src(jsSRC)
	.pipe(concat('stanleywp.js'))
	.pipe(uglify())
	.pipe(lineec())
	.pipe(gulp.dest(jsdist));
}

function imgmin() {
	return gulp.src(imgSRC)
	.pipe(changed(imgDEST))
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5})
	]))
	.pipe(gulp.dest(imgDEST));
}

function watch () {
	browserSync.init({
		open: 	'external',
		proxy: 	'http://localhost:8888/wordpress',
		port: 	'8888',
		browser: 'google chrome'
	});
	gulp.watch(styleWatchFiles, gulp.series([css, concatCSS]));
	gulp.watch(jsSRC, javascript)
	gulp.watch(imgSRC, imgmin)
	gulp.watch([phpWatchFiles, jsdist + 'stanleywp.js', scss + 'style.min.css']).on('change', browserSync.reload);
}

// browser: "google chrome"
// browser: ["google chrome", "firefox"]

exports.css = css;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

var build = gulp.parallel(watch);
gulp.task('default', build);







