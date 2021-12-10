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
          .pipe(gulp.dest('./'));
}

function iWebp() {
  return gulp.src('./img/dummy/**/*.png')
          .pipe(webp())
          .pipe(gulp.dest('./img/dummy'));
}

function iAvif() {
  return gulp.src('./img/dummy/**/*.png')
          .pipe(avif())
          .pipe(gulp.dest('./img/dummy'));
}

function compileLess() {
  return gulp.src("./less/**/*.less")
          .pipe(less())
          .pipe(concat("style.css"))
          .pipe(gulp.dest("./dist"));
}

function watcher(done) {
  watch(["./less/**/*.less"], parallel(compileLess));
  watch(["./templates/**/*.html"], parallel(compileNjs));
  watch(["./img/dummy/*.png"], parallel(iWebp, iAvif));

  done();
}

function dev(done) {
  browserSync.init({
    open: 'external',
    server: {
      baseDir: "./",
    },
  });

  watch(["./*.html", "./**/*.css"]).on("change", reload);
  done();
};

exports.img = parallel(iWebp, iAvif);
exports.serve = series(parallel(compileNjs, compileLess, iWebp, iAvif), dev, watcher);