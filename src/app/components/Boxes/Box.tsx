import React from 'react';
import { Card, CardBody } from '@nextui-org/react';

type BoxCardProps = {
  width?: number;
  height?: number;
};

export const BoxCard: React.FC<BoxCardProps> = ({ width = 320, height = 320 }) => {
  return (
    <Card 
      className="border-2 border-nav-button-border bg-transparent"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <CardBody className="flex flex-col items-center justify-center p-1">
        <div className="flex flex-col gap-0"></div>
      </CardBody>
    </Card>
  );
};
