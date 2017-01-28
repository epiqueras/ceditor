import { CHANGE_ACTIVE_FILE } from './actions';

const initialState = {
  activeFilePath: '/Desktop/Array-Shift.c',
  openFiles: [
    {
      fileName: 'Array-Shift.c',
      filePath: '/Desktop/Array-Shift.c',
      fileContent: `#include <stdio.h>

int main() {
  printf("Hello World");
  return 0;
}
`,
    },
    {
      fileName: 'Random-Shift.c',
      filePath: '/Desktop/Ranqdom-Shift.c',
      fileContent: 'var a\nawd',
    },
    {
      fileName: 'What-Shift.c',
      filePath: '/Desktop/What-Swhift.c',
      fileContent: 'var a\nawd',
    },
  ],
};

const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const getActiveFilePath = state => state.IDEReducer.editorReducer.activeFilePath;
export const getOpenFiles = state => state.IDEReducer.editorReducer.openFiles;

export default editorReducer;
