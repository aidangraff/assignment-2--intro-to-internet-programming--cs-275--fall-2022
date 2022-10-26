const { src, dest, series, watch } = require(`gulp`),
    htmlCompressor = require(`gulp-htmlmin`),
    htmlValidator = require(`gulp-html`),
    cssCompressor = require(`gulp-clean-css`),
    cssValidator = require(`gulp-stylelint`),
    jsValidator = require(`gulp-eslint`),
    babel = require(`gulp-babel`),
    jsCompressor = require(`gulp-uglify`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;


let compressHTML = () => {
    return src(`index.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compressCSS = () => {
    return src(`css/style.css`)
        .pipe(cssCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compressJS = () => {
    return src(`js/app.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod`));
};

let validateCSS = () => {
    return src(`css/style.css`)
        .pipe(cssValidator({
            failAfterError: true,
            reporters: [
                {formatter: `verbose`, console: true}
            ]
        }));
};

let validateHTML = () => {
    return src(`index.html`)
        .pipe(htmlValidator());
};

let validateJS = () => {
    return src(`scripts/*.js`)
        .pipe(jsValidator())
        .pipe(jsValidator.formatEach(`compact`, process.stderr));
};

let transpileJSForDev = () => {
    return src(`js/app.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};

let transpileJSForProd = () => {
    return src(`js/app.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/scripts`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        server: {
            baseDir: [
                `./`
            ]
        }
    });

    watch(`index.html`, validateHTML).on(`change`, reload);
    watch(`css/style.css`, validateCSS).on(`change`, reload);
    watch(`js/app.js`, series(validateJS)).on(`change`, reload);

};



exports.validateJS = validateJS;
exports.validateHTML = validateHTML;
exports.validateCSS = validateCSS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.compressJS = compressJS;
exports.transpileJSForProd = transpileJSForProd;
exports.serve = serve;
exports.build = series(
    transpileJSForProd,
    compressHTML,
    compressCSS,
);
