/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import { app, BrowserWindow, Menu, globalShortcut } from 'electron';

import createWindow from './windows';

export default function createAppMenu(windows, config) {
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CommandOrControl+N',
          click: () => createWindow(windows, windows.length),
        },
        {
          label: 'New Tab',
          accelerator: 'CommandOrControl+T',
          click: () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('newFile'),
        },
        {
          label: 'Open File',
          accelerator: 'CommandOrControl+O',
          click: () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('openFile'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click: () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('save'),
        },
        {
          label: 'Save As',
          accelerator: 'CommandOrControl+Shift+S',
          click: () => (BrowserWindow.getFocusedWindow() || windows[0]).webContents.send('saveAs'),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
        {
          role: 'pasteandmatchstyle',
        },
        {
          role: 'delete',
        },
        {
          role: 'selectall',
        },
      ],
    },
    {
      label: 'Theme',
      submenu: [
        {
          label: 'abcdef',
          type: 'radio',
        },
        {
          label: 'ambiance',
          type: 'radio',
        },
        {
          label: 'blackboard',
          type: 'radio',
        },
        {
          label: 'dracula',
          type: 'radio',
        },
        {
          label: 'erlang-dark',
          type: 'radio',
        },
        {
          label: 'hopscotch',
          type: 'radio',
        },
        {
          label: 'icecoder',
          type: 'radio',
        },
        {
          label: 'material',
          type: 'radio',
        },
        {
          label: 'mbo',
          type: 'radio',
        },
        {
          label: 'mdn-like',
          type: 'radio',
        },
        {
          label: 'monokai',
          type: 'radio',
        },
        {
          label: 'neo',
          type: 'radio',
        },
        {
          label: 'panda-syntax',
          type: 'radio',
        },
        {
          label: 'paraiso-light',
          type: 'radio',
        },
        {
          label: 'pastel-on-dark',
          type: 'radio',
        },
        {
          label: 'rubyblue',
          type: 'radio',
        },
        {
          label: 'solarized',
          type: 'radio',
        },
        {
          label: 'the-matrix',
          type: 'radio',
        },
        {
          label: 'yeti',
          type: 'radio',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
        },
        {
          role: 'toggledevtools',
        },
        {
          type: 'separator',
        },
        {
          role: 'resetzoom',
        },
        {
          role: 'zoomin',
        },
        {
          role: 'zoomout',
        },
        {
          type: 'separator',
        },
        {
          role: 'togglefullscreen',
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize',
        },
        {
          role: 'close',
        },
      ],
    },
    {
      label: 'Updates',
      submenu: [
        {
          label: `Version ${app.getVersion()}`,
          enabled: false,
        },
        {
          label: 'Checking for Update',
          enabled: false,
          key: 'checkingForUpdate',
        },
        {
          label: 'Check for Update',
          visible: false,
          key: 'checkForUpdate',
          click: () => require('electron').autoUpdater.checkForUpdates(),
        },
        {
          label: 'Restart and Install Update',
          visible: false,
          key: 'restartToUpdate',
          click: () => require('electron').autoUpdater.quitAndInstall(),
        },
      ],
    },
  ];

  // Modify menu for Mac OS
  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: app.getName(),
      submenu: [
        {
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          role: 'hide',
        },
        {
          role: 'hideothers',
        },
        {
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
        },
      ],
    });
    // Edit menu
    menuTemplate.find(menuItem => menuItem.label === 'Edit').submenu.push(
      {
        type: 'separator',
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking',
          },
          {
            role: 'stopspeaking',
          },
        ],
      },
    );
    // Window menu
    menuTemplate.find(menuItem => menuItem.role === 'window').submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Zoom',
        role: 'zoom',
      },
      {
        type: 'separator',
      },
      {
        label: 'Bring All to Front',
        role: 'front',
      },
    ];
  }

  // Get and set current theme
  const currentTheme = config.get('theme');
  const menu = Menu.buildFromTemplate(menuTemplate);

  const themeSubmenuItems = menu.items.find(menuItem => menuItem.label === 'Theme').submenu.items;
  themeSubmenuItems.find(subMenuItem => subMenuItem.label === currentTheme).checked = true;

  // Add click events for theme submenu
  themeSubmenuItems.forEach((subMenuItem) => {
    subMenuItem.click = () => {
      windows.forEach(aWindow => aWindow.webContents.send('themeChanges', subMenuItem.label));
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

  return menu;
}
