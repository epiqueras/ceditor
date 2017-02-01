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
    const tab = fileTabs.find(file => file.path === filePath);
    return {
      tab,
      tabIndex: fileTabs.indexOf(tab),
    };
  }

  render() {
    const {
      connectDropTarget,
      activeFilePath,
      fileTabs,
      doMoveTab,
      doChangeActiveFile,
    } = this.props;
    const tabs = fileTabs.map((file) => {
      const active = file.path === activeFilePath;
      return (
        <Tab
          key={file.path}
          active={active}
          file={file}
          findTab={this.findTab}
          doMoveTab={doMoveTab}
          doChangeActiveFile={doChangeActiveFile}
        />
      );
    });
    return connectDropTarget(
      <div className="file-tabs-container CodeMirror">
        <ul>
          {tabs}
        </ul>
        <button>Run</button>
      </div>,
    );
  }
}

TabsList.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  activeFilePath: PropTypes.string.isRequired,
  fileTabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  doMoveTab: PropTypes.func.isRequired,
  doChangeActiveFile: PropTypes.func.isRequired,
};

export default
  DragDropContext(HTML5Backend)(DropTarget(ItemTypes.TAB, tabTarget, collect)(TabsList));
