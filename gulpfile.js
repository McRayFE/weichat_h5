var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    contentIncluder = require('gulp-content-includer'),
    order = require('gulp-order'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group = require('gulp-group-files'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();




var sassFiles = {
     "page":{
       src: "css/css/page_scss.scss",
       dest:"css/css"
     }
};

gulp.task('sass',function(){
    return group(sassFiles,function(key,fileset){
           return gulp.src(fileset.src)
                      .pipe(sass().on('eroor',sass.logError))
                      .pipe(gulp.dest(fileset.dest));
    })();
});

gulp.task('styles',function(){
    return gulp.src('css/css/*.css')
               .pipe(autoprefixer(
                 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
               ))
               .pipe(order([
                 "weui.min.css",
                 "public_scss.css",
                 "page_scss.css"
               ]))
               .pipe(concat('main.css'))
               .pipe(gulp.dest('dist/style'))
               .pipe(rename({suffix:'.min'}))
               .pipe(minifycss())
               .pipe(gulp.dest('dist/style'))
               .pipe(notify({message:'style done'}));
});
gulp.task('js',function(){
    return gulp.src('js/javascript/*.js')
               .pipe(order([
                 "jquery-3.2.1.min.js",
                 "zepto.min.js",
                 "weui.min.js"
               ]))
               .pipe(concat('main.js'))
               .pipe(gulp.dest('dist/js'))
               .pipe(rename({suffix:'.min'}))
               .pipe(uglify())
               .pipe(gulp.dest('dist/js'))
               .pipe(notify({message:'js done'}));
});

gulp.task('image',function(){
  return gulp.src('image/icon/*.png')
             .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
             .pipe(gulp.dest('dist/img'))
             .pipe(notify({message:'image done'}));
});

gulp.task('concat',function(){
    return gulp.src('html/mycenter.html')
               .pipe(contentIncluder({
                 includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
               }))
               .pipe(gulp.dest('html'));
});

gulp.task('concat1',function(){
    return gulp.src('html/gift_list.html')
               .pipe(contentIncluder({
                 includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
               }))
               .pipe(gulp.dest('html'));
});

gulp.task('clean',function(){
  return gulp.src(['dist/css','dist/js','dist/img'],{read:false})
             .pipe(clean());
})

gulp.task('default',['clean'],function(){
  gulp.start('styles','js','image',"concat","concat1");
})
