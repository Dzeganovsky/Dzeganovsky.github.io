const gulp = require("gulp");
const { parallel, series, watch } = require("gulp");
const less = require("gulp-less");
const concat = require("gulp-concat");
const browserSync  = require('browser-sync').create();
const reload = browserSync.reload;
const nunjucks = require('gulp-nunjucks');
const avif = require('gulp-avif');
const webp = require('gulp-webp');

function compileNjs() {
  return gulp.src('./templates/*.html')
          .pipe(nunjucks.compile())
          .pipe(gulp.dest('./dist'));
}

function images() {
  return gulp.src('./img/**/*.png')
          .pipe(gulp.dest('./dist/img'))
          .pipe(webp())
          .pipe(gulp.dest('./dist/img'));
}

function copySVG() {
  return gulp.src('./img/**/*.svg')
          .pipe(gulp.dest('./dist/img'));
}

function compileLess() {
  return gulp.src("./less/**/*.less")
          .pipe(less())
          .pipe(concat("style.css"))
          .pipe(gulp.dest("./dist/css"));
}

function watcher(done) {
  watch(["./less/**/*.less"], parallel(compileLess));
  watch(["./templates/**/*.html"], parallel(compileNjs));
  watch(["./img/**/*.png"], parallel(images));
  watch(["./img/**/*.svg"], parallel(copySVG));

  done();
}

function dev(done) {
  browserSync.init({
    open: 'external',
    server: {
      baseDir: "./",
    },
  });

  watch(["./dist/*.html", "./dist/**/*.css"]).on("change", reload);
  done();
};

exports.img = parallel(copySVG, images);
exports.build = parallel(compileNjs, compileLess, copySVG, images);
exports.serve = series(parallel(compileNjs, compileLess, copySVG, images), dev, watcher);