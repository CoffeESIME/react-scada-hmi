import { useRouter } from 'next/navigation';
import { useScadaMode } from '@/contexts/ScadaModeContext';
import { useGlobalToaster } from '@/hooks/useGlobalToaster';
import { NodeActionConfig } from '@/utils/actionTypes';


export const useNodeAction = (config: NodeActionConfig) => {
    const router = useRouter();
    const { isEditMode, onWriteRequest } = useScadaMode();
    const { addError, addInfo } = useGlobalToaster();

    const executeAction = async () => {
        if (isEditMode) return;

        switch (config.actionType) {
            case 'NAVIGATE':
                if (config.targetScreenId) {
                    router.push(`/scada/view/${config.targetScreenId}`);
                } else {
                    addInfo('Sin pantalla destino', 'Este botón no tiene pantalla configurada.');
                }
                break;

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
