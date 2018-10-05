var gulp = require('gulp');

// ==================================================================
//  TEST
// ==================================================================

var mocha = require('gulp-mocha');

gulp.task('test', function () {
  return gulp.src('tests/main.js', { read: false })
    .pipe( mocha({ }) )
});
