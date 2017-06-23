'use strict';

const coveralls = require('gulp-coveralls'),
    david       = require('gulp-david'),
    eslint      = require('gulp-eslint'),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    istanbul    = require('gulp-istanbul'),
    mocha       = require('gulp-mocha'),
    rules       = require('@edjboston/eslint-rules'),
    sequence    = require('gulp-sequence');


// Instrument the code
gulp.task('cover', () => {
    return gulp.src('lib/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});


// Run tests and product coverage
gulp.task('test', () => {
    return gulp.src('test/*.js')
        .pipe(mocha({
            require : [ 'should' ]
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds : { global : 100 }
        }));
});


// Run tests and produce coverage
gulp.task('coveralls', () => {
    return gulp.src('coverage/lcov.info')
        .pipe(coveralls());
});


// Lint all JS files (including this one)
gulp.task('lint', () => {
    const globs = [
        'gulpfile.js',
        'lib/*.js',
        'test/*.js',
        '!node_modules/**'
    ];

    return gulp.src(globs)
        .pipe(eslint({
            extends       : 'eslint:recommended',
            parserOptions : { ecmaVersion : 6 },
            rules
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


// Check deps with David service
gulp.task('deps', () => {
    return gulp.src('package.json')
        .pipe(david());
});


// Macro for watch tasks
gulp.task('dev', done => {
    sequence(
        'lint',
        'cover',
        'test'
    )(done);
});


// Macro for travis
gulp.task('travis', done => {
    sequence(
        'dev',
        'coveralls'
    )(done);
});

// Task for local development
gulp.task('default', [ 'deps', 'dev' ], () => {
    const globs = [
        'lib/*',
        'test/*'
    ];

    gulp.watch(globs, [ 'dev' ])
        .on('change', e => {
            gutil.log('File', e.type, e.path);
        });
});
