import { useRouter } from 'next/navigation';
import { useScadaMode } from '@/contexts/ScadaModeContext';
import { useGlobalToaster } from '@/hooks/useGlobalToaster';
import { NodeActionConfig } from '@/utils/actionTypes';
import { api } from '@/lib/api';

/**
 * Hook que ejecuta la acción configurada en un nodo del canvas.
 *
 * En modo Runtime:
 *  - NAVIGATE        → router.push
 *  - WRITE_TAG       → delega en onWriteRequest (verificación de rol + WriteTagModal)
 *  - SETPOINT_DIALOG → igual que WRITE_TAG (abre el modal con input libre)
 *  - SETPOINT_INPUT  → escribe directamente el valor (inline input ya validado)
 *
 * NUNCA llama a prompt() ni a toast de sonner directamente.
 * Los errores van al GlobalToaster persistente.
 */
export const useNodeAction = (config: NodeActionConfig) => {
    const router = useRouter();
    const { isEditMode, onWriteRequest } = useScadaMode();
    const { addError, addInfo } = useGlobalToaster();

    const executeAction = async (overrideValue?: number | string) => {
        // En modo edición los botones/cards no hacen nada
        if (isEditMode) return;

        switch (config.actionType) {
            // ── NAVIGATE ──────────────────────────────────────────────
            case 'NAVIGATE':
                if (config.targetScreenId) {
                    router.push(`/scada/view/${config.targetScreenId}`);
                } else {
                    addInfo('Sin pantalla destino', 'Este botón no tiene pantalla configurada.');
                }
                break;

            // ── WRITE_TAG (valor fijo, ej. Start/Stop) ─────────────────
            case 'WRITE_TAG':
                if (!config.targetTagId) {
                    addInfo('Sin tag configurado', 'Este botón no tiene un tag destino asignado.');
                    return;
                }
                if (!onWriteRequest) {
                    // Fallback: fuera del Runtime (no debería ocurrir)
                    addError('Error de contexto', 'onWriteRequest no disponible en este contexto.');
                    return;
                }
                onWriteRequest({
                    tagId: config.targetTagId,
                    tagName: config.tagName || `Tag #${config.targetTagId}`,
                    dataType: config.dataType || 'float',
                    accessMode: config.accessMode || 'RW',
                    unit: config.unit,
                    scaling: config.scaling,
                    // Pre-fill el modal con el valor configurado (si existe)
                    prefillValue: config.writeValue !== undefined ? String(config.writeValue) : undefined,
                });
                break;

            // ── SETPOINT_DIALOG (input libre del usuario) ──────────────
            case 'SETPOINT_DIALOG':
                if (!config.targetTagId) {
                    addInfo('Sin tag configurado', 'Este elemento no tiene un tag destino asignado.');
                    return;
                }
                if (!onWriteRequest) {
                    addError('Error de contexto', 'onWriteRequest no disponible en este contexto.');
                    return;
                }
                onWriteRequest({
                    tagId: config.targetTagId,
                    tagName: config.tagName || `Tag #${config.targetTagId}`,
                    dataType: config.dataType || 'float',
                    accessMode: config.accessMode || 'RW',
                    unit: config.unit,
                    scaling: config.scaling,
                });
                break;

            // ── SETPOINT_INPUT (inline — ya tiene el valor del input) ──
            case 'SETPOINT_INPUT':
                if (!config.targetTagId || overrideValue === undefined) return;
                try {
                    await api.post(`/tags/${config.targetTagId}/write`, { value: overrideValue });
                } catch (err: any) {
                    const detail = err.response?.data?.detail || err.message || 'Error desconocido';
                    addError(`Error al escribir tag #${config.targetTagId}`, detail);
                }
                break;

            default:
                break;
        }
    };

    return { executeAction };
};
