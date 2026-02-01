'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Select, SelectItem, Spinner } from '@nextui-org/react';
import { api } from '@/lib/api';
import { Tag, TagListResponse } from './schemas';

export interface TagSelectorProps {
    /** Currently selected tag ID */
    value?: number | null;
    /** Callback when selection changes */
    onChange: (tagId: number | null, tag: Tag | null) => void;
    /** Filter by protocol type */
    filterProtocol?: 'modbus' | 'opcua' | 'mqtt' | 'simulated';
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
 * TagSelector - Reusable Select for choosing SCADA Tags
 * 
 * Features:
 * - Fetches tags from API on mount
 * - Optional protocol filtering
 * - Agnóstico - works in any context (forms, editors, etc.)
 * 
 * @example
 * ```tsx
 * <TagSelector
 *   value={selectedTagId}
 *   onChange={(id, tag) => setSelectedTagId(id)}
 *   filterProtocol="modbus"
 *   label="Select Tag"
 * />
 * ```
 */
export function TagSelector({
    value,
    onChange,
    filterProtocol,
    placeholder = 'Seleccionar tag...',
    label = 'Tag',
    isDisabled = false,
    isRequired = false,
    className = '',
    size = 'md',
}: TagSelectorProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tags on mount
    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    page_size: '100',
                    is_enabled: 'true',
                });

                if (filterProtocol) {
                    params.set('protocol', filterProtocol);
                }

                const response = await api.get<TagListResponse>(`/tags/?${params}`);
                setTags(response.data.items);
            } catch (err: any) {
                console.error('Error fetching tags:', err);
                setError(err.message || 'Error al cargar tags');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, [filterProtocol]);

    // Find selected tag for display
    const selectedTag = useMemo(() => {
        if (!value) return null;
        return tags.find(t => t.id === value) || null;
    }, [value, tags]);

    // Handle selection change
    const handleSelectionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        if (!selectedValue) {
            onChange(null, null);
            return;
        }

        const tagId = Number(selectedValue);
        const tag = tags.find(t => t.id === tagId) || null;
        onChange(tagId, tag);
    }, [tags, onChange]);

    if (error) {
        return (
            <div className={`text-red-500 text-sm p-2 ${className}`}>
                Error: {error}
            </div>
        );
    }

    return (
        <Select
            label={label}
            placeholder={placeholder}
            selectedKeys={value ? [value.toString()] : []}
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
            description={selectedTag ? `${selectedTag.source_protocol.toUpperCase()} • ${selectedTag.mqtt_topic}` : undefined}
        >
            {tags.map((tag: Tag) => (
                <SelectItem
                    key={tag.id.toString()}
                    textValue={tag.name}
                    className="flex flex-col gap-1 py-1"
                >
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-200">{tag.name}</span>
                        <span className="text-xs text-gray-400">
                            {tag.source_protocol.toUpperCase()}
                            {tag.unit && ` • ${tag.unit}`}
                        </span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
}

export default TagSelector;
