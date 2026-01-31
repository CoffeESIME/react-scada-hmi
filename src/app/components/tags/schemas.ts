'use client';

import { z } from 'zod';

// ============ Protocol Types ============
export const ProtocolType = {
    MODBUS: 'modbus',
    OPCUA: 'opcua',
    MQTT: 'mqtt',
    SIMULATED: 'simulated',
} as const;

export type ProtocolTypeValue = typeof ProtocolType[keyof typeof ProtocolType];

// ============ Connection Config Schemas ============

const ModbusConfigSchema = z.object({
    host: z.string().min(1, 'IP requerida').regex(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        { message: 'IP inválida' }
    ),
    port: z.coerce.number().min(1).max(65535).default(502),
    register: z.coerce.number().min(0, 'Registro requerido'),
    slave_id: z.coerce.number().min(0).max(255).default(1),
    register_type: z.enum(['holding', 'input', 'coil', 'discrete']).default('holding'),
});

const OpcuaConfigSchema = z.object({
    url: z.string().min(1, 'URL requerida').startsWith('opc.tcp://', 'Debe iniciar con opc.tcp://'),
    node_id: z.string().min(1, 'NodeID requerido'),
});

const MqttConfigSchema = z.object({
    topic: z.string().min(1, 'Topic requerido'),
    json_key: z.string().optional(),
});

const SimulatedConfigSchema = z.object({
    signal_type: z.enum(['sine', 'random', 'static', 'ramp']).default('sine'),
    min: z.coerce.number().default(0),
    max: z.coerce.number().default(100),
});

// ============ Alarm Schema ============

const AlarmSchema = z.object({
    enabled: z.boolean().default(false),
    message: z.string().optional(),
    severity: z.enum(['INFO', 'WARNING', 'CRITICAL']).default('WARNING'),
    hh: z.coerce.number().optional(),
    h: z.coerce.number().optional(),
    l: z.coerce.number().optional(),
    ll: z.coerce.number().optional(),
    deadband: z.coerce.number().min(0).default(0),
}).refine(
    (data) => {
        if (data.enabled && !data.message) {
            return false;
        }
        return true;
    },
    { message: 'Mensaje de alarma requerido', path: ['message'] }
);

// ============ Main Tag Schema ============

export const TagFormSchema = z.object({
    name: z.string().min(1, 'Nombre requerido').max(100),
    description: z.string().max(500).optional(),
    unit: z.string().max(50).optional(),
    source_protocol: z.enum(['modbus', 'opcua', 'mqtt', 'simulated']),
    scan_rate_ms: z.coerce.number().min(100).max(3600000).default(1000),
    mqtt_topic: z.string().max(200).optional(),
    is_enabled: z.boolean().default(true),

    // Connection config - validated by protocol
    connection_config: z.record(z.string(), z.any()),

    // Alarm settings
    alarm: AlarmSchema.optional(),
}).superRefine((data, ctx) => {
    // Validar connection_config según el protocolo
    try {
        switch (data.source_protocol) {
            case 'modbus':
                ModbusConfigSchema.parse(data.connection_config);
                break;
            case 'opcua':
                OpcuaConfigSchema.parse(data.connection_config);
                break;
            case 'mqtt':
                MqttConfigSchema.parse(data.connection_config);
                break;
            case 'simulated':
                SimulatedConfigSchema.parse(data.connection_config);
                break;
        }
    } catch (e: any) {
        if (e.errors) {
            e.errors.forEach((err: any) => {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: err.message,
                    path: ['connection_config', ...err.path],
                });
            });
        }
    }
});

// Input type (before defaults are applied) - used for form state
export type TagFormInput = z.input<typeof TagFormSchema>;

// Output type (after validation with defaults) - used for submit handler
export type TagFormData = z.output<typeof TagFormSchema>;

// ============ API Types ============

export interface Tag {
    id: number;
    name: string;
    description?: string;
    unit?: string;
    source_protocol: ProtocolTypeValue;
    connection_config: Record<string, any>;
    scan_rate_ms: number;
    mqtt_topic: string;
    is_enabled: boolean;
    alarm_definition?: {
        id: number;
        severity: string;
        message: string;
        limits: Record<string, number>;
        deadband: number;
        is_active: boolean;
    };
}

export interface TagListResponse {
    items: Tag[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
}
