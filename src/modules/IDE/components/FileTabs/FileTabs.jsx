import { connect } from 'react-redux';

import { moveTab } from './actions';
import { getFileTabs } from './reducer';

import { changeActiveFile } from '../Editor/actions';
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
    doChangeActiveFile: filePath => dispatch(changeActiveFile(filePath)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsList);
