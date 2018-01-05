/**
 * Created by Administrator on 2018/1/4.
 */

var gulp = require('gulp'),

    runSequence = require('run-sequence'),//顺序执行

    rev = require('gulp-rev'),//文件指纹

    htmlMin = require('gulp-htmlmin'),

    uglify = require('gulp-uglify'),

    revCollector = require('gulp-rev-collector');//html换链接


var clean = require('gulp-clean');

var chinese2unicode = require('fd-gulp-chinese2unicode');//中文2Unicode



//删除旧的文件
gulp.task("clean", function(){

    return gulp.src('dist')

        .pipe(clean());

})

//删除旧的文件
gulp.task("clean-rev", function(){

    return gulp.src('rev')

        .pipe(clean());

})


//平移不需要加文件指纹的文件
gulp.task('imageMove',function () {

    return gulp.src(['build/**/*.{png,jpg,jpeg,gif,json}'])

        .pipe(gulp.dest('dist'))

});



gulp.task('revJs', function(){

    return gulp.src(['build/js/**/*.js'])

        //.pipe(chinese2unicode())

        .pipe(uglify())

        .pipe(rev())//加指纹

        .pipe(gulp.dest('dist/js'))//在bulid/js下生成文件

        .pipe(rev.manifest())//生成对应文件

        .pipe(gulp.dest('rev/js'));//对应文件放置地址

});

gulp.task('revCss', function(){

    return gulp.src('build/css/**/*.css')

        //.pipe(chinese2unicode())

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

//精简html文档
gulp.task('htmlMin', function () {

    return gulp.src('dist/html/**/*.html')

        //.pipe(chinese2unicode())

        .pipe(htmlMin({

            removeComments: true,//清除HTML注释

            collapseWhitespace: true,//压缩HTML

            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />

            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />

            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"

            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"

            minifyJS: true,//压缩页面JS

            minifyCSS: true//压缩页面CSS

        }))

        .pipe(gulp.dest('dist/html'));

});


function allHash(done) {

    //condition = false;
    //依次顺序执行
    runSequence(

        //['clean-rev'],

        ['clean'],

        ['imageMove'],

        ['revCss'],

        ['revHtmlCss'],

        ['revJs'],

        ['revHtmlJs'],

        //['htmlMin'],

        done);

}


module.exports = allHash;