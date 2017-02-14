/* eslint-disable no-param-reassign */
import { app, autoUpdater, Menu } from 'electron';
import os from 'os';

let state = 'checking'; // eslint-disable-line no-unused-vars

function updateMenu() {
  const menu = Menu.getApplicationMenu();
  if (!menu) return;

  menu.items.find(menuItem => menuItem.label === 'Updates').submenu.items.forEach((subMenuItem) => {
    switch (subMenuItem.key) {
      case 'checkForUpdate':
        subMenuItem.visible = state === 'no-update';
        break;
      case 'checkingForUpdate':
        subMenuItem.visible = state === 'checking';
        break;
      case 'restartToUpdate':
        subMenuItem.visible = state === 'installed';
        break;
      default:
        break;
    }
  });
}

export default function initializeAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    state = 'checking';
    updateMenu();
  });

  autoUpdater.on('update-available', () => {
    state = 'checking';
    updateMenu();
  });

  autoUpdater.on('update-downloaded', () => {
    state = 'installed';
    updateMenu();
  });

  autoUpdater.on('update-not-available', () => {
    state = 'no-update';
    updateMenu();
  });

  autoUpdater.on('error', () => {
    state = 'no-update';
    updateMenu();
  });

  let platform = os.platform();
  platform = platform === 'win32' ? platform : `${platform}_${os.arch()}`;

  autoUpdater.setFeedURL(`https://ceditor-updater.herokuapp.com/update/${platform}/${app.getVersion()}`);
  autoUpdater.checkForUpdates();
}
