/* eslint-disable import/no-extraneous-dependencies */
import { app } from 'electron';

const MenuTemplate = [
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
];

if (process.platform === 'darwin') {
  MenuTemplate.unshift({
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
  // Edit menu.
  MenuTemplate[1].submenu.push(
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
  // Window menu.
  MenuTemplate[4].submenu = [
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

export default MenuTemplate;
