import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import ItemTypes from './ItemTypes';

const tabSource = {
  beginDrag(props) {
    return {
      filePath: props.filePath,
      originalIndex: props.findTab(props.filePath).tabIndex,
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
    const { filePath: overFilePath } = props;

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

const Tab = ({ fileName, connectDragSource, connectDropTarget, isDragging }) => (
  connectDragSource(connectDropTarget(
    <li style={{ opacity: isDragging ? 0 : 1 }}>{fileName}</li>,
  ))
);

Tab.propTypes = {
  fileName: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  doMoveTab: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  findTab: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default DropTarget(ItemTypes.TAB, tabTarget,
  collectTarget)(DragSource(ItemTypes.TAB, tabSource, collectSource)(Tab));
