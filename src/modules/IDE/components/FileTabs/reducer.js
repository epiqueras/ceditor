import update from 'react/lib/update';

import { MOVE_TAB, ADD_TAB } from './actions';

function findTabHelper(state, action) {
  return state.fileTabs.find(fileTab => fileTab.path === action.filePath);
}

const initialState = {
  fileTabs: [],
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
    case ADD_TAB:
      return {
        ...state,
        fileTabs: [...state.fileTabs, { name: action.fileName, path: action.filePath }],
      };
    default:
      return state;
  }
};

export const getFileTabs = state => state.IDEReducer.fileTabsReducer.fileTabs;

export default fileTabsReducer;
