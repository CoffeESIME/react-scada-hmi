import { CustomButton } from './Button';
import { NodeProps } from 'reactflow';
import React, { useEffect, useState } from 'react';
import { useNodeStore } from '@/app/store/nodes';
interface CustomButtonData {
  label: string;
}

type CustomButtonNodeProps = NodeProps & {
  data: CustomButtonData;
};

export const ButtonNode: React.FC<CustomButtonNodeProps> = ({ data }) => {
  return <CustomButton handlePress={()=>{}} label={data.label} />;
};
