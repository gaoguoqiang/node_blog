/**
 * Created by hasee-pc on 2016/11/16.
 */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
//自动刷新浏览器
gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "127.0.0.1:8081"
    });
    //当<html>文件更改时重载页面
    gulp.watch('views/*/*.html').on('change', browserSync.reload);
    gulp.watch('public/js/*.js').on('change', browserSync.reload);
});
//编译less
gulp.task('less', function () {
    gulp.src('public/less/main.less')
        .pipe(less())
        .pipe(gulp.dest('public/css'))
        //当css文件更改时把css样式注入到页面
        .pipe(browserSync.reload({
            stream: true
        }))
});
//压缩js代码
gulp.task('jsmin', function () {
    gulp.src('public/old/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
});
gulp.task('watch', ['browserSync', 'less', 'jsmin'], function () {
    gulp.watch('public/less/main.less', ['less']);
    gulp.watch('public/old/*.js', ['jsmin']);
    gulp.watch('views/*/*.html', browserSync.reload);
});