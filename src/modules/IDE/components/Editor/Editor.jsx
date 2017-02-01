import { connect } from 'react-redux';

import { changeTheme, changeActiveFile, createNewFile, openFile } from './actions';
import { getTheme, getActiveFilePath, getOpenFiles } from './reducer';

import { addTab } from '../FileTabs/actions';

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
    doCreateNewFile: (fileName, filePath) => dispatch(createNewFile(fileName, filePath)),
    doOpenFile: (fileName, filePath) => dispatch(openFile(fileName, filePath)),
    doAddTab: (fileName, filePath) => dispatch(addTab(fileName, filePath)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
