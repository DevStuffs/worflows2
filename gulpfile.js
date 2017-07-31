var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee']
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('scripts.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded',
      comments:true
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('builds/development/css'))
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']); // when something changes in the coffeeSources, then execute 'coffee'
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'watch']); // naming this default allows you to simple run "gulp" in the terminal, rather than running each one as "gulp js, gulp-coffee", etc
// test log
// gulp.task('log', function() {
//   gutil.log('Workflows are awesome');
// })
