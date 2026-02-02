import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  CardFooter,
} from '@nextui-org/react';

interface ControlDataCardProps {
  title: string;
  processVariableValue: number;
  processVariable: string;
  setPoint: number;
  output: number;
  mode: 'AUTO' | 'MANUAL' | 'JOGGING';
}

export const ControlDataCard: React.FC<ControlDataCardProps> = ({
  title,
  processVariable,
  processVariableValue,
  setPoint,
  output,
  mode,
}) => {
  return (
    <Card
      className="max-h-[230px]  min-h-[80px] min-w-[100px] max-w-[180px] rounded-none border border-nav-button-border bg-nav-button-fg"
      radius="none"
    >
      <CardHeader className="flex gap-0 p-1">
        <div className="flex flex-col">
          <p className="text-xs">{title}</p>
        </div>
      </CardHeader>
      <Divider className="bg-separator-line" />
      <CardBody className="p-1">
        <div className="flex flex-col gap-0">
          <p className="text-xs">
            {' '}
            PV{' '}
            <span className="font-bold text-data-fg">
              {typeof processVariableValue === 'number' ? processVariableValue.toFixed(2) : processVariableValue}
            </span>{' '}
            {processVariable}
          </p>
          <p className="text-xs">
            {' '}
            SP <span className="font-bold text-label-fg">{typeof setPoint === 'number' ? setPoint.toFixed(2) : setPoint}</span>
          </p>
          <p className="text-xs">
            {' '}
            O <span className="font-bold text-data-fg">{typeof output === 'number' ? output.toFixed(2) : output}</span> %
          </p>
        </div>
      </CardBody>
      <Divider className="bg-separator-line" />
      <CardFooter className="p-1">
        <div className="flex flex-col">
          <p className="text-xs font-bold text-data-fg">{mode}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
