/*
 *
 * Swipe Games
 *
 * @author A.kauniyyah <alaunalkauniyyah3@gmail.com>
 * @copyright 2020 A.kauniyyah | ak-code
 *
 * ________________________________________________________________________________
 *
 * gulpfile.config.js
 *
 *
 */


// -- Settings | Turn on/off build features

const SETTINGS = {
    scripts: true,
    styles: true,
    public: true,
    reload: true
};

// -- Uglify setup | setup of dev or prod env build

const UGLIFY = {
    prod: {
        compress: {
            drop_console: true,
            drop_debugger: true,
            side_effects: false
        }
    },
    dev: {
        compress: {
            drop_console: false,
            drop_debugger: false,
            side_effects: false
        }
    }
};


// -- path config | setup of path src or dist file

const SRC = './src/';
const BUILD = './build/';
const STATIC = BUILD + 'static/';
const HTML = SRC + 'public/';

const PATHS = {
    build: BUILD,
    html: HTML,
    src: SRC,
    styles: {
        dir: SRC + 'styles/',
        input: SRC + 'styles/*.scss',
        output: STATIC + 'css/'
    },
    scripts: {
        dir: SRC + 'js/',
        input: SRC + 'js/',
        output: STATIC + 'js/',
        outputNomodule: STATIC + 'js/nomodule'
    },
    public: {
        input: HTML + '**/*.html',
        output: BUILD
    },
    purge: [
        HTML + '**/*.html',
        SRC + 'js/**/*.js'
    ]
};


// -- bundle config | all for export

module.exports = {
    paths: PATHS,
    uglify: UGLIFY,
    settings: SETTINGS
};
