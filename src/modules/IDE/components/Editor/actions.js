export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_ACTIVE_FILE = 'CHANGE_ACTIVE_FILE';

export function changeTheme(theme, myCodeMirror, upgradeBackground) {
  myCodeMirror.setOption('theme', theme);
  upgradeBackground();
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
