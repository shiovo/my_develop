// @file gulpfile.js
var gulp = require('gulp');
var runSequence = require('run-sequence');
//var sass = require('gulp-sass');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var connectSSI = require('connect-ssi');
var clean = require('gulp-clean');
var open = require('gulp-open');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');

//--------------------------
// setting
var HOST = (function () {
          var os=require('os');
          var ifaces=os.networkInterfaces();
          var dev, i, l, details;
          for (dev in ifaces) {
            for (i=0,l=ifaces[dev].length;i<l;i++) {
              details = ifaces[dev][i];
              if (details.family === 'IPv4') {
                if (details.address.match(/^192\.168\.1\./)) {
                  return details.address;
                }
              }
            }
          }
          return 'localhost';
        })();

var PORT = 8000;
//--------------------------


gulp.task("sass", function() {
    return sass("src/sass/", {
          require:'./src/sass/_foundation/color.rb',
          style: 'expanded'
        })
        .pipe(gulp.dest('tmp/css/'));
});

// gulp.task("sass", function() {
//     return gulp.src("src/sass/**/*scss")
//         // .pipe(sass())
//         .pipe(plumber({
//           errorHandler: notify.onError('<%- error.__safety || error %>')
//         }))
//         .pipe(sass({  // sass のコンパイルの実行
//           r: 'sass-globbing', // sass-globbing 利用オプション
//           'sourcemap=none': true // ソースマップを生成しない
//         }))

//         .pipe(gulp.dest("tmp/"));
// });

//ローカルサーバー
gulp.task('connectDev',function(){
  connect.server({
    root: ['src', 'tmp'],   //ルートディレクトリ
    host: HOST,
    port: PORT,     //ポート番号
    livereload: true,
    middleware: function () {
      return [connectSSI({
        baseDir: __dirname + '/src',
        ext: '.html'
      })];
    }
  });
});

gulp.task('open', function () {
  gulp.src('src/index.html').pipe(open("", {
    url: 'http://' + HOST + ':' + PORT
  }));
});
 
//htmlタスク
gulp.task('reload',function(){
  return gulp.src('src/**/*.html') //実行するファイル
    .pipe(connect.reload());  //ブラウザの更新
});

gulp.task('clean-tmp', function () {
  return gulp.src('tmp').pipe(clean());
});

gulp.task('clean-dist', function () {
  return gulp.src('dist').pipe(clean());
});

gulp.task('imagemin', function () {
  return gulp.src(['src/images/**/*.*'])
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copy-all', function () {
  gulp.src([
    'src/**/*.*',
    'tmp/**/*.*',
    '!src/sass/**/*.*',
    '!src/images/**/*.*'
  ]).pipe(gulp.dest('dist/'));
});
 
//ファイルの監視
gulp.task('watch',function(){
  gulp.watch(['src/**/*.html'],['reload']);    //htmlファイルを監視
  gulp.watch(['src/sass/**/*.scss'],['sass']); //scssファイルを監視
  gulp.watch(['tmp/**/*.css'],['reload']);       //cssファイルを監視
  gulp.watch(['src/js/**/*.js'],['reload']); //jsファイルを監視
});
 
gulp.task('default', function (cb) {
  runSequence('clean-tmp', 'sass', ['watch','connectDev'], 'open', cb);
});
gulp.task('build', function (cb) {
  runSequence('clean-tmp', 'clean-dist', 'sass', ['copy-all', 'imagemin'], cb);
});