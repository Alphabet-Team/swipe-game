/*
 *
 * Swipe Games
 *
 * @author A.kauniyyah <alaunalkauniyyah3@gmail.com>
 * @copyright 2020 A.kauniyyah | ak-code
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp task runner file.
 *
 */


// -- General

const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const noop = require('gulp-noop');
const notify = require('gulp-notify');
const runSequence = require('gulp4-run-sequence');
const plumber = require('gulp-plumber');
const browser = require('browser-sync').create();
const beautify = require('gulp-jsbeautifier');

// -- Config

const config = require('./gulpfile.config');

// -- Styles

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('cssnano');
const csso = require('gulp-csso');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

// -- Script Rollup

const { rollup } = require('rollup');
const rollupBabel = require('rollup-plugin-babel');
const {
    nodeResolve
} = require('@rollup/plugin-node-resolve');
const rollupCommonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const rollupCleanup = require('rollup-plugin-cleanup');


// ---------------------------------------------------
// -- FUNCTION OF HELPERS
// ---------------------------------------------------


// -- fetch command line arguments

const arg = (argList => {
  let arg = {},
      a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {
      thisOpt = argList[a].trim();
      opt = thisOpt.replace(/^\-+/, '');
      if (opt === thisOpt) {
          if (curOpt) arg[curOpt] = opt;
          curOpt = null;
      } else {
          curOpt = opt;
          arg[curOpt] = true;
      }
  }
  return arg;
})(process.argv);

// -- Environment configuration.

const isProd = arg.production === true;

// -- errorHandler

const errorHandler = err => {
  notify.onError({
      title: `Gulp error in ${err.plugin}`,
      message: err.toString()
  })(err);
};
// ---------------------------------------------------
// -- GULP TASKS
// ---------------------------------------------------


// -- clean of build dir

gulp.task('clean', () => del(['./build']));


// -- Run Server and reload setup

gulp.task('runServer', () => {
    return browser.init({
        server: {
            baseDir: ['build']
        },
        port: 9000,
        open: true
    });
});

gulp.task('reload', done => {
    browser.reload();
    done();
});

// -- Styles task runner

gulp.task('compile-styles', done => {

    if (!config.settings.styles) return done();

    return gulp.src(config.paths.styles.input)
        .pipe(plumber(errorHandler))
        .pipe(isProd ? noop() : sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(postcss([
            cssnano({
                discardComments: {
                    removeAll: true
                }
            })
        ]))
        .pipe(csso())
        .pipe(cleanCss({
            level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(isProd ? noop() : sourcemaps.write('./maps'))
        .pipe(gulp.dest(config.paths.styles.output));
});


// -- Rollup task runner

gulp.task('compile-scripts', done => {
    if (!config.settings.scripts) return done();

    const inputFile = () => {
        const dir = config.paths.scripts.dir;
        const rawFiles = fs.readdirSync(dir);
        let inputFile = [];


        rawFiles.forEach(function(file) {
            file = dir + '' + file;
            let stat = fs.statSync(file);

            if (stat && !stat.isDirectory()) {
                inputFile.push(file);
            }
        });

        return inputFile;
    };

    const rollupSet = rollup({
        input: inputFile(),
        plugins: [
            nodeResolve({
                browser: true,
            }),
            rollupCommonjs(),
            rollupBabel({
                exclude: 'node_modules/**'
            }),
            rollupCleanup({
                comments: 'none'
            })
        ]
    });

    const outputSet = {
        sourcemap: isProd ? false : true,
        chunkFileNames: 'module-[name].js',
        plugins: isProd ? [terser(config.uglify.prod)] : [terser(config.uglify.dev)]
    };

    return (
        rollupSet.then(bundle => {
            return bundle.write(Object.assign({
                dir: config.paths.scripts.output,
                format: 'es'
            }, outputSet));
        }),
        rollupSet.then(bundle => {
            return bundle.write(Object.assign({
                dir: config.paths.scripts.outputNomodule,
                format: 'system'
            }, outputSet));
        })
    );

});


// -- HTML static

gulp.task('compile-html', done => {

    if (!config.settings.public) return done();

    return gulp.src(config.paths.public.input)
        .pipe(beautify({
            html: {
                indent_size: 2,
                indent_char: ' ',
                max_preserve_newlines: 1
            }
        }))
        .pipe(gulp.dest(config.paths.build));

});


// -- Compile task runner

gulp.task('gulp:compile', function(callback) {
    runSequence(
        'compile-styles',
        'compile-scripts',
        'compile-html',
        callback
    );
});


// -- watch task runner

gulp.task('gulp:watch', () => {
    gulp.watch(config.paths.src, callback => {
        runSequence(
            'gulp:compile',
            'reload',
            callback
        );
    });
});


// -- task serve

gulp.task('gulp:serve', (callback) => {
    runSequence(
        'gulp:compile',
        [
            'runServer', 'gulp:watch'
        ],
        callback
    );
});


// -- task default

gulp.task('default', gulp.series('clean', 'gulp:compile'));
