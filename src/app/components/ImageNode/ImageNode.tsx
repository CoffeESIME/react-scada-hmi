import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export interface ImageNodeData {
    src?: string;
    width?: number;
    handles?: any[];
}

function ImageNode({ data, selected }: NodeProps<ImageNodeData>) {
    const width = data?.width ?? 100;
    const src = data?.src;

    return (
        <div
            style={{
                position: 'relative',
                width: `${width}px`,
                outline: selected ? '2px solid #6366f1' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {src ? (
                <img
                    src={`/images/${src}`}
                    alt="SCADA Asset"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        pointerEvents: 'none', // Previene problemas de drag and drop con la imagen nativa
                    }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: `${width}px`, // Cuadrado placeholder
                    backgroundColor: '#1f1f38',
                    border: '1px dashed #666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    fontSize: '12px'
                }}>
                    No Image
                </div>
            )}
            
            {/* Opcional: renderizar handles si se necesitan */}
            {data?.handles?.map((h: any, i: number) => (
                <Handle
                    key={`${h.id || 'h'}-${i}`}
                    type={h.type}
                    position={h.position}
                    id={h.id}
                    style={h.style}
                    isConnectable={true}
                />
            ))}
        </div>
    );
}

export default memo(ImageNode);
