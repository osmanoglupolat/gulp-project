'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import sassLoader from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import { deleteAsync as del } from 'del';

browserSync.create();
const sass = gulpSass(sassLoader);
const { src, dest, lastRun, series, parallel, watch, task } = gulp;

function clean(done) {
    return del(['dist']);
    done();
}

function html(done) {
    return src(['src/*.html'], { since: lastRun(html) })
        .pipe(dest('dist/'));
    done();
}

function css(done) {
    return (
        src(['src/scss/*.scss'])
            //.pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle: 'compressed',
                })
            )
            .pipe(
                autoprefixer({
                    cascade: false,
                    grid: false,
                })
            )
            //.pipe(sourcemaps.write('.'))
            .pipe(dest('dist/css'))
            .pipe(browserSync.stream())
    );
    done();
}

function js(done) {
    return (
        src(['src/js/*.js'])
            //.pipe(sourcemaps.init())
            .pipe(uglify())
            //.pipe(concat('all.js'))
            //.pipe(sourcemaps.write('.'))
            .pipe(dest('dist/js'))
    );
    done();
}

function jsExt(done) {
    return src(['src/js/ext/**']).pipe(dest('dist/js/ext'));
    done();
}

function images(done) {
    return src(['src/img/**']).pipe(dest('dist/img'));
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

function host(done) {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
    });
    done();
}

function watchFiles(done) {
    watch('src/**/*.html', series(html, reload));
    watch('src/scss/**/*.scss', series(css));
    watch('src/js/**', series(js, jsExt, reload));
    watch('src/img/**', series(images, reload));
    done();
}

const _default = series(
    clean,
    css,
    parallel(html, js, jsExt, images),
    host,
    watchFiles
);

export { _default as default, clean, css, js };
