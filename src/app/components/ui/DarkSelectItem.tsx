'use client';

import type { SelectItemProps } from '@nextui-org/react';

export const darkItemClassNames: SelectItemProps['classNames'] = {
  base: [
    'text-slate-100',
    'data-[hover=true]:bg-blue-600',
    'data-[hover=true]:text-white',
    'data-[selected=true]:bg-blue-700',
    'data-[selected=true]:text-white',
    'data-[focus=true]:bg-blue-600',
    'data-[focus=true]:text-white',
  ].join(' '),
};
