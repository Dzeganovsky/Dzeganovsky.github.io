const gulp = require("gulp");
const { parallel, series, watch } = require("gulp");
const less = require("gulp-less");
const concat = require("gulp-concat");
const browserSync  = require('browser-sync').create();
const reload = browserSync.reload;

function compileLess() {
  return gulp.src("./less/**/*.less").pipe(less()).pipe(concat("style.css")).pipe(gulp.dest("./dist"));
}

function watcher(done) {
  watch(["./less/**/*.less"], parallel(compileLess));

  done();
}

function dev(done) {
  browserSync.init({
    open: 'external',
    server: {
      baseDir: "./",
    },
  });

  watch(["./**/*.html", "./**/*.css"]).on("change", reload);
  done();
};

exports.serve = series(compileLess, dev, watcher);