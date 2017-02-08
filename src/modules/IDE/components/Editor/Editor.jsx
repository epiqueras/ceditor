import { connect } from 'react-redux';

import { changeTheme, changeActiveFile, createNewFile, openFile, storeDoc, setUnsavedChanges, saveAs } from './actions';
import { getTheme, getActiveFilePath, getOpenFiles } from './reducer';

import { addTab } from '../FileTabs/actions';
import { getFileTabs } from '../FileTabs/reducer';

import TextEditor from './components/TextEditor';

function mapStateToProps(state) {
  return {
    theme: getTheme(state),
    activeFilePath: getActiveFilePath(state),
    openFiles: getOpenFiles(state),
    fileTabs: getFileTabs(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doChangeTheme: theme => dispatch(changeTheme(theme)),
    doChangeActiveFile: filePath => dispatch(changeActiveFile(filePath)),
    doCreateNewFile: (fileName, filePath) => dispatch(createNewFile(fileName, filePath)),
    doOpenFile: (fileName, filePath) => dispatch(openFile(fileName, filePath)),
    doStoreDoc: (filePath, value, history) => dispatch(storeDoc(filePath, value, history)),
    doSetUnsavedChanges: (filePath, unsavedChanges, saveFile, data) =>
      dispatch(setUnsavedChanges(filePath, unsavedChanges, saveFile, data)),
    doSaveAs: (prevFilePath, filePath, data) => dispatch(saveAs(prevFilePath, filePath, data)),
    doAddTab: (fileName, filePath) => dispatch(addTab(fileName, filePath)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
