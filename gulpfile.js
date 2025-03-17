const { task, src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const PACH = {
  scssSource : './src/**/*.scss',
  projectDest : './assets',
  htmlSource : './*.html',
  scriptsSource : './src/**/*.js',
}

const plugins = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true  })
];

function syncInit () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
}

async function sync() {
  browserSync.reload()
}

function scssMin() {
  const pluginsForMinify = [...plugins, cssnano({ preset: 'default' })]
  return src(PACH.scssSource, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(pluginsForMinify))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PACH.projectDest, { sourcemaps: true }))
}

function watchFiles() {
  syncInit();
  watch(PACH.scssSource, scssMin);
  watch(PACH.scssSource, sync);
  watch(PACH.htmlSource, sync)
  watch(PACH.scriptsSource, sync)
}

task('min', scssMin)
task('watch', watchFiles);

