'use client';

import { useTagData, TagValue } from '@/app/store/tagStore';
import { useScadaMode } from '@/contexts/ScadaModeContext';

export interface NodeLiveData extends Partial<TagValue> {
    isLive: boolean;
    value: any;
}

/**
 * useNodeLiveData - Unified hook for accessing SCADA tag data safe for Editor/Runtime
 * 
 * @param tagId - The ID of the tag to subscribe to
 * @param initialValue - Optional fallback value
 * @returns Safe data object with value, quality, implementation details hidden
 */
export function useNodeLiveData(tagId?: number, initialValue: any = 0): NodeLiveData {
    const { isEditMode } = useScadaMode();

    // Always call the hook, but we modify return based on mode
    // Note: useTagData subscribes to the specific tagId selector
    const liveData = useTagData(tagId);

    // Safety checks:
    // 1. If we are in Edit Mode, return static dummy data
    // 2. If no tagId provided, return static dummy data
    if (isEditMode || tagId === undefined) {
        return {
            value: initialValue,
            quality: 'GOOD',
            timestamp: new Date().toISOString(),
            isLive: false
        };
    }

    // Runtime Mode: Return live data if available, or fallback
    if (!liveData) {
        return {
            value: initialValue,
            quality: 'UNCERTAIN',
            timestamp: new Date().toISOString(),
            isLive: false // Not yet received
        };
    }

    return {
        ...liveData,
        isLive: true
    };
}
