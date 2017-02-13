/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

export default function createWindow(windows, i, filePath) {
  windows[i] = new BrowserWindow({ width: 800, height: 600, type: 'textured', minWidth: 800, minHeight: 600, backgroundColor: 'grey', show: false });

  // Emitted when the window is closed
  windows[i].on('closed', () => {
    // Dereference the window object
    windows.splice(i, 1);
  });

  windows[i].once('ready-to-show', () => {
    windows[i].show();
  });

  if (filePath) {
    windows[i].initialFilePath = filePath;
  }

  let pathname = path.resolve(__dirname, '../', 'index.html');
  let protocol = 'file:';

  // Set path to webpack dev server in development
  if (process.env.NODE_ENV === 'development') {
    pathname = 'localhost:8080';
    protocol = 'http:';
  }

  // Load the index.html of the app
  windows[i].loadURL(url.format({
    pathname,
    protocol,
    slashes: true,
  }));
}

export function installDevTools() {
  const devToolsInstaller = require('electron-devtools-installer').default;
  const reactDevTools = require('electron-devtools-installer').REACT_DEVELOPER_TOOLS;
  const reduxDevTools = require('electron-devtools-installer').REDUX_DEVTOOLS;

  devToolsInstaller(reactDevTools)
  .then(name => console.log(`Added Extension: ${name}`))
  .catch(err => console.error('An error occurred: ', err));

  devToolsInstaller(reduxDevTools)
  .then(name => console.log(`Added Extension: ${name}`))
  .catch(err => console.error('An error occurred: ', err));
}
