import React from 'react';
import { NodeProps } from 'reactflow';
import { CustomButton } from './Button';
import { NodeActionConfig } from '@/utils/actionTypes';
import { useNodeAction } from '@/hooks/useNodeAction';

export type CustomButtonData = NodeActionConfig & {
  label: string;
};

type CustomButtonNodeProps = NodeProps & {
  data: CustomButtonData;
};

export const ButtonNode: React.FC<CustomButtonNodeProps> = ({ data }) => {
  const { executeAction } = useNodeAction(data);

  return (
    <CustomButton
      label={data.label}
      actionType={data.actionType}
      handlePress={() => executeAction()}
      handleCommit={(val) => executeAction(val)}
    />
  );
};
