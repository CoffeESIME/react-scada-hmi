import React from 'react';

type DraggableNodeProps = {
  type: string;
  onDragStart: (event: React.DragEvent, type: string) => void;
};

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, onDragStart }) => (
  <div draggable={true} onDragStart={(e) => onDragStart(e, type)}>
    {type}
  </div>
);

type NodeMenuProps = {
  onNodeSelect: (type: string) => void;
};

const NodeMenu: React.FC<NodeMenuProps> = ({ onNodeSelect }) => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/reactflow', type);
  };

  return (
    <div>
      <DraggableNode type='type1' onDragStart={handleDragStart} />
      <DraggableNode type='type2' onDragStart={handleDragStart} />
      {/* Add more node types as needed */}
    </div>
  );
};

export default NodeMenu;
