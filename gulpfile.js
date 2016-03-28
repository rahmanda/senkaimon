var gulp        = require("gulp");
var sass        = require("gulp-sass");
var pug         = require("gulp-jade");
var cssnano     = require("gulp-cssnano");
var rename      = require("gulp-rename");
var source      = require("vinyl-source-stream");
var browserify  = require("browserify");

var SRC_PATH  = "src";
var DIST_PATH = "dist";

var PATH = {
  style: {
    src   : SRC_PATH  + "/sass/**/*.scss",
    build : DIST_PATH
  },
  script: {
    src   : SRC_PATH  + "/app.js",
    main  : SRC_PATH  + "/app.js",
    build : DIST_PATH
  },
  view: {
    src   : SRC_PATH  + "/view/**/*.jade",
    main  : SRC_PATH  + "/view/popup.jade",
    build : DIST_PATH
  },
  img: {    src   : SRC_PATH  + "/img/**/*.{jpg,jpeg,png,gif}",
    build : DIST_PATH + "/img"
  },
  manifest: SRC_PATH  + "/manifest.json"
};

// Static server + watching asset files
gulp.task('serve', ['sass', 'build-js'], function () {
  gulp.watch(PATH.style.src  , ['sass']);
  gulp.watch(PATH.script.src , ['build-js']);
  gulp.watch(PATH.view.src   , ['view']    );
  gulp.watch(PATH.manifest   , ['manifest']);
  gulp.watch(PATH.img.src    , ['images']  );
});

gulp.task('manifest', function() {
  return gulp.src(PATH.manifest)
         .pipe(gulp.dest(DIST_PATH));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(PATH.style.src)
         .pipe(sass())
         .pipe(cssnano())
         .pipe(rename('style.css'))
         .pipe(gulp.dest(PATH.style.build));
});

// Compile pug into html
gulp.task('view', function() {
  return gulp.src(PATH.view.main)
         .pipe(pug({ filename: "popup" }))
         .pipe(gulp.dest(PATH.view.build));
});

gulp.task('images', function() {
  return gulp.src(PATH.img.src)
         .pipe(gulp.dest(PATH.img.build));
});

// Compile js into one file
gulp.task('build-js', function() {
  return browserify({ entries: [PATH.script.main]  })
         .bundle()
         .pipe(source('app.min.js'))
         .pipe(gulp.dest(PATH.script.build));
});

gulp.task('default', ['serve']);