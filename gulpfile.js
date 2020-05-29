var gulp = require("gulp");
var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var fileinclude = require("gulp-file-include");
var imagemin = require("gulp-imagemin");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

//ftp
var gutil = require("gulp-util");
var ftp = require("vinyl-ftp");

gulp.task("hello", function () {
  //do
  console.log("hello world 你好");
});

//複製
gulp.task("move", function () {
  //do
  return gulp
    .src("./dev/*.html") //來源
    .pipe(gulp.dest("dest/")); //目的地
});

// 壓縮css
gulp.task("minicss", function () {
  //do
  return gulp
    .src("css/*.css") //來源
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dest/css")); //目的地
});

//合併 css
gulp.task("concat", ["sass"], function () {
  //do
  return gulp
    .src("css/*.css") //來源
    .pipe(concat("all.css")) //合併
    .pipe(cleanCSS({ compatibility: "ie8" })) //壓縮
    .pipe(gulp.dest("dest/css")); //目的地
});

// sass 轉譯
gulp.task("sass", function () {
  return gulp
    .src("./dev/sass/*.scss") //來源
    .pipe(sass().on("error", sass.logError)) //sass轉譯
    .pipe(gulp.dest("./dest/css")); //目的地
});

// watch sass轉譯 & copy html
gulp.task("watch_sass_copyHtml", function () {
  gulp.watch("./dev/sass/*.scss", ["sass"]);
  gulp.watch("./dev/*.html", ["move"]);
});

// html 樣板
gulp.task("fileinclude", function () {
  gulp
    .src(["./dev/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./dest"));
});

// 壓圖
gulp.task("miniimg", function () {
  gulp.src("./dev/images/*").pipe(imagemin()).pipe(gulp.dest("dest/images"));
});

//同步
gulp.task("default", function () {
  browserSync.init({
    server: {
      baseDir: "./dest",
      index: "index.html",
    },
  });
  gulp.watch("./dev/sass/*.scss", ["sass"]).on("change", reload);
  gulp
    .watch(["./dev/*.html", "./dev/**/*.html"], ["fileinclude"])
    .on("change", reload);
});

//ftp

gulp.task("ftp", function () {
  var conn = ftp.create({
    host: "140.115.236.71",
    user: "%ed101+",
    password: "!654=stu&",
    parallel: 10,
  });

  var globs = ["dest/**"];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp
    .src(globs, { base: ".", buffer: false })
    .pipe(conn.newer("/public_html")) // only upload newer files
    .pipe(conn.dest("/public_html"));
});
