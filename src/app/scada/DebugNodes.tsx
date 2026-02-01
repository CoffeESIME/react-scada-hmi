import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const handleStyle = { width: 8, height: 8, background: '#777' };

// Simple Circle Node (e.g., Valve, Motor)
export const DebugCircleNode = memo(({ data, id }: NodeProps) => {
    return (
        <div style={{
            padding: '10px',
            borderRadius: '50%',
            border: '2px solid #555',
            background: '#eee',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            textAlign: 'center',
            color: '#333'
        }}>
            <Handle type="target" position={Position.Top} style={handleStyle} />
            <Handle type="target" position={Position.Left} style={handleStyle} />
            <div>
                <strong>{data.label || id}</strong>
                <br />
                {data.tagId ? `Tag: ${data.tagId}` : ''}
            </div>
            <Handle type="source" position={Position.Right} style={handleStyle} />
            <Handle type="source" position={Position.Bottom} style={handleStyle} />
        </div>
    );
});

// Simple Rectangle Node (e.g., Gauge, Tank, Card)
export const DebugRectNode = memo(({ data, id }: NodeProps) => {
    return (
        <div style={{
            padding: '10px',
            borderRadius: '4px',
            border: '2px solid #555',
            background: '#e0e7ff',
            minWidth: '100px',
            minHeight: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            textAlign: 'center',
            color: '#333'
        }}>
            <Handle type="target" position={Position.Top} style={handleStyle} />
            <Handle type="target" position={Position.Left} style={handleStyle} />
            <div>
                <strong>{data.label || id}</strong>
                <br />
                {data.tagId ? `Tag: ${data.tagId}` : ''}
            </div>
            <Handle type="source" position={Position.Right} style={handleStyle} />
            <Handle type="source" position={Position.Bottom} style={handleStyle} />
        </div>
    );
});

// Simple Triangle/Alarm Node
export const DebugTriangleNode = memo(({ data, id }: NodeProps) => {
    return (
        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
            <Handle type="target" position={Position.Top} style={handleStyle} />

            {/* Visual Triangle */}
            <div style={{
                width: 0,
                height: 0,
                borderLeft: '30px solid transparent',
                borderRight: '30px solid transparent',
                borderBottom: '60px solid #fecaca',
                position: 'absolute',
                top: 0,
                left: 0
            }} />

            <div style={{
                position: 'absolute',
                top: '30px',
                left: '0',
                width: '100%',
                textAlign: 'center',
                fontSize: '8px',
                color: '#333'
            }}>
                {data.label || 'Alarm'}
            </div>

            <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, top: 'auto', bottom: -4 }} />
        </div>
    );
});
