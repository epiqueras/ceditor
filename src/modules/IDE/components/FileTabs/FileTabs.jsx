import { connect } from 'react-redux';

import { moveTab } from './actions';
import { getFileTabs } from './reducer';

import TabsList from './components/TabsList';

function mapStateToProps(state) {
  return {
    fileTabs: getFileTabs(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doMoveTab: (filePath, toIndex) => dispatch(moveTab(filePath, toIndex)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsList);
