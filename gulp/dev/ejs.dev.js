/**
 * Created by Qiaodan on 2017/5/19.
 */


var gulp = require('gulp'),

    ejs = require('gulp-ejs'),//ejs模板

    cheerio = require('gulp-cheerio'),//批量更换html中的引用

    connect = require('gulp-connect'),//服务器

    rename = require("gulp-rename");//重命名

var bom = require('gulp-bom');//解决UTF-8文件是采用无BOM

function devEjs(){
    gulp.src('src/html/**/*.html')

        //增加媒体查询，通用样式文件
        .pipe(cheerio({

            parserOptions: {
                // Options here
                decodeEntities: false
            }

        }))

        .pipe(gulp.dest('build/html'))//输出到bulid文件夹

        .pipe(bom())//不乱码

        .pipe(connect.reload())



}

module.exports=devEjs;
