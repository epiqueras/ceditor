import { connect } from 'react-redux';

import { changeActiveFile } from './actions';
import { getActiveFilePath, getOpenFiles } from './reducer';

import TextEditor from './components/TextEditor';

function mapStateToProps(state) {
  return {
    activeFilePath: getActiveFilePath(state),
    openFiles: getOpenFiles(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doChangeActiveFile: filePath => dispatch(changeActiveFile(filePath)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
