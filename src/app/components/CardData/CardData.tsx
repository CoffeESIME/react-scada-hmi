import React from 'react';
import { Card, CardBody } from '@nextui-org/react';

type CardDataProps = {
  label: string[];
};

const handlePress = () => {
  console.log('Pressed');
};

export const CardData: React.FC<CardDataProps> = ({ label }) => {
  return (
    <Card
      className='z-40 max-h-[230px] min-h-[80px] min-w-[120px] max-w-[180px] border-2 border-nav-button-border bg-nav-button-fg'
      onPress={handlePress}
      isPressable
    >
      <CardBody className='flex flex-col items-center justify-center p-1'>
        <div className='flex flex-col gap-0'>
          {label.map((strEl, index) => (
            <p key={index} className='text-small'>
              {strEl}
            </p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
