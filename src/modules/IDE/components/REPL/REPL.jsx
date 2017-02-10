import { connect } from 'react-redux';

import { openREPL, closeREPL, openModal, closeModal, setCommand } from './actions';
import { getREPLIsOpen, getModalIsOpen, getCommands } from './reducer';

import { getActiveFilePath } from '../Editor/reducer';

import Terminal from './components/Terminal';

function mapStateToProps(state) {
  return {
    REPLIsOpen: getREPLIsOpen(state),
    modalIsOpen: getModalIsOpen(state),
    commands: getCommands(state),
    activeFilePath: getActiveFilePath(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doOpenREPL: () => dispatch(openREPL()),
    doCloseREPL: () => dispatch(closeREPL()),
    doOpenModal: () => dispatch(openModal()),
    doCloseModal: () => dispatch(closeModal()),
    doSetCommand: (commandType, command) => dispatch(setCommand(commandType, command)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
