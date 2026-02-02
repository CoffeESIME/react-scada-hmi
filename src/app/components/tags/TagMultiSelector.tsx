'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { api } from '@/lib/api';
import { Tag, TagListResponse } from './schemas';

export interface TagMultiSelectorProps {
    /** Currently selected tag IDs */
    value?: number[];
    /** Callback when selection changes */
    onChange: (tagIds: number[]) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Label for the field */
    label?: string;
    /** Additional CSS class */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

export function TagMultiSelector({
    value = [],
    onChange,
    placeholder = 'Seleccionar tags...',
    label = 'Tags',
    className = '',
    size = 'md',
}: TagMultiSelectorProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const MAX_TAGS = 4;
    const isLimitReached = value.length >= MAX_TAGS;

    // Derived disabled keys
    const disabledKeys = useMemo(() => {
        if (!isLimitReached) return [];
        // Disable all tags that are NOT currently selected
        return tags
            .filter(t => !value.includes(t.id))
            .map(t => t.id.toString());
    }, [isLimitReached, tags, value]);


    // Fetch tags on mount
    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                // Fetch all tags (limit 100 for now)
                const params = new URLSearchParams({
                    page_size: '100',
                    is_enabled: 'true',
                });
                const response = await api.get<TagListResponse>(`/tags/?${params}`);
                setTags(response.data.items);
            } catch (err) {
                console.error('Error fetching tags:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, []);

    // Handle selection change
    const handleSelectionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) {
            onChange([]);
            return;
        }

        const ids = val.split(',').map(Number).filter(n => !isNaN(n));

        // Extra safety check
        if (ids.length > MAX_TAGS) {
            return;
        }

        onChange(ids);
    }, [onChange]);

    return (
        <Select
            label={label}
            placeholder={placeholder}
            selectionMode="multiple"
            selectedKeys={new Set(value.map(String))}
            disabledKeys={disabledKeys}
            onChange={handleSelectionChange}
            isLoading={isLoading}
            size={size}
            className={className}
            description={isLimitReached ? "Máximo 4 tags alcanzado" : undefined}
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
                        </span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
}
