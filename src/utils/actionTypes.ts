export type ActionType = 'NONE' | 'NAVIGATE' | 'WRITE_TAG' | 'SETPOINT_DIALOG' | 'SETPOINT_INPUT';

export interface ScalingConfig {
    type: 'none' | 'multiplier' | 'linear';
    multiplier_factor?: number;
    linear_config?: {
        raw_min: number;
        raw_max: number;
        scaled_min: number;
        scaled_max: number;
    };
}

export interface NodeActionConfig {
    actionType: ActionType;

    // Para NAVIGATE
    targetScreenId?: string;

    // Para WRITE_TAG / SETPOINT_DIALOG / SETPOINT_INPUT
    targetTagId?: number;
    tagName?: string;                          // Nombre legible del tag (para el modal)
    writeValue?: number | string | boolean;    // Valor fijo (WRITE_TAG)
    dataType?: 'boolean' | 'integer' | 'float'; // Tipo de dato (determina el input del modal)
    accessMode?: 'R' | 'W' | 'RW';            // Sólo W/RW son escribibles
    unit?: string;                             // Unidad de ingeniería (°C, PSI, etc.)
    scaling?: ScalingConfig;                   // Configuración de escalado
    prefillValue?: string;                     // Valor inicial del input del modal
}
