var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

gulp.task('scripts', function(){
    return gulp.src('public/javascripts/*.js')
        .pipe(gulp.dest('public/javascripts'))
        .pipe(gp_rename('uglify.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('public/javascripts/compressed'))
});