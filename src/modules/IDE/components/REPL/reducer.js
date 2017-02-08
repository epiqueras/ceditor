import { OPEN_REPL, CLOSE_REPL } from './actions';

const initialState = {
  REPLIsOpen: false,
};

const REPLReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_REPL:
      return { ...state, REPLIsOpen: true };
    case CLOSE_REPL:
      return { ...state, REPLIsOpen: false };
    default:
      return state;
  }
};

export const getREPLIsOpen = state => state.IDEReducer.REPLReducer.REPLIsOpen;

export default REPLReducer;
