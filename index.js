/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
if (process.env.NODE_ENV === 'production') {
  require('./main-dist/main.js');
} else if (process.env.NODE_ENV === 'development') {
  require('babel-register')({
    babelrc: false,
    presets: ['es2015'],
  });
  require('babel-polyfill');
  require('./main/main.js');
}
