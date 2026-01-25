'use client';

import React from 'react';
import AuthGuard from '../components/AuthGuard';

interface ScadaAuthWrapperProps {
    children: React.ReactNode;
}

export default function ScadaAuthWrapper({ children }: ScadaAuthWrapperProps): React.ReactElement {
    return <AuthGuard>{children}</AuthGuard>;
}
