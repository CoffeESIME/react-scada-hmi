'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { api } from '@/lib/api';

export interface ScreenData {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_home: boolean;
}

export interface ScreenSelectorProps {
    /** Currently selected screen ID */
    value?: number | string | null;
    /** Callback when selection changes */
    onChange: (screenId: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Label for the field */
    label?: string;
    /** Whether the field is disabled */
    isDisabled?: boolean;
    /** Whether the field is required */
    isRequired?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * ScreenSelector - Reusable Select for choosing SCADA Screens
 */
export function ScreenSelector({
    value,
    onChange,
    placeholder = 'Seleccionar pantalla...',
    label = 'Pantalla Destino',
    isDisabled = false,
    isRequired = false,
    className = '',
    size = 'md',
}: ScreenSelectorProps) {
    const [screens, setScreens] = useState<ScreenData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch screens on mount
    useEffect(() => {
        const fetchScreens = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Endpoint returns a lightweight list (no layout_data)
                const response = await api.get<ScreenData[]>('/screens/');
                setScreens(response.data);
            } catch (err: any) {
                console.error('Error fetching screens:', err);
                setError(err.message || 'Error al cargar pantallas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchScreens();
    }, []);

    // Find selected screen for display
    const selectedScreen = useMemo(() => {
        if (!value) return null;
        return screens.find(s => s.id.toString() === value.toString() || s.slug === value) || null;
    }, [value, screens]);

    // Handle selection change
    const handleSelectionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        onChange(selectedValue);
    }, [onChange]);

    if (error) {
        return (
            <div className={`text-red-500 text-sm p-2 ${className}`}>
                Error: {error}
            </div>
        );
    }

    // Usamos el ID como clave en lugar del slug por si el slug cambia en un futuro
    const displayValue = selectedScreen ? selectedScreen.id.toString() : (value ? value.toString() : '');

    return (
        <Select
            label={label}
            placeholder={placeholder}
            selectedKeys={displayValue ? [displayValue] : []}
            onChange={handleSelectionChange}
            isLoading={isLoading}
            isDisabled={isDisabled || isLoading}
            isRequired={isRequired}
            size={size}
            className={className}
            classNames={{
                base: "dark",
                trigger: "bg-[#1f1f38] data-[hover=true]:bg-[#2d2d50] border border-[#3a3a5c]",
                value: "text-gray-200 font-medium",
                popover: "bg-[#16213e] border border-[#3a3a5c]",
                listbox: "bg-[#16213e]",
                listboxWrapper: "bg-[#16213e]",
            }}
            listboxProps={{
                itemClasses: {
                    base: [
                        "rounded-md",
                        "text-gray-300",
                        "transition-opacity",
                        "data-[hover=true]:text-white",
                        "data-[hover=true]:bg-[#2d2d50]",
                        "data-[selectable=true]:focus:bg-[#2d2d50]",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-[#3a3a5c]",
                    ],
                }
            }}
            description={selectedScreen ? `Slug: ${selectedScreen.slug}` : undefined}
        >
            {screens.map((screen: ScreenData) => (
                <SelectItem
                    key={screen.id.toString()}
                    textValue={screen.name}
                    className="flex flex-col gap-1 py-1"
                >
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-200">{screen.name}</span>
                        <span className="text-xs text-gray-400">
                            {screen.is_home ? '🏠 Home' : 'Pantalla Normal'}
                        </span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
}

export default ScreenSelector;
