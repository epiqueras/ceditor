import { combineReducers } from 'redux';

import fileTabsReducer from './components/FileTabs/reducer';

const IDEReducer = combineReducers({
  fileTabsReducer,
});

export default IDEReducer;
