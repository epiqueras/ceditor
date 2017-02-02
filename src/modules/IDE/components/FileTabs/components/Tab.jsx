/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import ItemTypes from './ItemTypes';

const tabSource = {
  beginDrag(props) {
    return {
      filePath: props.file.path,
      originalIndex: props.findTab(props.file.path).tabIndex,
    };
  },

  endDrag(props, monitor) {
    const { filePath: droppedFilePath, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.doMoveTab(droppedFilePath, originalIndex);
    }
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
    isDragging: monitor.isDragging(),
  };
}

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

// It might be better to make this a stateful component
// to avoid the arrow function in the onClick event
const Tab = ({
  connectDragSource,
  connectDropTarget,
  isDragging,
  active,
  file,
  removeTabAndCloseFile,
  doChangeActiveFile,
}) => connectDragSource(connectDropTarget(
  <li
    className={active ? 'active' : ''}
    style={{ opacity: isDragging ? 0 : 1 }}
    onClick={() => !active ? doChangeActiveFile(file.path) : ''}
  >
    {file.name}{file.unsavedChanges ? '*' : ''}
    <i
      className="material-icons close-icon"
      onClick={() => removeTabAndCloseFile(file.path)}
    >
      close
    </i>
  </li>,
  { dropEffect: 'move' },
));

Tab.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
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
