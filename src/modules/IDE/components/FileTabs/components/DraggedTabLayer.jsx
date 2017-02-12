import React, { Component, PropTypes } from 'react';
import { DragLayer } from 'react-dnd';

function collect(monitor) {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

class DraggedTabLayer extends Component {
  render() {
    const { item, currentOffset, isDragging } = this.props;
    if (!isDragging) return null;
    let style = {};
    if (!currentOffset) style = { display: 'none' };
    else {
      const { x, y } = currentOffset;
      style = { transform: `translate(${x}px, ${y}px)` };
    }
    const { fileName, fileUnsavedChanges } = item;
    return (
      <div style={{ position: 'fixed', width: '100vw', height: '100vh', pointerEvents: 'none' }}>
        <li
          className="active"
          style={{ ...style, cursor: '-webkit-grabbing', position: 'fixed', left: 0, top: 0 }}
        >
          {fileName}{fileUnsavedChanges ? '*' : ''}
        </li>
      </div>
    );
  }
}


DraggedTabLayer.propTypes = {
  item: PropTypes.shape({
    filePath: PropTypes.string,
    originalIndex: PropTypes.number,
    fileName: PropTypes.string,
    fileUnsavedChanges: PropTypes.bool,
  }),
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  isDragging: PropTypes.bool.isRequired,
};

DraggedTabLayer.defaultProps = {
  item: { fileName: '', fileUnsavedChanges: '' },
  currentOffset: false,
};

export default DragLayer(collect)(DraggedTabLayer);
