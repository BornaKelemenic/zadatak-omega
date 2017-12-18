var gulp = require('gulp');

var notySrc = [
    'node_modules/noty/index.d.ts'
];

gulp.task('notyCopy', function () { gulp.src(notySrc).pipe(gulp.dest('./node_modules/@types/noty')); });
gulp.task('build', ['notyCopy']);