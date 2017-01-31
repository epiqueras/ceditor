import { connect } from 'react-redux';

import { changeTheme, changeActiveFile } from './actions';
import { getTheme, getActiveFilePath, getOpenFiles } from './reducer';

import TextEditor from './components/TextEditor';

function mapStateToProps(state) {
  return {
    theme: getTheme(state),
    activeFilePath: getActiveFilePath(state),
    openFiles: getOpenFiles(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doChangeTheme: (theme, myCodeMirror, upgradeBackground) =>
      dispatch(changeTheme(theme, myCodeMirror, upgradeBackground)),
    doChangeActiveFile: filePath => dispatch(changeActiveFile(filePath)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
