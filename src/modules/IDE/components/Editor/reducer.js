import { ipcRenderer } from 'electron';

import { CHANGE_THEME, CHANGE_ACTIVE_FILE, NEW_FILE, OPEN_FILE } from './actions';

const initialState = {
  theme: ipcRenderer.sendSync('getTheme'),
  activeFilePath: '',
  openFiles: [],
};

const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return { ...state, theme: action.theme };
    case CHANGE_ACTIVE_FILE:
      return { ...state, activeFilePath: action.filePath };
    case NEW_FILE:
      return {
        ...state,
        activeFilePath: action.filePath,
        openFiles: [...state.openFiles, { name: action.fileName, path: action.filePath, doc: 'hello' }],
      };
    case OPEN_FILE:
      return {
        ...state,
        activeFilePath: action.filePath,
        openFiles: [
          ...state.openFiles,
          { name: action.fileName, path: action.filePath, doc: action.fileContent },
        ],
      };
    default:
      return state;
  }
};

export const getTheme = state => state.IDEReducer.editorReducer.theme;
export const getActiveFilePath = state => state.IDEReducer.editorReducer.activeFilePath;
export const getOpenFiles = state => state.IDEReducer.editorReducer.openFiles;

export default editorReducer;
