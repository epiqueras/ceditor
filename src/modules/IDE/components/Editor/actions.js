export const CHANGE_ACTIVE_FILE = 'CHANGE_ACTIVE_FILE';

export function changeActiveFile(filePath) {
  return {
    type: CHANGE_ACTIVE_FILE,
    filePath,
  };
}
