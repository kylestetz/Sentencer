var gulp = require('gulp');
var less = require('gulp-less-sourcemap');
var markdown = require('gulp-markdown');
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');

gulp.task('less', function () {
	gulp.src('./css/site.less')
	.pipe(less({
		sourceMap: {
			sourceMapRootpath: './' // Optional absolute or relative path to your LESS files
		}
	}))
  .on('error', function (error) {
    console.error(error);
  })
	.pipe(gulp.dest('./css'));
});


gulp.task('md', function () {
    return gulp.src('README.md')
      .pipe(markdown())
      .pipe(gulp.dest('./'))
    ;
});

gulp.task('inject', ['md'], function (callback) {
	fs.readFile('./index.html', { encoding: 'utf8' }, function(err, indexHtml) {
		fs.readFile('./README.html', { encoding: 'utf8' }, function(err, readmeMarkup) {

			var $ = cheerio.load(indexHtml);
      $('#readme').html(readmeMarkup);

      fs.writeFileSync('index.html', $.html());
      return callback(null);
		});
	});
});

gulp.task('default', ['less', 'md', 'inject']);