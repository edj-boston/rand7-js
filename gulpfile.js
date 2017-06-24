'use strict';

const depcheck = require('depcheck'),
    g          = require('gulp-load-plugins')(),
    gulp       = require('gulp'),
    rules      = require('@edjboston/eslint-rules');


// Instrument the code
gulp.task('cover', () => {
    return gulp.src('lib/*.js')
        .pipe(g.istanbul())
        .pipe(g.istanbul.hookRequire());
});


// Run tests and product coverage
gulp.task('test', () => {
    return gulp.src('test/*.js')
        .pipe(g.mocha({
            require : [ 'should' ]
        }))
        .pipe(g.istanbul.writeReports())
        .pipe(g.istanbul.enforceThresholds({
            thresholds : { global : 100 }
        }));
});


// Run tests and produce coverage
gulp.task('coveralls', () => {
    return gulp.src('coverage/lcov.info')
        .pipe(g.coveralls());
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
        .pipe(g.eslint({
            extends       : 'eslint:recommended',
            parserOptions : { ecmaVersion : 6 },
            rules
        }))
        .pipe(g.eslint.format())
        .pipe(g.eslint.failAfterError());
});


// Check deps with David service
gulp.task('david', () => {
    return gulp.src('package.json')
        .pipe(g.david({ update : '=' }));
});


// Check for unused deps with depcheck
gulp.task('depcheck', g.depcheck({
    specials : [
        depcheck.special['gulp-load-plugins']
    ]
}));


// Macro for watch tasks
gulp.task('dev', done => {
    g.sequence(
        'lint',
        'cover',
        'test'
    )(done);
});


// Macro for travis
gulp.task('travis', done => {
    g.sequence(
        'dev',
        'coveralls'
    )(done);
});

// Task for local development
gulp.task('default', [ 'david', 'depcheck', 'dev' ], () => {
    const globs = [
        'lib/*',
        'test/*'
    ];

    gulp.watch(globs, [ 'dev' ])
        .on('change', e => {
            g.util.log('File', e.type, e.path);
        });
});
