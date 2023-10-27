import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';

type ButtonProps = {
  label: string[];
  handlePress: () => void;
};

export const CustomButton: React.FC<ButtonProps> = ({ label, handlePress }) => {
  return (
    <Button
      onPress={handlePress}
      className='border-3 border-nav-button-border bg-nav-button-fg '
    >
      {label}
    </Button>
  );
};
