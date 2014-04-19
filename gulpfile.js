var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    minifyCSS = require('gulp-minify-css');

gulp.task('jshint', function () {
    gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('uglify', function () {
     gulp.src('src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('minify', function () {
    gulp.src('src/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['uglify', 'minify'], function () {

});

gulp.task('cp', function () {
    gulp.src('src/**/*.js')
        .pipe(gulp.dest('dist/'));

    gulp.src('src/**/*.css')
        .pipe(gulp.dest('dist/'));
});

gulp.task('dev', ['cp'], function () {
    gulp.watch('src/**/*.*', ['cp', 'jshint']);
});