const { src, dest, parallel, series, watch } = require('gulp');

const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const sass         = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const del          = require('del');

function sync() {
  browserSync.init({
    server: { baseDir: 'app/' },
    notify: false,
    online: true
  })
}

function images() {
  return src('app/images/src/**/*')
  .pipe(newer('app/images/dest/'))
  .pipe(imagemin())
  .pipe(dest('app/images/dest/'))
}

function cleanimg() {
  return(del('app/images/dest/**/*', { force: true }))
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'app/js/app.js',
  ])
.pipe(concat('app.min.js'))

.pipe(uglify())
.pipe(dest('app/js/'))
.pipe(browserSync.stream())
}
function styles() {
  return src('app/sass/**/*.scss')
  .pipe(sass())
  .pipe(concat('app.min.css'))
  // .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(cleancss(
    {compatibility: 'ie8'}
  ))
  .pipe(dest('app/css/'))
  .pipe(browserSync.stream())
}


function startwatch() {
   watch(['app/**/*.js', '!app/**/*.min.js'], scripts)
   watch('app/**/*.scss', styles)
   watch('app/**/*.html').on('change', browserSync.reload)
   watch('app/images/src/**/*', images)
}


exports.browsersync = sync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.default     = parallel(styles, scripts, sync, startwatch);