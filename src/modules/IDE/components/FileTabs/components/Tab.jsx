/* global document */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ipcRenderer } from 'electron';

import ItemTypes from './ItemTypes';

const tabSource = {
  beginDrag(props) {
    const fileDropStyle = document.getElementById('file-drop').style;
    fileDropStyle.pointerEvents = 'none';
    fileDropStyle.zIndex = -1;
    return {
      filePath: props.file.path,
      originalIndex: props.findTab(props.file.path).tabIndex,
      fileName: props.file.name,
      fileUnsavedChanges: props.file.unsavedChanges,
    };
  },

  endDrag(props, monitor) {
    const { filePath: droppedFilePath, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) { // If the tab was dropped outside the tab list, cancel the move
      ipcRenderer.sendSync('draggedTabOut', droppedFilePath);
      props.doMoveTab(droppedFilePath, originalIndex);
    }

    const fileDropStyle = document.getElementById('file-drop').style;
    fileDropStyle.pointerEvents = 'auto';
    fileDropStyle.zIndex = 'initial';
  },
};

const tabTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const { filePath: draggedFilePath } = monitor.getItem();
    const { path: overFilePath } = props.file;

    if (draggedFilePath !== overFilePath) {
      const { tabIndex: overIndex } = props.findTab(overFilePath);
      props.doMoveTab(draggedFilePath, overIndex);
    }
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

class Tab extends Component {
  constructor(props) {
    super(props);
    this.changeActive = this.changeActive.bind(this);
    this.closeFile = this.closeFile.bind(this);
  }

  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview(getEmptyImage());
  }

  changeActive() {
    const { active, file, doChangeActiveFile } = this.props;
    if (!active) doChangeActiveFile(file.path);
  }

  closeFile(event) {
    const { file, removeTabAndCloseFile } = this.props;
    event.stopPropagation();
    removeTabAndCloseFile(file.path);
  }

  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      active,
      file,
    } = this.props;
    return (
      connectDragSource(connectDropTarget(
        <li
          className={active ? 'active' : ''}
          style={{ opacity: isDragging ? 0 : 1, cursor: isDragging ? '-webkit-grabbing' : '-webkit-grab' }}
          onClick={this.changeActive}
        >
          {file.name}{file.unsavedChanges ? '*' : ''}
          <i
            className="material-icons close-icon"
            onClick={this.closeFile}
          >
            close
          </i>
        </li>,
        { dropEffect: 'move' },
      ))
    );
  }
}

Tab.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    unsavedChanges: PropTypes.bool.isRequired,
  }).isRequired,
  findTab: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  removeTabAndCloseFile: PropTypes.func.isRequired,
  doMoveTab: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  doChangeActiveFile: PropTypes.func.isRequired,
};

export default DropTarget(ItemTypes.TAB, tabTarget,
  collectTarget)(DragSource(ItemTypes.TAB, tabSource, collectSource)(Tab));
