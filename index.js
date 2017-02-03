/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
if (process.env.NODE_ENV === 'production') {
  require('./main.prod.js');
} else if (process.env.NODE_ENV === 'development') {
  require('babel-register');
  require('babel-polyfill');
  require('./main.dev.js');
}
