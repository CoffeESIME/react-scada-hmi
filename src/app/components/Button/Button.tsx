import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { useScadaMode } from '@/contexts/ScadaModeContext';

type ButtonProps = {
  label: string[];
  handlePress: () => void;
};

export const CustomButton: React.FC<ButtonProps> = ({ label, handlePress }) => {
  const { isEditMode } = useScadaMode();
  return (
    <Button
      onPress={handlePress}
      className={`border-3 border-nav-button-border bg-nav-button-fg ${isEditMode ? 'pointer-events-none' : ''}`}
    >
      {label}
    </Button>
  );
};
