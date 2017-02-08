import { combineReducers } from 'redux';

import REPLReducer from './components/REPL/reducer';
import fileTabsReducer from './components/FileTabs/reducer';
import editorReducer from './components/Editor/reducer';

const IDEReducer = combineReducers({
  REPLReducer,
  fileTabsReducer,
  editorReducer,
});

export default IDEReducer;
