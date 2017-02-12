/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import electron, { ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import Config from 'electron-config';

import MenuTemplate from './MenuTemplate';

// Set the default theme and commands
const Menu = electron.Menu;
const config = new Config();
if (!config.get('theme')) {
  config.set('theme', 'material');
}
if (!config.get('commands')) {
  config.set('commands', { js: '', c: '', cpp: '', java: '', python: '' });
}

// Module to control application life
const app = electron.app;
// Module to create native browser window
const BrowserWindow = electron.BrowserWindow;

// Respond to config requests
// eslint-disable-next-line no-return-assign
ipcMain.on('getTheme', event => event.returnValue = config.get('theme')); // eslint-disable-line no-param-reassign
// eslint-disable-next-line no-return-assign
ipcMain.on('getCommands', event => event.returnValue = config.get('commands')); // eslint-disable-line no-param-reassign

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
const windows = [];

// Create a browser window
function createWindow(i) {
  windows[i] = new BrowserWindow({ width: 800, height: 600 });

  let pathname = path.join(__dirname, 'index.html');
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

  // Emitted when the window is closed
  windows[i].on('closed', () => {
    // Dereference the window object
    windows.splice(i, 1);
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

  if (windows.length === 0) createWindow(0);

  // Set commands and update other windows
  ipcMain.on('setCommands', (event, commands) => {
    config.set('commands', commands);
    windows.forEach(aWindow => aWindow.webContents.send('commandsChanges', commands));
    event.returnValue = true; // eslint-disable-line no-param-reassign
  });

  // Get and set current theme
  const currentTheme = config.get('theme');
  const menu = Menu.buildFromTemplate(MenuTemplate);
  const themeSubmenuItems = menu.items.find(menuItem => menuItem.label === 'Theme').submenu.items;
  themeSubmenuItems.find(subMenuItem => subMenuItem.label === currentTheme).checked = true;

  // Add click events for theme submenu
  themeSubmenuItems.forEach((subMenuItem) => {
    // eslint-disable-next-line no-param-reassign
    subMenuItem.click = () => {
      windows.forEach(aWindow => aWindow.webContents.send('themeChanges', subMenuItem.label));
      // eslint-disable-next-line no-param-reassign
      subMenuItem.checked = true;
      config.set('theme', subMenuItem.label);
    };
  });

  // Add click events for file submenu
  const fileSubmenuItems = menu.items.find(menuItem => menuItem.label === 'File').submenu.items;
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'New File').click = () => createWindow(windows.length);
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'New Tab').click = () => windows[0].webContents.send('newFile');
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'Open File').click = () => windows[0].webContents.send('openFile');
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'Save').click = () => windows[0].webContents.send('save');
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'Save As').click = () => windows[0].webContents.send('saveAs');

  // Attach menu
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  console.log(windows);
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (windows.length === 0) createWindow(0);
});
