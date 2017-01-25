/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import electron from 'electron';
import path from 'path';
import url from 'url';

if (process.env.NODE_ENV === 'development') {
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

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  let pathname = path.join(__dirname, 'index.html');
  let protocol = 'file:';

  if (process.env.NODE_ENV === 'development') {
    pathname = 'localhost:8080';
    protocol = 'http:';
  }

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname,
    protocol,
    slashes: true,
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
