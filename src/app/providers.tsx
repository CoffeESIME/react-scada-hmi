// app/providers.tsx
'use client';

import { NextUIProvider } from '@nextui-org/react';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <NextUIProvider>{children}</NextUIProvider>;
}
