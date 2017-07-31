var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle,
    sassComments

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
  sassComments = true;
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
  sassComments = false;
}

coffeeSources = ['components/coffee/tagline.coffee']
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
    .pipe(gulpif(env ==='production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle, // compressed or expanded
      comments: sassComments //line number and file name
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']); // when something changes in the coffeeSources, then execute 'coffee'
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir, // this tells it where the root of the site to load
    livereload: true // need to add the "reload()" method by piping it at the end of the js and compass task
  });
});

gulp.task('html', function() {
    gulp.src('builds/development/*.html')
    .pipe(gulpif(env ==='production', minifyHTML()))
    .pipe(gulpif(env ==='production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('json', function() {
    gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']); // naming this default allows you to simple run "gulp" in the terminal,
                                                                                       // rather than running each one as "gulp js, gulp-coffee", etc

// test log
// gulp.task('log', function() {
//   gutil.log('Workflows are awesome');
// })
