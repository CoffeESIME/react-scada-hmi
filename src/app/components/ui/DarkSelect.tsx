'use client';

/**
 * DarkSelect — Wrapper de NextUI Select con tema oscuro forzado.
 *
 * NextUI usa variables CSS internas (--nextui-content1) para el color de
 * fondo de los popovers. Sin un tema dark configurado en nextui(), los
 * selectores CSS globales no pueden sobreescribir esas variables.
 *
 * La solución correcta de NextUI v2 es usar la prop `classNames` para
 * inyectar las clases Tailwind directamente en cada slot del componente.
 *
 * Uso:
 *   <DarkSelect label="Protocolo" selectedKeys={...} onSelectionChange={...}>
 *     <SelectItem key="modbus">Modbus TCP</SelectItem>
 *   </DarkSelect>
 */

import { Select, SelectProps } from '@nextui-org/react';
import React from 'react';

type DarkSelectProps = SelectProps;

const darkSelectClassNames: SelectProps['classNames'] = {
  // El trigger (el "botón" cerrado)
  trigger: [
    'bg-slate-800',
    'border',
    'border-slate-600',
    'hover:bg-slate-700',
    'data-[focus=true]:border-blue-500',
  ].join(' '),
  // El texto del valor seleccionado dentro del trigger
  value: 'text-slate-100',
  // El label flotante
  label: 'text-slate-400 group-data-[filled=true]:text-slate-400',
  // La lista desplegable (el popover)
  listboxWrapper: 'bg-slate-800 border border-slate-600 rounded-lg shadow-xl',
  // Cada opción individual
  listbox: 'bg-slate-800',
  // El ícono de la flecha
  selectorIcon: 'text-slate-400',
  // Mensaje de error
  errorMessage: 'text-red-400',
  // Descripción de ayuda
  description: 'text-slate-500',
  innerWrapper: 'bg-transparent',
  popoverContent: 'bg-slate-800 border border-slate-600',
};

export const DarkSelect: React.FC<DarkSelectProps> = ({ children, classNames, ...props }) => {
  return (
    <Select
      classNames={{
        ...darkSelectClassNames,
        ...classNames, // Permite sobreescribir slots específicos si es necesario
      }}
      {...props}
    >
      {children}
    </Select>
  );
};
