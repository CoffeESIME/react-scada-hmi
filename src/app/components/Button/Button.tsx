import React from 'react';
import { Button } from '@nextui-org/react';
import { useScadaMode } from '@/contexts/ScadaModeContext';

type ButtonProps = {
  label: string | string[];
  handlePress: () => void;
};

export const CustomButton: React.FC<ButtonProps> = ({ label, handlePress }) => {
  const { isEditMode } = useScadaMode();

  const displayLabel = Array.isArray(label) ? label.join(' ') : label;

  return (
    <div className={`nodrag ${isEditMode ? 'pointer-events-none opacity-80' : ''}`} onClick={handlePress}>
      <Button
        onPress={handlePress}
        isDisabled={isEditMode}
        className="border-3 border-nav-button-border bg-nav-button-fg min-w-[100px]"
      >
        {displayLabel || 'Botón'}
      </Button>
    </div>
  );
};
