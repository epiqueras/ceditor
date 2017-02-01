export const MOVE_TAB = 'MOVE_TAB';
export const CHANGE_ACTIVE_FILE = 'CHANGE_ACTIVE_FILE';
export const ADD_TAB = 'ADD_TAB';
export const REMOVE_TAB = 'REMOVE_TAB';

export function moveTab(filePath, toIndex) {
  return {
    type: MOVE_TAB,
    filePath,
    toIndex,
  };
}

export function changeActiveFile(filePath) {
  return {
    type: CHANGE_ACTIVE_FILE,
    filePath,
  };
}

export function addTab(fileName, filePath) {
  return {
    type: ADD_TAB,
    fileName,
    filePath,
  };
}

export function removeTab(filePath) {
  return {
    type: REMOVE_TAB,
    filePath,
  };
}
