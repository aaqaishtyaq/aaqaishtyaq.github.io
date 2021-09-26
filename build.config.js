const config =  {
  pug: {
    src: '_dev/pug/*.pug',
    dest: '_includes',
  },
  scripts: {
    src: '_dev/js/*.js',
    dest: '_site/assets/js',
    destSecond: 'assets/js',
  },
  styles: {
    src: '_dev/sass/main.sass',
    dest: '_site/assets/css',
    destSecond: 'assets/css',
  },
  markdown: {
    src: '_posts/**/**.md',
  },
  browserSync: {
    port: 5000,
    server: {
      baseDir: './_site',
    }
  },
  views: [
    '*.html',
    '_layouts/*.html',
    '_posts/*',
    '_includes/*',
    '_data/*',
    'notes/*.html'
  ]
}

module.exports = config
