/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import electron, { ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import Config from 'electron-config';

import MenuTemplate from './MenuTemplate';

// Set the default theme
const Menu = electron.Menu;
const config = new Config();
if (!config.get('theme')) {
  config.set('theme', 'material');
}

// Module to control application life
const app = electron.app;
// Module to create native browser window
const BrowserWindow = electron.BrowserWindow;

// Respond to config requests
// eslint-disable-next-line no-return-assign
ipcMain.on('getTheme', event => event.returnValue = config.get('theme')); // eslint-disable-line no-param-reassign

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
let mainWindow;

// Create the browser window. TODO: Support more than one window
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  let pathname = path.join(__dirname, 'index.html');
  let protocol = 'file:';

  // Set path to webpack dev server in development
  if (process.env.NODE_ENV === 'development') {
    pathname = 'localhost:8080';
    protocol = 'http:';
    // Open the DevTools
    mainWindow.webContents.openDevTools();
  }

  // Load the index.html of the app
  mainWindow.loadURL(url.format({
    pathname,
    protocol,
    slashes: true,
  }));

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
app.on('ready', () => {
  // Install DevTools in development
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
  const themeSubmenuItems = menu.items.find(menuItem => menuItem.label === 'Theme').submenu.items;
  themeSubmenuItems.find(subMenuItem => subMenuItem.label === currentTheme).checked = true;

  // Add click events for theme submenu
  themeSubmenuItems.forEach((subMenuItem) => {
    // eslint-disable-next-line no-param-reassign
    subMenuItem.click = () => {
      mainWindow.webContents.send('themeChanges', subMenuItem.label);
      // eslint-disable-next-line no-param-reassign
      subMenuItem.checked = true;
      config.set('theme', subMenuItem.label);
    };
  });

  // Add click events for file submenu
  const fileSubmenuItems = menu.items.find(menuItem => menuItem.label === 'File').submenu.items;
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'New').click = () => mainWindow.webContents.send('newFile');
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'Save').click = () => mainWindow.webContents.send('save');

  // Attach menu
  Menu.setApplicationMenu(menu);

  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (mainWindow === null) {
    createWindow();
  }
});
