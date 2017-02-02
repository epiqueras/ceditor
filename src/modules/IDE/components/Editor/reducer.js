import { ipcRenderer } from 'electron';

import { CHANGE_THEME, CHANGE_ACTIVE_FILE, NEW_FILE, OPEN_FILE, STORE_DOC, CLOSE_FILE } from './actions';

function findFileHelper(state, action) {
  const file = state.openFiles.find(aFile => aFile.path === action.filePath);
  return { file, fileIndex: state.openFiles.indexOf(file) };
}

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
        openFiles: [
          ...state.openFiles,
          {
            name: action.fileName,
            path: action.filePath,
            value: 'hello',
            history: '',
          },
        ],
      };
    case OPEN_FILE:
      return {
        ...state,
        activeFilePath: action.filePath,
        openFiles: [
          ...state.openFiles,
          {
            name: action.fileName,
            path: action.filePath,
            value: action.fileContent,
            history: '',
          },
        ],
      };
    case STORE_DOC:
      return {
        ...state,
        openFiles: state.openFiles.map(file =>
          file.path === action.filePath ?
          {
            ...file,
            value: action.value,
            history: action.history,
          }
          :
            file,
        ),
      };
    case CLOSE_FILE:
      return {
        ...state,
        activeFilePath: state.openFiles.length < 2 ? '' : state.openFiles.find(file => file.path !== action.filePath).path,
        openFiles: [
          ...state.openFiles.slice(0, findFileHelper(state, action).fileIndex),
          ...state.openFiles.slice(findFileHelper(state, action).fileIndex + 1),
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
