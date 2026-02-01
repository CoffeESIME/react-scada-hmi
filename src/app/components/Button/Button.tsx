import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { useScadaMode } from '@/contexts/ScadaModeContext';


type ButtonProps = {
  label: string | string[]; // Puede ser array si viene de legacy o string normal
  handlePress: () => void;
  actionType: 'NAVIGATE' | 'WRITE_TAG' | 'SETPOINT_INPUT';
  handleCommit?: (value: string | number) => void;
};

export const CustomButton: React.FC<ButtonProps> = ({
  label,
  handlePress,
  actionType,
  handleCommit
}) => {
  const { isEditMode } = useScadaMode();
  const [inputValue, setInputValue] = React.useState('');

  const displayLabel = Array.isArray(label) ? label.join(' ') : label;

  // Si es INPUT y estamos en RUNTIME
  if (actionType === 'SETPOINT_INPUT' && !isEditMode) {
    return (
      <div className="flex flex-col gap-1 items-center bg-nav-button-fg p-2 rounded border-2 border-nav-button-border min-w-[120px]">
        <span className="text-xs text-white/70">{displayLabel}</span>
        <input
          className="w-full h-8 px-2 text-black rounded text-center"
          placeholder="Valor..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommit?.(inputValue);
              setInputValue(''); // Limpiar tras enviar
            }
          }}
          // Para evitar que pulsaciones de teclas afecten el canvas si el foco "escapa"
          onPointerDown={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <Button
      onPress={handlePress}
      isDisabled={isEditMode} // Deshabilitar visualmente en edit mode
      className={`border-3 border-nav-button-border bg-nav-button-fg min-w-[100px] ${isEditMode ? 'pointer-events-none opacity-80' : ''}`}
    >
      {displayLabel || 'Botón'}
    </Button>
  );
};
