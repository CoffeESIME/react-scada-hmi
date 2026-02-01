'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface ScadaModeContextType {
    isEditMode: boolean;
}

const ScadaModeContext = createContext<ScadaModeContextType>({
    isEditMode: false,
});

export const useScadaMode = () => useContext(ScadaModeContext);

interface ScadaModeProviderProps {
    children: ReactNode;
    value?: ScadaModeContextType;
    isEditMode?: boolean; // Convenience prop
}

export function ScadaModeProvider({ children, value, isEditMode }: ScadaModeProviderProps) {
    // Priority: value prop > isEditMode prop > default false
    const contextValue = value || { isEditMode: isEditMode ?? false };

    return (
        <ScadaModeContext.Provider value={contextValue}>
            {children}
        </ScadaModeContext.Provider>
    );
}

export default ScadaModeContext;
