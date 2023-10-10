import { Node, NodeProps } from 'reactflow';
import { ControlDataCard } from './ControlDataCard';

type controlDataCardNode = {
    title: string;
    processVariableValue: number;
    processVariable: string;
    setPoint: number;
    output: number;
    mode: "AUTO" | "MANUAL" | "JOGGING";
};

type ControlDataCardNodeProps = NodeProps & {
    data: controlDataCardNode;
};

export const ControlDataCardNode: React.FC<ControlDataCardNodeProps> = ({ data }) => {
    return <ControlDataCard title={data.title} processVariable={data.processVariable} processVariableValue={data.processVariableValue} mode={data.mode} setPoint={data.setPoint} output={data.output} />;
}