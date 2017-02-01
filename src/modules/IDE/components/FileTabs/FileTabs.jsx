import { connect } from 'react-redux';

import { moveTab, removeTab } from './actions';
import { getFileTabs } from './reducer';

import { changeActiveFile, closeFile } from '../Editor/actions';
import { getActiveFilePath } from '../Editor/reducer';

import TabsList from './components/TabsList';

function mapStateToProps(state) {
  return {
    activeFilePath: getActiveFilePath(state),
    fileTabs: getFileTabs(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doMoveTab: (filePath, toIndex) => dispatch(moveTab(filePath, toIndex)),
    doRemoveTab: filePath => dispatch(removeTab(filePath)),
    doChangeActiveFile: filePath => dispatch(changeActiveFile(filePath)),
    doCloseFile: filePath => dispatch(closeFile(filePath)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsList);
