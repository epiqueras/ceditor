import { connect } from 'react-redux';

import { openREPL, closeREPL } from './actions';
import { getREPLIsOpen } from './reducer';

import Terminal from './components/Terminal';

function mapStateToProps(state) {
  return {
    REPLIsOpen: getREPLIsOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doOpenREPL: () => dispatch(openREPL()),
    doCloseREPL: () => dispatch(closeREPL()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
