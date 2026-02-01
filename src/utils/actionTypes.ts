export type ActionType = 'NONE' | 'NAVIGATE' | 'WRITE_TAG' | 'SETPOINT_DIALOG' | 'SETPOINT_INPUT';

export interface NodeActionConfig {
    actionType: ActionType;

    // Para NAVIGATE
    targetScreenId?: string; // ID de la pantalla a la que ir

    // Para WRITE_TAG (Switch ON/OFF)
    targetTagId?: number;
    writeValue?: number | string | boolean; // Valor hardcodeado (ej: 1 para Start)

    // Para SETPOINT_DIALOG (Abrir popup para escribir valor)
    // Usa targetTagId para saber dónde escribir
    // El valor se pide dinámicamente
}
