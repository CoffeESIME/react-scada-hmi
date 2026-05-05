'use client';

import { Select, SelectProps } from '@nextui-org/react';
import React from 'react';

type DarkSelectProps = SelectProps;

const darkSelectClassNames: SelectProps['classNames'] = {
  trigger: [
    'bg-slate-800',
    'border',
    'border-slate-600',
    'hover:bg-slate-700',
    'data-[focus=true]:border-blue-500',
  ].join(' '),
  value: 'text-slate-100',
  label: 'text-slate-400 group-data-[filled=true]:text-slate-400',
  listboxWrapper: 'bg-slate-800 border border-slate-600 rounded-lg shadow-xl',
  listbox: 'bg-slate-800',
  selectorIcon: 'text-slate-400',
  errorMessage: 'text-red-400',
  description: 'text-slate-500',
  innerWrapper: 'bg-transparent',
};

export const DarkSelect: React.FC<DarkSelectProps> = ({ children, classNames, ...props }) => {
  return (
    <Select
      classNames={{
        ...darkSelectClassNames,
        ...classNames,
      }}
      {...props}
    >
      {children}
    </Select>
  );
};
