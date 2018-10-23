var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');

sass.compiler = require('node-sass');

gulp.task('default',['views','sass','typescript'], function(){

});

gulp.task('typescript', function () {
    return gulp.src('js/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'main.js'
        }))
        .pipe(gulp.dest('js'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('./*.pug')
  .pipe(pug({
    doctype: 'html',
    pretty: true
  })).pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css'));
});