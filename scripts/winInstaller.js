/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { createWindowsInstaller } from 'electron-winstaller';
import path from 'path';
import rimraf from 'rimraf';

function deleteOutputFolder() {
  return new Promise((resolve, reject) => {
    rimraf(path.resolve(__dirname, '..', 'out', 'windows-installer'), (error) => {
      if (error) reject(error);
      resolve();
    });
  });
}

deleteOutputFolder().then(() => {
  const rootPath = path.resolve(__dirname, '..');
  const outPath = path.resolve(rootPath, 'out');

  return createWindowsInstaller({
    appDirectory: path.resolve(outPath, 'ceditor-win32-ia32'),
    iconUrl: 'https://raw.githubusercontent.com/epiqueras/ceditor/master/assets/icons/win/logo.ico',
    noMsi: true,
    outputDirectory: path.resolve(outPath, 'windows-installer'),
    setupExe: 'ceditorSetup.exe',
    setupIcon: path.resolve(rootPath, 'assets', 'icons', 'win', 'logo.ico'),
  });
}).catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
