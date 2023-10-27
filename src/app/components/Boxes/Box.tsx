import React from 'react';
import { Card, CardBody } from '@nextui-org/react';

export const BoxCard: React.FC = ({}) => {
  return (
    <Card className='h-80 w-80 border-2 border-nav-button-border bg-transparent'>
      <CardBody className='flex flex-col items-center justify-center p-1'>
        <div className='flex flex-col gap-0'></div>
      </CardBody>
    </Card>
  );
};
