import { useRouter } from 'next/navigation';
import { useScadaMode } from '@/contexts/ScadaModeContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { NodeActionConfig } from '@/utils/actionTypes';

export const useNodeAction = (config: NodeActionConfig) => {
    const router = useRouter();
    const { isEditMode } = useScadaMode();

    const executeAction = async (overrideValue?: number | string) => {
        if (isEditMode) return; // En edición no hace nada

        switch (config.actionType) {
            case 'NAVIGATE':
                if (config.targetScreenId) {
                    router.push(`/scada/view/${config.targetScreenId}`);
                } else {
                    toast.warning('No hay pantalla destino configurada');
                }
                break;

            case 'WRITE_TAG':
                if (!config.targetTagId) {
                    toast.warning('No hay Tag destino configurado');
                    return;
                }
                try {
                    await api.post(`/tags/${config.targetTagId}/write`, {
                        value: config.writeValue
                    });
                    toast.success(`Comando enviado: ${config.writeValue}`);
                } catch (error) {
                    console.error(error);
                    toast.error('Error enviando comando');
                }
                break;

            case 'SETPOINT_INPUT':
                // Caso Inline Input (ButtonNode)
                if (!config.targetTagId) return;
                if (overrideValue === undefined) return;
                try {
                    await api.post(`/tags/${config.targetTagId}/write`, { value: overrideValue });
                    toast.success(`Setpoint enviado: ${overrideValue}`);
                } catch (e) {
                    console.error(e);
                    toast.error('Error enviando setpoint');
                }
                break;

            case 'SETPOINT_DIALOG':
                if (!config.targetTagId) {
                    toast.warning('No hay Tag destino configurado');
                    return;
                }
                // TODO: Reemplazar con un Modal más elegante en el futuro
                const userInput = prompt("Ingrese el nuevo valor:");
                if (userInput !== null && userInput !== '') {
                    try {
                        // Intentamos parsear a número si es posible
                        const numericVal = Number(userInput);
                        const finalValue = isNaN(numericVal) ? userInput : numericVal;

                        await api.post(`/tags/${config.targetTagId}/write`, {
                            value: finalValue
                        });
                        toast.success(`Setpoint enviado: ${finalValue}`);
                    } catch (error) {
                        console.error(error);
                        toast.error('Error enviando setpoint');
                    }
                }
                break;

            default:
                // 'NONE' or undefined -> Do nothing
                break;
        }
    };

    return { executeAction };
};
