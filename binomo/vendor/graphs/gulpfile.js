var gulp       = require('gulp');
var gutil      = require('gulp-util');
var webserver  = require('gulp-webserver');
var watchify   = require('watchify');
var browserify = require('browserify');
var debowerify = require('debowerify');
var watchify   = require('watchify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var sprite     = require('css-sprite').stream;
var concat     = require('gulp-concat');

var bundler = browserify('./src/js/Charts.js', {
  cache: {},
  packageCache: {},
  fullPaths: true
});

bundler.transform('debowerify');
bundler.transform('jstify', {engine: 'lodash'});

gulp.task('watch', function() {
  var css_watcher = gulp.watch('src/css/**/*.css', ['css']);
  var icons_watcher = gulp.watch('src/images/icons/**/*.png', ['sprite']);

  css_watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  icons_watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  watch();
});


function bundle() {
  console.log('Browserify...');

  return bundler.bundle()
    .pipe(source('Charts.js'))
      .pipe(buffer())
      // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      // .pipe(sourcemaps.write('./')) // writes .map file
    //
    .pipe(gulp.dest('./dist'));
};

function watch() {
  b = watchify(bundler);
  b.on('error', gutil.log.bind(gutil, 'Browserify Error'))
  b.on('update', bundle);

  return bundle();
};


gulp.task('sprite', function () {
  return gulp.src('./src/images/icons/**/*.png')
    .pipe(sprite({
      base64: true,
      prefix: 'b-embd-icon',
      style: 'sprite.css'
      // processor: 'scss'
    }))
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('css', ['sprite'], function() {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('Charts.css'))
    .pipe(gulp.dest('./dist'));
});



gulp.task('s', function() {
  gulp.src('./')
    .pipe(webserver({
      directoryListing: true
    }));
});

gulp.task('js', bundle);
gulp.task('build', ['css', 'js']);
gulp.task('default', ['build']);
