import gulp from "gulp";
import browserSync from "browser-sync";
import sassLoader from 'sass';
import gulpSass from 'gulp-sass';
import minifyCSS from 'gulp-csso';
import minifyImg from 'gulp-imagemin';
import minifyJS from 'gulp-uglify';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import { deleteAsync as del } from 'del';

const sass = gulpSass(sassLoader);

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('css', () => {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('img', () => {
    /*
    Eğer resimleri minify etmek isterseniz yorum satırını kaldırabilirsiniz.
    */
    gulp.src('src/img/**/*')
        // .pipe(minifyImg())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('delete', () => del(['dist/css', 'dist/js', 'dist/img', 'dist/**/*.html']));

gulp.task('watch', () => {
    gulp.watch("src/scss/**/*.scss", gulp.task('css'));
    gulp.watch("src/js/**/*.js", gulp.task('js'));
    gulp.watch("src/img/**/*.img", gulp.task('img'));
    gulp.watch("src/**/*.html", gulp.task('html'));
});

gulp.task('default', gulp.series('delete', gulp.parallel('html', 'css', 'js', 'img', 'browser-sync', 'watch')));
