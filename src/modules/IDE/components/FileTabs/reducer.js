import update from 'react/lib/update';

import { MOVE_TAB, ADD_TAB, REMOVE_TAB } from './actions';

import { SET_UNSAVED_CHANGES } from '../Editor/actions';

function findTabHelper(state, action) {
  const tab = state.fileTabs.find(fileTab => fileTab.path === action.filePath);
  return { tab, tabIndex: state.fileTabs.indexOf(tab) };
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
            [findTabHelper(state, action).tabIndex, 1],
            [action.toIndex, 0, findTabHelper(state, action).tab],
          ],
        },
      });
    case ADD_TAB:
      return {
        ...state,
        fileTabs: [
          ...state.fileTabs,
          { name: action.fileName, path: action.filePath, unsavedChanges: false },
        ],
      };
    case REMOVE_TAB:
      return {
        ...state,
        fileTabs: [
          ...state.fileTabs.slice(0, findTabHelper(state, action).tabIndex),
          ...state.fileTabs.slice(findTabHelper(state, action).tabIndex + 1),
        ],
      };
    case SET_UNSAVED_CHANGES:
      return {
        ...state,
        fileTabs: state.fileTabs.map(file => file.path === action.filePath ?
        {
          ...file,
          unsavedChanges: action.unsavedChanges,
        }
        :
          file,
        ),
      };
    default:
      return state;
  }
};

export const getFileTabs = state => state.IDEReducer.fileTabsReducer.fileTabs;

export default fileTabsReducer;
