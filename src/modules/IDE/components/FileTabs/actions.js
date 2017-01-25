export const MOVE_TAB = 'MOVE_TAB';

export function moveTab(filePath, toIndex) {
  return {
    type: MOVE_TAB,
    filePath,
    toIndex,
  };
}
