import { combineReducers } from 'redux';

import fileTabsReducer from './components/FileTabs/reducer';
import editorReducer from './components/Editor/reducer';

const IDEReducer = combineReducers({
  fileTabsReducer,
  editorReducer,
});

export default IDEReducer;
