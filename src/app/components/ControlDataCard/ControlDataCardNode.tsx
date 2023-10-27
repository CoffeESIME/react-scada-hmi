import { Node, NodeProps, Handle, Position } from 'reactflow';
import { ControlDataCard } from './ControlDataCard';

type controlDataCardNode = {
  title: string;
  processVariableValue: number;
  processVariable: string;
  setPoint: number;
  output: number;
  mode: 'AUTO' | 'MANUAL' | 'JOGGING';
  handleDataSource: {
    position: Position;
    id: string;
    style: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  };
  handleDataTarget: {
    position: Position;
    id: string;
    style: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  };
};

type ControlDataCardNodeProps = NodeProps & {
  data: controlDataCardNode;
};

export const ControlDataCardNode: React.FC<ControlDataCardNodeProps> = ({
  data,
}) => {
  return (
    <>
      <Handle
        type='source'
        position={data.handleDataSource.position}
        id={data.handleDataSource.id}
        style={data.handleDataSource.style}
        className='border-0 bg-process-connector'
      />
      <Handle
        type='target'
        position={data.handleDataTarget.position}
        id={data.handleDataTarget.id}
        style={data.handleDataTarget.style}
        className='border-0 bg-process-connector'
      />
      <ControlDataCard
        title={data.title}
        processVariable={data.processVariable}
        processVariableValue={data.processVariableValue}
        mode={data.mode}
        setPoint={data.setPoint}
        output={data.output}
      />
    </>
  );
};
