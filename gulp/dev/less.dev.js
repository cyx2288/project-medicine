/**
 * Created by Qiaodan on 2017/5/19.
 */
/**样式翻译合并
 * 开发*/

var gulp = require('gulp'),

    less = require('gulp-less'),//less解码

    autoprefixer = require('gulp-autoprefixer'),//css兼容性

    concatDir = require('gulp-concat-dir'),//按文件夹合并

    concat = require("gulp-concat"),//文件合并

    connect = require('gulp-connect'),//服务器

    rename = require("gulp-rename");//重命名

function devLess(){
    gulp.src(['src/css/**/*.css'])

        .pipe(gulp.dest('build/css')) //将会在build/css下生成相应的.css

        .pipe(connect.reload());

}


module.exports = devLess;