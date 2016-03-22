var coffee = require('gulp-coffee'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint');

var production = false;

// Task to set production to true
gulp.task('setprod', function(done) {
  production = true;
  done();
});

// Copy assets (fonts, images, videos, sounds, etc)
gulp.task('assets', function() {
  gulp.src('app/index.html').pipe(gulp.dest('dist'));
  gulp.src('app/favicon.ico').pipe(gulp.dest('dist'));
  return gulp.src('app/assets/**')
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.stream());
});

gulp.task('coffee', function(){
  gulp.src('./app/coffee/**/*.coffee')
    .pipe(coffee({ bare: true }).on('error', gutil.log ))
    .pipe(gulp.dest('./app/scripts/'));
})

// Compile Javascript
gulp.task('scripts', function() {
  return browserify({
      'debug': production ? false : true
    })
    .transform(stringify({
      extensions: ['.html'],
      minify: true
    }))
    .add('app/scripts/main.js')
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    // .pipe(buffer())
    // .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.stream());
});

// JSHint, run this occassionally to keep code clean and correct
gulp.task('lint', function() {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(jshint({
      curly: true,
      eqeqeq: true,
      forin: true,
      freeze: true,
      futurehostile: true,
      globals: {
        window: true,
        require: true,
        module: true,
        exports: true
      },
      latedef: true,
      noarg: true,
      nonbsp: true,
      nonew: true,
      strict: "global",
      undef: true,
      unused: true,

      eqnull: true,
      browser: true,
      browserify: true
    }))
    .pipe(jshint.reporter('default'));
});

// Compile Sass
gulp.task('styles', function() {
  return gulp.src('app/sass/*.sass')
    .pipe(sass())
    .pipe(cssnano({
      autoprefixer: {
        add: true,
        browsers: [
          '> 5%', 
          'Explorer >= 11', 
          'Chrome >= 48',
          'Safari >= 8',
          'Firefox >= 44',
          'iOS >= 9',
          'Android >= 4.4'
        ]
      }
    }))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

// Run server and watch for changes
gulp.task('serve', ['default'], function() {
  browserSync.init({
    server: './dist'
  });
  gulp.watch('app/assets/**', ['assets']);
  gulp.watch('app/sass/**/*.sass', ['styles']);
  gulp.watch('app/coffee/**/*.coffee', ['coffee','scripts']);
  gulp.watch('app/*.html', ['assets']).on('change', browserSync.reload);
});

gulp.task('default', [
  'assets',
  'coffee',
  'scripts',
  'styles'
]);

// Alias of serve
gulp.task('start', ['serve']);

// Production build
gulp.task('build', ['setprod', 'default']);