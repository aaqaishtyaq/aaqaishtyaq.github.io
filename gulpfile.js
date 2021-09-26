const gulp        = require("gulp");
const prefix      = require("gulp-autoprefixer");
const babel       = require("gulp-babel");
const concat      = require("gulp-concat");
const postcss     = require("gulp-postcss");
const pug         = require("gulp-pug");
const sass        = require("gulp-sass")(require("sass"));
const uglify      = require("gulp-uglify");
const browserSync = require("browser-sync");
const del         = require("del");
const { spawn }   = require("child_process");

const config      = require("./build.config");

const jekyll =
  process.platform === "win32" ? "jekyll.bat" : "bundle exec jekyll";
const messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build',
};

/**
 * clean dest directory
 */
const clean = () => del(["_site"]);

const server = browserSync.create();

/**
 * Start the browser-sync server
 */
function serve(done) {
  server.init(config.browserSync);
  done();
}

/**
 * Reload the browser-sync server
 */
function reload() {
  server.reload();
}

/**
 * Build the Jekyll Site
 */
function jekyllBuild(done) {
  server.notify(messages.jekyllBuild);
  return spawn(jekyll, ["build"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    shell: true,
  }).on('close', done).on('exit', reload)
}

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
async function styles() {
  await gulp
    .src(config.styles.src, {
      since: gulp.lastRun(styles),
    })
    .pipe(
      sass({
        outputStyle: "compressed",
        includePaths: ["_dev/sass"],
      }).on("error", (error) => {
        console.error(`${error.messageFormatted}`);
        this.emit("end");
      })
    )
    .pipe(
      prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: true })
    )
    .pipe(gulp.dest(config.styles.dest))
    .pipe(
      server.reload({
        stream: true,
      })
    )
    .pipe(gulp.dest(config.styles.destSecond));
}

/**
 * Scripts compiling and concatenation
 */
async function scripts() {
  await gulp
    .src(config.scripts.src)
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(
      server.reload({
        stream: true,
      })
    )
    .pipe(gulp.dest(config.scripts.destSecond));
}

/**
 * Jade compiling
 */
async function jade() {
  await gulp.src(config.pug.src).pipe(pug()).pipe(gulp.dest(config.pug.dest));
}

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
function watch() {
  gulp.watch(config.styles.src, styles);
  gulp.watch(config.scripts.src, scripts);
  gulp.watch(config.pug.src, jade);
  gulp.watch(config.views, gulp.series(jekyllBuild, reload));
}

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
// gulp.task('default', gulp.parallel(jekyllBuild, serve, watch))
exports.styles = styles;
exports.scripts = scripts;
exports.build = gulp.series(clean, styles, scripts, jade, jekyllBuild);
exports.default = gulp.series(
  serve,
  gulp.parallel(jade, scripts, styles),
  watch
);
