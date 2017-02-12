/* global window */
/* global confirm */
import React, { Component, PropTypes } from 'react';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { remote } from 'electron';

import ItemTypes from './ItemTypes';
import Tab from './Tab';
import DraggedTabLayer from './DraggedTabLayer';

const { dialog } = remote;

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
    this.removeTabAndCloseFile = this.removeTabAndCloseFile.bind(this);
    window.onbeforeunload = () => {
      if (this.props.fileTabs.find(file => file.unsavedChanges)) {
        return !dialog.showMessageBox(remote.getCurrentWindow(),
          { message: 'You have unsaved changes, are you sure you wish to quit?', buttons: ['Confirm', 'Cancel'] }) ? null : true;
      }
      return null;
    };
  }

  findTab(filePath) {
    const { fileTabs } = this.props;
    const tab = fileTabs.find(file => file.path === filePath);
    return {
      tab,
      tabIndex: fileTabs.indexOf(tab),
    };
  }

  removeTabAndCloseFile(filePath) {
    const { doRemoveTab, doCloseFile } = this.props;
    doRemoveTab(filePath);
    doCloseFile(filePath);
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
          removeTabAndCloseFile={this.removeTabAndCloseFile}
          doMoveTab={doMoveTab}
          doChangeActiveFile={doChangeActiveFile}
        />
      );
    });
    return connectDropTarget(
      <div style={{ position: 'fixed', width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 100 }}>
        <div style={{ pointerEvents: 'auto' }} className="file-tabs-container CodeMirror">
          <ul>
            {tabs}
            <DraggedTabLayer />
          </ul>
        </div>
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
      unsavedChanges: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  doMoveTab: PropTypes.func.isRequired,
  doRemoveTab: PropTypes.func.isRequired,
  doChangeActiveFile: PropTypes.func.isRequired,
  doCloseFile: PropTypes.func.isRequired,
};

export default
  DragDropContext(HTML5Backend)(DropTarget(ItemTypes.TAB, tabTarget, collect)(TabsList));
