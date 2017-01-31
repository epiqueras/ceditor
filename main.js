/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import electron, { ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import Config from 'electron-config';

import MenuTemplate from './MenuTemplate';

const Menu = electron.Menu;
const config = new Config();
if (!config.get('theme')) {
  config.set('theme', 'material');
}

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Respond to config requests
// eslint-disable-next-line no-return-assign
ipcMain.on('getTheme', event => event.returnValue = config.get('theme')); // eslint-disable-line no-param-reassign

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
app.on('ready', () => {
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

  // Get and set current theme
  const currentTheme = config.get('theme');
  const menu = Menu.buildFromTemplate(MenuTemplate);
  const themesSubmenu = menu.items.find(menuItem => menuItem.label === 'Theme').submenu.items;
  themesSubmenu.find(subMenuItem => subMenuItem.label === currentTheme).checked = true;

  // Add click events
  themesSubmenu.forEach((subMenuItem) => {
    // eslint-disable-next-line no-param-reassign
    subMenuItem.click = () => {
      mainWindow.webContents.send('themeChanges', subMenuItem.label);
      // eslint-disable-next-line no-param-reassign
      subMenuItem.checked = true;
      config.set('theme', subMenuItem.label);
    };
  });

  // Attach menu
  Menu.setApplicationMenu(menu);

  createWindow();
});

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
