'use client';

/**
 * DarkSelectItem — NO debe ser un wrapper de componente React.
 * 
 * React Stately (usado por NextUI internamente) requiere que los SelectItem
 * sean hijos directos de Select. Envolver SelectItem en otro componente
 * rompe la colección y causa: "type.getCollectionNode is not a function".
 *
 * Exportamos solo el objeto classNames para usarlo directamente en cada
 * <SelectItem classNames={darkItemClassNames}>.
 */
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
