var gulp = require('gulp');

// ==================================================================
//  TEST
// ==================================================================

var mocha = require('gulp-mocha');

gulp.task('test', function () {
  gulp.src('tests/main.js', { read: false })
    .pipe( mocha({ }) );
});