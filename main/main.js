/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { app, Menu } from 'electron';

import setUpConfigAndIpc from './configIpc';
import createWindow, { installDevTools } from './windows';
import createAppMenu from './appMenu';
import initializeAutoUpdater from './autoUpdater';

if (require('electron-squirrel-startup')) app.quit();
else {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected
  const windows = [];

  const config = setUpConfigAndIpc(windows);

  app.on('ready', () => {
    if (process.env.NODE_ENV === 'development') {
      installDevTools();
    }
    if (windows.length === 0) createWindow(windows, 0);
    Menu.setApplicationMenu(createAppMenu(windows, config)); // Attach menu
    if (process.argv[1] !== '--squirrel-firstrun') initializeAutoUpdater();
  });

  // Quit when all windows are closed
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (windows.length === 0) createWindow(windows, 0);
  });
}
