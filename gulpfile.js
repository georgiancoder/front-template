var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var gulpSequence = require('gulp-sequence');
var fs = require('fs');

sass.compiler = require('node-sass');

gulp.task('default', ['typescript', 'sass', 'views'], function() {
    gulp.watch('./css/*.scss', function() {
        gulp.run('sass');
        gulp.run('views');
    });
    gulp.watch('./*.pug', function() {
        gulp.run('views');
    });
    gulp.watch('js/*.ts', function() {
        gulp.run('typescript');
        gulp.run('views');
    })
});

gulp.task('typescript', function() {
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
        })).pipe(gulp.dest('./'))
        .on('end',function(){
            Inject();
        });
});

gulp.task('sass', function() {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./css'));
});


function Inject() {
    let cssFiles = [];
    let jsFiles = [];
    let filesCss = fs.readdirSync('./css');
    filesCss.forEach(item => {
        if (/\.css$/gi.test(item)) {
            cssFiles.push(`css/${item}`);
        }
    });
    InjectFiles('css', cssFiles);
    let filesJs = fs.readdirSync('./js');
    filesJs.forEach(item => {
        if (/\.js$/gi.test(item)) {
            jsFiles.push(`js/${item}`);
        }
    });
    InjectFiles('js', jsFiles);
}

function InjectFiles(type, files) {
    let replaceStr = '';
    files.forEach(file => {
        if (type === 'css') {
            replaceStr += `<link rel="stylesheet" href="${file}">\n`;
        } else if (type === 'js') {
            replaceStr += `<script src="${file}"></script>\n`;
        } else {
            //nothig to replace
        }
    });
    let filesHtml = fs.readdirSync('./');

    let htmlFiles = [];
    filesHtml.forEach(item => {
        if (/\.html$/gi.test(item)) {
            htmlFiles.push(`${item}`);
        }
    });
    htmlFiles.forEach(html => {
        let htmlContent = fs.readFileSync(html, 'utf8');
        var result = '';
        switch (type) {
            case 'css':
                result = htmlContent.replace(/<!-- replace:css -->/g, replaceStr);
                break;
            case 'js':
                result = htmlContent.replace(/<!-- replace:js -->/g, replaceStr);
                break;
            default:
                result = '';
                break;
        }


        fs.writeFileSync(html, result, 'utf8');
    });
}