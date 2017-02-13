/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { ipcMain } from 'electron';
import Config from 'electron-config';

import createWindow from './windows';

export default function setUpConfigAndIpc(windows) {
  // Set the default theme and commands
  const config = new Config();
  if (!config.get('theme')) {
    config.set('theme', 'material');
  }
  if (!config.get('commands')) {
    config.set('commands', { js: '', c: '', cpp: '', java: '', python: '' });
  }

  // Respond to config requests
  ipcMain.on('getTheme', event => event.returnValue = config.get('theme'));
  ipcMain.on('getCommands', event => event.returnValue = config.get('commands'));

  // Respond to when tabs are dragged out of the tab bar
  ipcMain.on('draggedTabOut', (event, filePath) => {
    const newIndex = windows.length;
    createWindow(windows, newIndex, filePath);
    event.returnValue = true;
  });

  // Clear initialFilePaths
  ipcMain.on('clearInitialFilePath', (event, windowId) => {
    windows.find(aWindow => aWindow.id === windowId).initialFilePath = false;
    event.returnValue = true;
  });

  // Set commands and update other windows
  ipcMain.on('setCommands', (event, commands) => {
    config.set('commands', commands);
    windows.forEach(aWindow => aWindow.webContents.send('commandsChanges', commands));
    event.returnValue = true;
  });

  return config;
}
