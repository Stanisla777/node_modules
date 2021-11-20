const gulp = require('gulp');
const autopref = require('gulp-autoprefixer');
const sync = require('browser-sync'); // Подключаем Browser Sync
const prepless = require('gulp-less');//преобразует less в css
const cssmin = require('gulp-clean-css');
const renamed = require('gulp-rename');//преобразует файлы в min
const svgsprite = require('gulp-svg-sprite');
const include = require('gulp-file-include');
const del = require('del')//удалять файлы
const htmlmin = require('gulp-htmlmin')//минифицировать html
const jsmin = require('gulp-jsmin')//минифицировать js
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');//оптимизировать изображение
const imgCompress  = require('imagemin-jpeg-recompress');
const webp  = require('gulp-webp');
const webhtml  = require('gulp-webp-html');
const ttfwolf  = require('gulp-ttf2woff');
const ttfwolf2  = require('gulp-ttf2woff2');
const ttfeot  = require('gulp-ttf2eot');
const ttfsvg  = require('gulp-ttf-svg');
const gcmq = require('gulp-group-css-media-queries');
const htmlreplace = require('gulp-html-replace');
const strip = require('gulp-strip-comments');

const replace = require('gulp-replace');

//Переменные
const fs = require('fs')
const project_folder = require('path').basename(__dirname)

function replacehtml() {
  return gulp.src('dist/**.html')
    .pipe(htmlreplace({
      'css': ['./css/style.min.css','./css/media.min.css'],
      'js':'./js/app.min.js'

    }))
    .pipe(gulp.dest('dist'))
}
exports.replacehtml = replacehtml

function media_group() {
  return gulp.src('dist/css/style.css')
    .pipe(gcmq())
    .pipe(gulp.dest('mist/css/style.css'));
}
exports.media_group = media_group

//Собираем index.html из разных файлов или просто копируем все html в папку dist
function html() {
  return gulp.src('src/**.html')
    .pipe(include({
      prefix:'@@'
    }))
    // .pipe(webhtml()) //по необходимости, е нужно подставлять img.webp
    .pipe(htmlmin({

      //если collapse стоит без preserve, то будет минифицированный html, а если с,то без лишних переносов и пробелов в началн строк
      collapseWhitespace:true,//сдлелали html.min
      preserveLineBreaks:true//убрали просто пробелы
    }))
    .pipe(gulp.dest('dist'))
}
exports.html = html

function html_for_prod() {
  return gulp.src('src/**.html')
    .pipe(include({
      prefix:'@@'
    }))
    // .pipe(webhtml()) //по необходимости, е нужно подставлять img.webp
    .pipe(htmlmin({

      //если collapse стоит без preserve, то будет минифицированный html, а если с,то без лишних переносов и пробелов в началн строк
      collapseWhitespace:true,//сдлелали html.min
      // preserveLineBreaks:true//убрали просто пробелы
    }))
    .pipe(gulp.dest('dist'))
}
exports.html_for_prod = html_for_prod

//Собираем js из разных файлов или просто копируем все js в папку dist
function js() {
  return gulp.src('src/js/app.js')
    .pipe(include({
      prefix:'@@'
    }))
    .pipe(babel({
        presets: ['@babel/env']
      }
    ))
    .pipe(strip())

    // если нужно будет минифицировать app.js, чтобы убрать лишние пробелы,
    // а поом снова сделать обычный js
    // .pipe(jsmin())
    .pipe(gulp.dest('dist/js'))
}
exports.js = js

function js_prod() {
  return gulp.src('src/js/app.js')
    .pipe(include({
      prefix:'@@'
    }))
    .pipe(babel({
        presets: ['@babel/env']
      }
    ))
    .pipe(strip())
    // ниже если нужно будет деает min.js
    .pipe(gulp.dest('dist/js'))
    .pipe(jsmin())
    .pipe(renamed({extname: '.min.js'}))
    .pipe(gulp.dest('dist/js'))
}
exports.js = js

//Просто копирум js файлы
function jsCopy() {
  gulp.src(['src/js/plugins/*.js'])
    .pipe(gulp.dest('dist/js'))
  return gulp.src(['src/js/**.js','!src/js/app.js'])
    .pipe(gulp.dest('dist/js'))
}
exports.jsCopy = jsCopy

//Копируем все файлы из корня папки src

function fileCopy() {
  return gulp.src(['src/**.html','src/**.php','src/**.json','src/**.css'])
    .pipe(gulp.dest('dist'))
}
exports.fileCopy = fileCopy


//Собираем единый css из нескольких файлов

function allcss() {
  gulp.src(['src/css/**', '!src/css/**.less'])
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .pipe(renamed({extname: '.min.css'}))
    .pipe(gulp.dest('dist/css'))
  return gulp.src('src/css/style.less')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(prepless())
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))

    .pipe(gcmq())
    // .pipe(webcss())//по необходимости, если нужно подставлять в css img.webp
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .pipe(renamed({extname: '.min.css'}))
    .pipe(gulp.dest('dist/css'))

}

//преобразуем less в css для разработки и build
function less() {
  //переносим файлы css из папки partcss
  gulp.src(['src/partcss/**', '!src/partcss/**.less'])
    .pipe(gulp.dest('dist/css'))
  //переносим файлы css из папки css
  gulp.src(['src/css/**', '!src/css/**.less'])
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
  return gulp.src('src/css/style.less')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(prepless())
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gcmq())
    .pipe(replace('../partcss/', '../css/'))
    // .pipe(webcss())//по необходимости, если нужно подставлять в css img.webp
    .pipe(gulp.dest('dist/css'))
}
exports.less = less

//преобразуем less в css для build
function less_for_build() {
  //переносим файлы css из папки partcss
  gulp.src(['src/partcss/**', '!src/partcss/**.less'])
    .pipe(gulp.dest('dist/css'))
  //переносим файлы css из папки css
  gulp.src(['src/css/**', '!src/css/**.less'])
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    // ниже если нужно будет делать минифицированным например media.css, чтобы урать лишни е пробелы и пустые строки
    //а птопом оратно сделать обычным css
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
  return gulp.src('src/css/style.less')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(prepless())
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gcmq())
    .pipe(replace('../partcss/', '../css/'))
    // .pipe(webcss())//по необходимости, если нужно подставлять в css img.webp
    .pipe(gulp.dest('dist/css'))
  // ниже если нужно будет деает style.css
  // .pipe(cssmin())
  // .pipe(renamed({extname: '.min.css'}))
  // .pipe(gulp.dest('dist/css'))
}
exports.less_for_build = less_for_build


///преобразуем less в css для продакшен,где создаются отдельные css
function separatecss() {
  //переносим файлы css из папки partcss
  gulp.src(['src/partcss/**', '!src/partcss/**.less'])
    .pipe(gulp.dest('dist/css'))

//файлы less в папке partcss преобразуем в css и по отдельности переносим в продакшен
  gulp.src('src/partcss/**.less')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(prepless())
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))


  //переносим файлф css из папки css
  gulp.src(['src/css/**', '!src/css/**.less'])
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
  return gulp.src('src/css/style.less')

    //в файл style.less меняем в подключении @import url("../partcss/bread_crumbst.less");
    // на @import url("../partcss/bread_crumbst_t.less");
    //соответственно файлы less, кторые должны отдельно попадать в продакщен скомпилированные в css
    //должны заканчиваться на _t
    .pipe(replace('.less', '.css'))
    .pipe(replace('mixin.css', 'mixin.less'))

    .pipe(include({
      prefix: '@@'
    }))
    .pipe(prepless())
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gcmq())
    .pipe(replace('../partcss/', '../css/'))
    // .pipe(webcss())//по необходимости, если нужно подставлять в css img.webp
    .pipe(gulp.dest('dist/css'))
  // ниже если нужно будет деает style.css
  // .pipe(cssmin())
  // .pipe(renamed({extname: '.min.css'}))
  // .pipe(gulp.dest('dist/css'))
}
exports.separatecss = separatecss

// Добавление префиксов в css при перемещение
function media_css() {
  return gulp.src('src/css/media.css')
    .pipe(autopref({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
}
exports.media_css = media_css

//Конвертация шрифтов
function convertFont() {
  gulp.src('src/fonts/**/**.ttf')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(ttfwolf())
    .pipe(gulp.dest('src/fonts'))
    .pipe(gulp.dest('dist/fonts'))
  gulp.src('src/fonts/**/**.ttf')
    .pipe(ttfwolf2())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('src/fonts'))
  gulp.src('src/fonts/**/**.ttf')
    .pipe(ttfsvg())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('src/fonts'))
  return gulp.src('src/fonts/**/**.ttf')
    .pipe(ttfeot())
    .pipe(gulp.dest('src/fonts'))
    .pipe(gulp.dest('dist/fonts'))
}
exports.convertFont = convertFont

//копирование и оптимизация картинок
function img() {
  return gulp.src('src/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp,mp4,ogv,webm}')
    .pipe(gulp.dest('dist/img'))
}
exports.img = img

//Удаляем папки svgicon в src и dist
function delSvgIconSrc() {
  return del('src/img/svgicon/sprite.svg')
}
exports.delSvgIconSrc=delSvgIconSrc

function delSvgIconDist() {
  return del('dist/img/svgicon')
}
exports.delSvgIconDist=delSvgIconDist

//Создаем спрайт из svg
function createSprite() {
  return gulp.src('src/img/svgicon/*.svg')
    .pipe(svgsprite({
        shape: {
          dimension: { // Set maximum dimensions
            // maxWidth: 200,
            // maxHeight: 200
          },
          spacing: { // Add padding
            // padding: 5
          }
        },
        mode: {
          stack: {
            sprite: "../sprite.svg"  //sprite file name
          }
        },
      }
    ))
    .pipe(gulp.dest('src/img/svgicon'))
    .pipe(gulp.dest('dist/img/svgicon'))
}
exports.svgSprire = gulp.series(delSvgIconSrc,delSvgIconDist,createSprite)

//очищать папку dist
function clear() {
  return del('dist')
}
exports.clear=clear

//Картинки преобразуем в формат webp

function imgwebp() {
  return gulp.src('src/img/**.{jpg,jpeg,png}')
    .pipe(gulp.dest('dist/img'))
    .pipe(webp({
      quality:70
    }))
    .pipe(gulp.dest('dist/img'))
}
exports.imgwebp=imgwebp

//перезагрузка страницы при изменении в html или css
function serve() {
  sync.init({
    server:'./dist'
  })
  gulp.watch('src/partsHTML/**.html',gulp.series(html)).on('change',sync.reload)
  gulp.watch('src/**.html',gulp.series(html)).on('change',sync.reload)
  gulp.watch('src/css/**.less',gulp.series(less)).on('change',sync.reload)
  gulp.watch('src/partcss/**.less',gulp.series(less)).on('change',sync.reload)
  gulp.watch('src/css/**.css',gulp.series(media_css)).on('change',sync.reload)
  gulp.watch('src/img/**.{jpg,jpeg,png,svg,gif,ico,webp,mp4,ogv,webm}',gulp.series(img)).on('change',sync.reload)
  gulp.watch('src/js/**/*.js',gulp.series(js)).on('change',sync.reload)
  gulp.watch('src/js/**.js',gulp.series(jsCopy)).on('change',sync.reload)
  gulp.watch('src/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',gulp.series(img)).on('change',sync.reload)
  gulp.watch(['src/img/svgicon/**.svg','!src/img/svgicon/sprite.svg'],gulp.series(delSvgIconSrc,delSvgIconDist,createSprite)).on('change',sync.reload)
}

//Сборка

//продакшен, но без минимизации css и html, а так же без объединения css в один файл
//код из файлов хранящиеся в папке partcss c расширением less вставляются в код style.css
// стили файлов кроме главного файла со стилями минимизированы, чтобы убрать лишние пробелы
exports.build = gulp.series(clear,less_for_build,html,js,jsCopy,fileCopy,img,delSvgIconSrc,delSvgIconDist,createSprite,convertFont)

// продакшен с минимизацией html и css, и объединением css файлов в один
exports.production = gulp.series(clear,allcss,html_for_prod,js_prod,jsCopy,fileCopy,img,delSvgIconSrc,delSvgIconDist,createSprite,convertFont,replacehtml)

//продакшен, в котором фоайлы less из папки partcss по отдельности вставляются в продакшен
exports.prodseparatecss = gulp.series(clear,separatecss,html,js,jsCopy,fileCopy,img,delSvgIconSrc,delSvgIconDist,createSprite,convertFont)


//разработка
exports.serve = gulp.series(less,html,js,jsCopy,fileCopy,img,delSvgIconSrc,delSvgIconDist,createSprite,convertFont,serve)





