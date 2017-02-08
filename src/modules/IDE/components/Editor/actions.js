import fs from 'fs';

export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_ACTIVE_FILE = 'CHANGE_ACTIVE_FILE';
export const NEW_FILE = 'NEW_FILE';
export const OPEN_FILE = 'OPEN_FILE';
export const STORE_DOC = 'STORE_DOC';
export const CLOSE_FILE = 'CLOSE_FILE';
export const SET_UNSAVED_CHANGES = 'SET_UNSAVED_CHANGES';
export const SAVE_AS = 'SAVE_AS';

export function changeTheme(theme) {
  return {
    type: CHANGE_THEME,
    theme,
  };
}

export function changeActiveFile(filePath) {
  return {
    type: CHANGE_ACTIVE_FILE,
    filePath,
  };
}

export function createNewFile(fileName, filePath) {
  return {
    type: NEW_FILE,
    fileName,
    filePath,
  };
}

export function openFile(fileName, filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return {
    type: OPEN_FILE,
    fileName,
    filePath,
    fileContent,
  };
}

export function storeDoc(filePath, value, history = '') {
  return {
    type: STORE_DOC,
    filePath,
    value,
    history,
  };
}

export function closeFile(filePath) {
  return {
    type: CLOSE_FILE,
    filePath,
  };
}

export function setUnsavedChanges(filePath, unsavedChanges, saveFile = false, data = '') {
  if (saveFile && data) {
    fs.writeFileSync(filePath, data, 'utf8');
  }
  return {
    type: SET_UNSAVED_CHANGES,
    filePath,
    unsavedChanges,
  };
}

export function saveAs(prevFilePath, filePath, data = '') {
  fs.writeFileSync(filePath, data);
  const fileName = filePath.slice(filePath.lastIndexOf('/') + 1);
  return {
    type: SAVE_AS,
    fileName,
    prevFilePath,
    filePath,
  };
}
