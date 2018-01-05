/**
 * Created by Administrator on 2018/1/4.
 */

var gulp = require('gulp'),

    runSequence = require('run-sequence'),//顺序执行

    rev = require('gulp-rev'),//文件指纹

    revCollector = require('gulp-rev-collector');//html换链接


gulp.task('imageMove',function () {

    return gulp.src(['build/**/*.{png,jpg,jpeg,gif}'])

        .pipe(gulp.dest('dist'))

});

gulp.task('revJs', function(){

    return gulp.src(['build/js/**/*.js'])

        .pipe(rev())

        .pipe(gulp.dest('dist/js'))//在bulid/js下生成文件

        .pipe(rev.manifest())

        .pipe(gulp.dest('rev/js'));

});

gulp.task('revCss', function(){

    return gulp.src('build/css/**/*.css')

        .pipe(rev())

        .pipe(gulp.dest('dist/css'))//在bulid/js下生成文件

        .pipe(rev.manifest())

        .pipe(gulp.dest('rev/css'));

});

gulp.task('revHtmlCss', function () {
    return gulp.src(['rev/css/*.json','build/html/**/*.html'])
        .pipe(revCollector())                         //替换html中对应的记录
        .pipe(gulp.dest('dist/html'));                     //输出到该文件夹中
});


gulp.task('revHtmlJs', function () {
    gulp.src(['rev/js/*.json','dist/html/**/*.html'])
        .pipe(revCollector())                         //替换html中对应的记录
        .pipe(gulp.dest('dist/html'));                     //输出到该文件夹中


});

function allHash(done) {

    //condition = false;
    //依次顺序执行
    runSequence(

        ['imageMove'],

        ['revCss'],

        ['revHtmlCss'],

        ['revJs'],

        ['revHtmlJs'],

        done);

}


module.exports = allHash;