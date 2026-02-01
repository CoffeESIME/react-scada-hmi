'use client';

import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useScadaMode } from '@/contexts/ScadaModeContext';

type CardDataProps = {
  label: string[];
  onPress?: () => void;
};

export const CardData: React.FC<CardDataProps> = ({ label, onPress }) => {
  const { isEditMode } = useScadaMode();

  return (
    <Card
      className={`z-40 max-h-[230px] min-h-[80px] min-w-[120px] max-w-[180px] border-2 border-nav-button-border bg-nav-button-fg hover:bg-nav-button-fg/80 transition-colors cursor-pointer ${isEditMode ? 'pointer-events-none' : ''}`}
      onPress={onPress}
      isPressable={!isEditMode}
    >
      <CardBody className="flex flex-col items-center justify-center p-1">
        <div className="flex flex-col gap-0">
          {label.map((strEl, index) => (
            <p key={index} className="text-small">
              {strEl}
            </p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
