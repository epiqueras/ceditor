import React, { Component, PropTypes } from 'react';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ItemTypes from './ItemTypes';
import Tab from './Tab';

const tabTarget = {
  drop() {
  },
};

function collect(connectDragAndDrop) {
  return {
    connectDropTarget: connectDragAndDrop.dropTarget(),
  };
}

class TabsList extends Component {
  constructor(props) {
    super(props);
    this.findTab = this.findTab.bind(this);
  }

  findTab(filePath) {
    const { fileTabs } = this.props;
    const tab = fileTabs.find(fileInfo => fileInfo.filePath === filePath);
    return {
      tab,
      tabIndex: fileTabs.indexOf(tab),
    };
  }

  render() {
    const { connectDropTarget, fileTabs, doMoveTab } = this.props;
    const tabs = fileTabs.map(fileInfo => (
      <Tab
        key={fileInfo.filePath}
        fileInfo={fileInfo}
        findTab={this.findTab}
        doMoveTab={doMoveTab}
      />
    ));
    return connectDropTarget(
      <div className="file-tabs-container">
        <ul>
          {tabs}
        </ul>
      </div>,
    );
  }
}

TabsList.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  fileTabs: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      filePath: PropTypes.string.isRequired,
    }),
  ).isRequired,
  doMoveTab: PropTypes.func.isRequired,
};

export default
  DragDropContext(HTML5Backend)(DropTarget(ItemTypes.TAB, tabTarget, collect)(TabsList));
