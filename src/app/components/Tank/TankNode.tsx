import { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Tank } from './Tank';
import { useTagValue } from '@/app/store/tagStore';

type HandleEl = {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
};

interface TankNodeData {
  /** Tag ID for live data binding (tank level 0-100) */
  tagId?: number;
  handles: HandleEl[];
  /** Static level value (0-100) - used as fallback if tagId is not set */
  level?: number;
  /** Tank dimensions */
  width?: number;
  height?: number;
  /** Tank colors */
  fillColor?: string;
  strokeColor?: string;
}

type TankNodeProps = NodeProps & {
  data: TankNodeData;
};

/**
 * TankNode - React Flow wrapper for Tank component
 * 
 * If tagId is provided, reads live level from tagStore.
 * Otherwise falls back to static data.level prop.
 * 
 * NOTE: The Tank component currently doesn't render a level indicator.
 * This is prepared for future enhancement when level visualization is added.
 */
const TankNode: React.FC<TankNodeProps> = ({ data }) => {
  // Get live level value from tagStore if tagId is set
  const liveLevel = useTagValue(data.tagId, data.level ?? 0);

  // Clamp level to 0-100
  const level = Math.max(0, Math.min(100, Number(liveLevel) || 0));

  return (
    <>
      {data.handles.map((handle: HandleEl) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
          className="border-0 bg-process-connector"
        />
      ))}
      <Tank
        width={data.width}
        height={data.height}
        fillColor={data.fillColor}
        strokeColor={data.strokeColor}
      />
      {/* TODO: Add level indicator when Tank component supports it */}
    </>
  );
};

export default memo(TankNode);
