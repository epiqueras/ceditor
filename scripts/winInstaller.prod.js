'use strict';

var _electronWinstaller = require('electron-winstaller');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deleteOutputFolder() {
  return new Promise(function (resolve, reject) {
    (0, _rimraf2.default)(_path2.default.resolve(__dirname, '..', 'out', 'windows-installer'), function (error) {
      if (error) reject(error);
      resolve();
    });
  });
} /* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */


deleteOutputFolder().then(function () {
  var rootPath = _path2.default.resolve(__dirname, '..');
  var outPath = _path2.default.resolve(rootPath, 'out');

  return (0, _electronWinstaller.createWindowsInstaller)({
    appDirectory: _path2.default.resolve(outPath, 'ceditor-win32-ia32'),
    iconUrl: 'https://raw.githubusercontent.com/epiqueras/ceditor/master/assets/icons/win/logo.ico',
    noMsi: true,
    outputDirectory: _path2.default.resolve(outPath, 'windows-installer'),
    setupExe: 'ceditorSetup.exe',
    setupIcon: _path2.default.resolve(rootPath, 'assets', 'icons', 'win', 'logo.ico')
  });
}).catch(function (error) {
  console.error(error.message || error);
  process.exit(1);
});
