const gulp = require("gulp");
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const auto_prefixer = require('gulp-autoprefixer');
const clean_CSS = require('gulp-clean-css');
const file_include = require('gulp-file-include');
const webp = require('gulp-webp');
const livereload = require('gulp-livereload');
const ttf2woff2 = require('gulp-ttf2woff2');
const paths = {
    src: "source/",
    dest: "out/",
    html: "HTML/",
    css: "CSS/",
    sass: "SASS/",
    js: "JS/",
    img: "IMG/",
    svg: "SVG/",
    fonts: "Fonts/",
    ToSrc: (path) => [paths.src + path + "**", `!${paths.src + path}/_*`],
    Watch: (path) => paths.src + path + "**",
    ToDest: (path) => paths.dest + path,
    build: {
        html: () => paths.ToSrc(paths.html),
        sass: () => paths.ToSrc(paths.sass),
        js: () => paths.ToSrc(paths.js),
        img: () => paths.ToSrc(paths.img),
        svg: () => paths.ToSrc(paths.svg),
        fonts:()=>paths.ToSrc(paths.fonts),
    },
    watch: {
        html: () => paths.Watch(paths.html),
        sass: () => paths.Watch(paths.sass),
        js: () => paths.Watch(paths.js),
        img: () => paths.Watch(paths.img),
        svg: () => paths.Watch(paths.svg),
        fonts: () => paths.Watch(paths.fonts),
    },
    destination: {
        html: () => paths.ToDest(paths.html),
        css: () => paths.ToDest(paths.css),
        js: () => paths.ToDest(paths.js),
        img: () => paths.ToDest(paths.img),
        svg: () => paths.ToDest(paths.svg),
        fonts: () => paths.ToDest(paths.fonts),
    }
}

function ProccesHTML(params) {
    return gulp.src(paths.build.html()).pipe(file_include({
        prefix: '@@',
        basepath: '@file'
    })).pipe(gulp.dest(paths.destination.html()))
}

function ProccesSASS(params) {
    return gulp.src(paths.build.sass()).pipe(sass.sync().on('error', sass.logError)).pipe(clean_CSS({
        compatibility: 'ie8'
    })).pipe(auto_prefixer({
        cascade: false
    })).pipe(gulp.dest(paths.destination.css()))
}

function ProccesJS(params) {
    return gulp.src(paths.build.js()).pipe(gulp.dest(paths.destination.js()))
}

function ProccesIMG(params) {
    return gulp.src(paths.build.img()).pipe(webp()).pipe(gulp.dest(paths.destination.img()))
}

function ProccesSVG(params) {
    return gulp.src(paths.build.svg()).pipe(gulp.dest(paths.destination.svg()))
}

function ProccesFonts(params) {
    return gulp.src(paths.build.fonts()).pipe(ttf2woff2()).pipe(gulp.dest(paths.destination.fonts))
}
function DeleteDest(params) {
    return gulp.src(paths.dest, {
        read: false
    }).pipe(clean())
}
function Watch(params) {
    livereload.listen();
    gulp.watch(paths.watch.sass(), ProccesSASS);
    gulp.watch(paths.watch.html(), ProccesHTML);
    gulp.watch(paths.watch.js(), ProccesJS);
    gulp.watch(paths.watch.svg(), ProccesSVG);
    gulp.watch(paths.watch.img(), ProccesIMG);
    gulp.watch(paths.watch.fonts(), ProccesFonts);
}
exports.default = gulp.series(DeleteDest, ProccesHTML, ProccesIMG, ProccesJS, ProccesSASS, ProccesSVG, ProccesFonts);
exports.watch = Watch;