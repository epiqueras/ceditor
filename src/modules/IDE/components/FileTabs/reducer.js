import update from 'react/lib/update';

import { MOVE_TAB } from './actions';

function findTabHelper(state, action) {
  return state.fileTabs.find(fileInfo => fileInfo.filePath === action.filePath);
}

const initialState = {
  fileTabs: [
    {
      fileName: 'Array-Shift.c',
      filePath: '/Desktop/Array-Shift.c',
    },
    {
      fileName: 'Random-Shift.c',
      filePath: '/Desktop/Ranqdom-Shift.c',
    },
    {
      fileName: 'What-Shift.c',
      filePath: '/Desktop/What-Swhift.c',
    },
  ],
};

const fileTabsReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOVE_TAB:
      return update(state, {
        fileTabs: {
          $splice: [
            [state.fileTabs.indexOf(findTabHelper(state, action)), 1],
            [action.toIndex, 0, findTabHelper(state, action)],
          ],
        },
      });
    default:
      return state;
  }
};

export const getFileTabs = state => state.IDEReducer.fileTabsReducer.fileTabs;

export default fileTabsReducer;
