import { NodeProps, Handle, Position } from 'reactflow';
import { ControlDataCard } from './ControlDataCard';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';

type controlDataCardNode = {
  title: string;
  pvTagId?: number;
  spTagId?: number;
  outTagId?: number;
  modeTagId?: number;

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
  const pvData = useNodeLiveData(data.pvTagId);
  const spData = useNodeLiveData(data.spTagId);
  const outData = useNodeLiveData(data.outTagId);
  const modeData = useNodeLiveData(data.modeTagId);
  const currentMode = modeData.value === 1 ? 'AUTO' : 'MANUAL';

  const pvValue = data.pvTagId ? Number(pvData.value ?? 0) : data.processVariableValue;
  const spValue = data.spTagId ? Number(spData.value ?? 0) : data.setPoint;
  const outValue = data.outTagId ? Number(outData.value ?? 0) : data.output;
  const displayMode = data.modeTagId ? currentMode : data.mode;

  return (
    <>
      <Handle
        type="source"
        position={data.handleDataSource.position}
        id={data.handleDataSource.id}
        style={data.handleDataSource.style}
        className="border-0 bg-process-connector"
      />
      <Handle
        type="target"
        position={data.handleDataTarget.position}
        id={data.handleDataTarget.id}
        style={data.handleDataTarget.style}
        className="border-0 bg-process-connector"
      />
      <ControlDataCard
        title={data.title}
        processVariable={data.processVariable}
        processVariableValue={pvValue}
        mode={displayMode}
        setPoint={spValue}
        output={outValue}
      />
    </>
  );
};
