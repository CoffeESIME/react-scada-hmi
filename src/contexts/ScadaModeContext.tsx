'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { WriteTagTarget } from '@/app/components/WriteTagModal';

interface ScadaModeContextType {
    isEditMode: boolean;
    /**
     * Sólo disponible en el Runtime (view page).
     * Abre el WriteTagModal (Admin) o muestra error persistente (Operator).
     * Es undefined en modo Edición — los nodos no deben llamarlo en ese contexto.
     */
    onWriteRequest?: (target: WriteTagTarget) => void;
}

const ScadaModeContext = createContext<ScadaModeContextType>({
    isEditMode: false,
    onWriteRequest: undefined,
});

export const useScadaMode = () => useContext(ScadaModeContext);

interface ScadaModeProviderProps {
    children: ReactNode;
    value?: ScadaModeContextType;
    isEditMode?: boolean;
    onWriteRequest?: (target: WriteTagTarget) => void;
}

export function ScadaModeProvider({ children, value, isEditMode, onWriteRequest }: ScadaModeProviderProps) {
    const contextValue = value || {
        isEditMode: isEditMode ?? false,
        onWriteRequest,
    };

    return (
        <ScadaModeContext.Provider value={contextValue}>
            {children}
        </ScadaModeContext.Provider>
    );
}

export default ScadaModeContext;
