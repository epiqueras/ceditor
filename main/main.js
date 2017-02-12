/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import electron, { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
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

// Respond to config requests
// eslint-disable-next-line no-return-assign
ipcMain.on('getTheme', event => event.returnValue = config.get('theme')); // eslint-disable-line no-param-reassign
// eslint-disable-next-line no-return-assign
ipcMain.on('getCommands', event => event.returnValue = config.get('commands')); // eslint-disable-line no-param-reassign

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
const windows = [];

// Create a browser window
function createWindow(i, filePath) {
  // eslint-disable-next-line no-unneeded-ternary
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

// Respond to when tabs are dragged out of the tab bar
ipcMain.on('draggedTabOut', (event, filePath) => {
  const newIndex = windows.length;
  createWindow(newIndex, filePath);
  event.returnValue = true; // eslint-disable-line no-param-reassign
});

// Clear initialFilePaths
ipcMain.on('clearInitialFilePath', (event, windowId) => {
  windows.find(aWindow => aWindow.id === windowId).initialFilePath = false;
  event.returnValue = true; // eslint-disable-line no-param-reassign
});

// Set commands and update other windows
ipcMain.on('setCommands', (event, commands) => {
  config.set('commands', commands);
  windows.forEach(aWindow => aWindow.webContents.send('commandsChanges', commands));
  event.returnValue = true; // eslint-disable-line no-param-reassign
});

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

  globalShortcut.register('CommandOrControl+Shift+T', () => {
    const theCurrentTheme = themeSubmenuItems.find(subMenuItem => subMenuItem.checked === true);
    let newThemeIndex = themeSubmenuItems.indexOf(theCurrentTheme) + 1;
    newThemeIndex = newThemeIndex >= themeSubmenuItems.length ? 0 : newThemeIndex;
    themeSubmenuItems[newThemeIndex].click();
  });

  // Add click events for file submenu
  const fileSubmenuItems = menu.items.find(menuItem => menuItem.label === 'File').submenu.items;
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'New File').click = () => createWindow(windows.length);
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'New Tab').click = () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('newFile');
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'Open File').click = () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('openFile');
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'Save').click = () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('save');
  fileSubmenuItems.find(subMenuItem => subMenuItem.label === 'Save As').click = () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('saveAs');

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
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (windows.length === 0) createWindow(0);
});
