// This is the last version of the gulp file before the production ENV updates were made
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee']
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];

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
    .pipe(connect.reload())
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
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']); // when something changes in the coffeeSources, then execute 'coffee'
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'builds/development/', // this tells it where the root of the site to load
    livereload: true // need to add the "reload()" method by piping it at the end of the js and compass task
  });
})

gulp.task('html', function() {
    gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json', function() {
    gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']); // naming this default allows you to simple run "gulp" in the terminal, rather than running each one as "gulp js, gulp-coffee", etc

// test log
// gulp.task('log', function() {
//   gutil.log('Workflows are awesome');
// })
