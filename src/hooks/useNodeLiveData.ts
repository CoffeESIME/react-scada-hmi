'use client';

import { useTagData, TagValue } from '@/app/store/tagStore';
import { useScadaMode } from '@/contexts/ScadaModeContext';

export interface NodeLiveData extends Partial<TagValue> {
    isLive: boolean;
    value: any;
}


export function useNodeLiveData(tagId?: number, initialValue: any = 0): NodeLiveData {
    const { isEditMode } = useScadaMode();

    const liveData = useTagData(tagId);

    if (isEditMode || tagId === undefined) {
        return {
            value: initialValue,
            quality: 'GOOD',
            timestamp: new Date().toISOString(),
            isLive: false
        };
    }

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
