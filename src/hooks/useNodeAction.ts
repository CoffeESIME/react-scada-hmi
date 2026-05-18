import { useRouter } from 'next/navigation';
import { useScadaMode } from '@/contexts/ScadaModeContext';
import { useGlobalToaster } from '@/hooks/useGlobalToaster';
import { NodeActionConfig } from '@/utils/actionTypes';

/**
 * Hook que ejecuta la acción configurada en un nodo del canvas.
 *
 * En modo Runtime:
 *  - NAVIGATE        → router.push
 *  - SETPOINT_DIALOG → abre el modal de escritura con input adaptado al dataType del tag
 *
 * NUNCA llama a prompt() ni a toast de sonner directamente.
 * Los errores van al GlobalToaster persistente.
 */
export const useNodeAction = (config: NodeActionConfig) => {
    const router = useRouter();
    const { isEditMode, onWriteRequest } = useScadaMode();
    const { addError, addInfo } = useGlobalToaster();

    const executeAction = async () => {
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

            // ── SETPOINT_DIALOG (popup modal con input según dataType) ─
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

            default:
                break;
        }
    };

    return { executeAction };
};
