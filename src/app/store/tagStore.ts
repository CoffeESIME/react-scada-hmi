/**
 * TagStore - Zustand store for live tag values
 * 
 * This store holds real-time values received via MQTT.
 * Nodes subscribe to this store using their tagId to get live updates.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TagValue {
    value: any;
    quality: 'GOOD' | 'BAD' | 'UNCERTAIN';
    timestamp: string;
}

interface TagStore {
    /** Map of tagId -> live value */
    data: Record<number, TagValue>;

    /** Update a tag with full TagValue object */
    updateTag: (tagId: number, tagValue: TagValue) => void;

    /** Quick update of just the value (sets quality to GOOD, timestamp to now) */
    updateTagValue: (tagId: number, value: any) => void;

    /** Update multiple tags at once */
    updateTags: (updates: Record<number, TagValue>) => void;

    /** Clear all tag data */
    clearTags: () => void;

    /** Remove a specific tag */
    removeTag: (tagId: number) => void;
}

export const useTagStore = create<TagStore>()(
    devtools(
        (set) => ({
            data: {},

            updateTag: (tagId, tagValue) => {
                console.log(`[TAG STORE] 📥 updateTag llamado: tagId=${tagId}, value=${tagValue.value}`);
                set(
                    (state) => ({
                        data: {
                            ...state.data,
                            [tagId]: tagValue,
                        },
                    }),
                    false,
                    'updateTag'
                );
                console.log(`[TAG STORE] ✅ Store actualizado. Tags actuales:`, Object.keys(useTagStore.getState().data));
            },

            updateTagValue: (tagId, value) =>
                set(
                    (state) => ({
                        data: {
                            ...state.data,
                            [tagId]: {
                                value,
                                quality: 'GOOD',
                                timestamp: new Date().toISOString(),
                            },
                        },
                    }),
                    false,
                    'updateTagValue'
                ),

            updateTags: (updates) =>
                set(
                    (state) => ({
                        data: {
                            ...state.data,
                            ...updates,
                        },
                    }),
                    false,
                    'updateTags'
                ),

            clearTags: () =>
                set({ data: {} }, false, 'clearTags'),

            removeTag: (tagId) =>
                set(
                    (state) => {
                        const { [tagId]: _, ...rest } = state.data;
                        return { data: rest };
                    },
                    false,
                    'removeTag'
                ),
        }),
        { name: 'TagStore' }
    )
);

/**
 * Hook to get a specific tag value with fallback
 */
export function useTagValue<T = any>(tagId: number | undefined, fallback: T): T {
    const value = useTagStore((state) =>
        tagId !== undefined ? state.data[tagId]?.value : undefined
    );
    return value !== undefined ? value : fallback;
}

/**
 * Hook to get full tag data (value, quality, timestamp)
 */
export function useTagData(tagId: number | undefined): TagValue | null {
    return useTagStore((state) =>
        tagId !== undefined ? state.data[tagId] ?? null : null
    );
}

export default useTagStore;
