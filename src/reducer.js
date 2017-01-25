import { combineReducers } from 'redux';

import IDEReducer from './modules/IDE/reducer';

const rootReducer = combineReducers({
  IDEReducer,
});

export default rootReducer;
