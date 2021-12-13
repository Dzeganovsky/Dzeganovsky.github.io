const gulp = require("gulp");
const { parallel, series, watch } = require("gulp");
const less = require("gulp-less");
const concat = require("gulp-concat");
const browserSync  = require('browser-sync').create();
const reload = browserSync.reload;
const nunjucks = require('gulp-nunjucks');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const clean = require('gulp-clean');
 
function cleanDist() {
    return gulp.src('./dist', {read: false})
        .pipe(clean({
          force: true
        }));
};

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

function copyJs() {
  return gulp.src('./js/*.js')
          .pipe(gulp.dest('./dist/js'));
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
exports.build = series(cleanDist,parallel(compileNjs, compileLess, copyJs, copySVG, images));
exports.serve = series(cleanDist, parallel(compileNjs, compileLess, copyJs, copySVG, images), dev, watcher);