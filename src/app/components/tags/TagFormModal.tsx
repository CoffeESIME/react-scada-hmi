'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Switch,
    Divider,
    Chip,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { TagFormSchema, TagFormData, TagFormInput, Tag, ProtocolType } from './schemas';
import { api } from '@/lib/api';

interface TagFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editTag?: Tag | null;
}

export default function TagFormModal({ isOpen, onClose, onSuccess, editTag }: TagFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!editTag;

    // Preparar valores por defecto
    const defaultValues: Partial<TagFormData> = editTag
        ? {
            name: editTag.name,
            description: editTag.description || '',
            unit: editTag.unit || '',
            source_protocol: editTag.source_protocol,
            connection_config: editTag.connection_config,
            scan_rate_ms: editTag.scan_rate_ms,
            mqtt_topic: editTag.mqtt_topic,
            is_enabled: editTag.is_enabled,
            alarm: editTag.alarm_definition
                ? {
                    enabled: true,
                    message: editTag.alarm_definition.message,
                    severity: editTag.alarm_definition.severity as any,
                    hh: editTag.alarm_definition.limits?.HH,
                    h: editTag.alarm_definition.limits?.H,
                    l: editTag.alarm_definition.limits?.L,
                    ll: editTag.alarm_definition.limits?.LL,
                    deadband: editTag.alarm_definition.deadband,
                }
                : { enabled: false, severity: 'WARNING' as const, deadband: 0 },
        }
        : {
            source_protocol: 'simulated',
            connection_config: { signal_type: 'sine', min: 0, max: 100 },
            scan_rate_ms: 1000,
            is_enabled: true,
            alarm: { enabled: false, severity: 'WARNING' as const, deadband: 0 },
        };

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<TagFormInput>({
        resolver: zodResolver(TagFormSchema),
        defaultValues,
    });

    const selectedProtocol = watch('source_protocol');
    const alarmEnabled = watch('alarm.enabled');

    // Cambiar config al cambiar protocolo
    const handleProtocolChange = (protocol: string) => {
        setValue('source_protocol', protocol as any);

        // Reset connection_config según protocolo
        switch (protocol) {
            case 'modbus':
                setValue('connection_config', { host: '', port: 502, register: 0, slave_id: 1, register_type: 'holding' });
                break;
            case 'opcua':
                setValue('connection_config', { url: 'opc.tcp://', node_id: '' });
                break;
            case 'mqtt':
                setValue('connection_config', { topic: '', json_key: '' });
                break;
            case 'simulated':
                setValue('connection_config', { signal_type: 'sine', min: 0, max: 100 });
                break;
        }
    };

    const onSubmit = async (formData: TagFormInput) => {
        // After Zod validation, data is guaranteed to have defaults applied
        const data = formData as TagFormData;
        setIsSubmitting(true);

        try {
            // Construir payload para el backend
            const payload: any = {
                name: data.name,
                description: data.description,
                unit: data.unit,
                source_protocol: data.source_protocol,
                connection_config: data.connection_config,
                scan_rate_ms: data.scan_rate_ms,
                mqtt_topic: data.mqtt_topic || undefined,
                is_enabled: data.is_enabled,
            };

            // Agregar alarma si está habilitada
            if (data.alarm?.enabled) {
                payload.alarm = {
                    message: data.alarm.message,
                    severity: data.alarm.severity || 'WARNING',
                    limits: {
                        ...(data.alarm.hh !== undefined && { HH: data.alarm.hh }),
                        ...(data.alarm.h !== undefined && { H: data.alarm.h }),
                        ...(data.alarm.l !== undefined && { L: data.alarm.l }),
                        ...(data.alarm.ll !== undefined && { LL: data.alarm.ll }),
                    },
                    deadband: data.alarm.deadband || 0,
                    is_active: true,
                };
            }

            if (isEditing) {
                await api.put(`/tags/${editTag.id}`, payload);
            } else {
                await api.post('/tags/', payload);
            }

            toast.success(isEditing ? 'Tag actualizado' : 'Tag creado');
            reset();
            onSuccess();
            onClose();
        } catch (error: any) {
            const message = error.response?.data?.detail || error.message || 'Error al guardar el tag';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="3xl"
            scrollBehavior="inside"
            classNames={{
                base: "bg-admin-bg border border-admin-border",
                header: "border-b border-admin-border",
                body: "py-6",
                footer: "border-t border-admin-border",
            }}
            className="dark"
        >
            <ModalContent className="bg-admin-bg text-admin-text">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className="flex flex-col gap-1 text-admin-text">
                        {isEditing ? 'Editar Tag' : 'Nuevo Tag'}
                    </ModalHeader>

                    <ModalBody className="gap-4">
                        {/* === Información Básica === */}
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Nombre"
                                        placeholder="Ej: Tanque1_Nivel"
                                        isInvalid={!!errors.name}
                                        errorMessage={errors.name?.message}
                                        isRequired
                                    />
                                )}
                            />

                            <Controller
                                name="unit"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Unidad"
                                        placeholder="Ej: °C, PSI, Liters"
                                    />
                                )}
                            />
                        </div>

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Descripción"
                                    placeholder="Descripción del tag"
                                />
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <Controller
                                name="source_protocol"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Protocolo"
                                        selectedKeys={[field.value]}
                                        onSelectionChange={(keys) => {
                                            const protocol = Array.from(keys)[0] as string;
                                            handleProtocolChange(protocol);
                                        }}
                                        isRequired
                                    >
                                        <SelectItem key="simulated" value="simulated">Simulado</SelectItem>
                                        <SelectItem key="modbus" value="modbus">Modbus TCP</SelectItem>
                                        <SelectItem key="opcua" value="opcua">OPC UA</SelectItem>
                                        <SelectItem key="mqtt" value="mqtt">MQTT Externo</SelectItem>
                                    </Select>
                                )}
                            />

                            <Controller
                                name="scan_rate_ms"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        label="Scan Rate (ms)"
                                        value={String(field.value)}
                                        isInvalid={!!errors.scan_rate_ms}
                                        errorMessage={errors.scan_rate_ms?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="is_enabled"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-2 pt-6">
                                        <Switch
                                            isSelected={field.value}
                                            onValueChange={field.onChange}
                                        />
                                        <span>Habilitado</span>
                                    </div>
                                )}
                            />
                        </div>

                        {/* === Configuración de Protocolo (Dinámica) === */}
                        <Divider className="my-2" />
                        <div className="flex items-center gap-2 mb-2">
                            <Chip color="primary" variant="flat" size="sm">
                                {selectedProtocol?.toUpperCase()}
                            </Chip>
                            <span className="text-sm text-gray-500">Configuración de Conexión</span>
                        </div>

                        {/* Modbus Config */}
                        {selectedProtocol === 'modbus' && (
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="connection_config.host"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Host (IP)"
                                            placeholder="192.168.1.10"
                                            isRequired
                                        />
                                    )}
                                />
                                <Controller
                                    name="connection_config.port"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            label="Puerto"
                                            value={String(field.value)}
                                        />
                                    )}
                                />
                                <Controller
                                    name="connection_config.register"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            label="Registro"
                                            placeholder="4001"
                                            value={String(field.value)}
                                            isRequired
                                        />
                                    )}
                                />
                                <Controller
                                    name="connection_config.slave_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            label="Slave ID"
                                            value={String(field.value)}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {/* OPC UA Config */}
                        {selectedProtocol === 'opcua' && (
                            <div className="grid grid-cols-1 gap-4">
                                <Controller
                                    name="connection_config.url"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="URL del Servidor"
                                            placeholder="opc.tcp://localhost:4840"
                                            isRequired
                                        />
                                    )}
                                />
                                <Controller
                                    name="connection_config.node_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Node ID"
                                            placeholder="ns=2;i=2"
                                            isRequired
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {/* MQTT Config */}
                        {selectedProtocol === 'mqtt' && (
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="connection_config.topic"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Topic MQTT"
                                            placeholder="device/esp32/temp"
                                            isRequired
                                        />
                                    )}
                                />
                                <Controller
                                    name="connection_config.json_key"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Clave JSON (opcional)"
                                            placeholder="value"
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {/* Simulated Config */}
                        {selectedProtocol === 'simulated' && (
                            <div className="grid grid-cols-3 gap-4">
                                <Controller
                                    name="connection_config.signal_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Tipo de Señal"
                                            selectedKeys={[field.value]}
                                            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                                        >
                                            <SelectItem key="sine" value="sine">Senoidal</SelectItem>
                                            <SelectItem key="random" value="random">Aleatorio</SelectItem>
                                            <SelectItem key="ramp" value="ramp">Rampa</SelectItem>
                                            <SelectItem key="static" value="static">Estático</SelectItem>
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name="connection_config.min"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            label="Mínimo"
                                            value={String(field.value)}
                                        />
                                    )}
                                />
                                <Controller
                                    name="connection_config.max"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            label="Máximo"
                                            value={String(field.value)}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {/* === Configuración de Alarmas === */}
                        <Divider className="my-2" />
                        <div className="flex items-center gap-4">
                            <Controller
                                name="alarm.enabled"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        isSelected={field.value}
                                        onValueChange={field.onChange}
                                    />
                                )}
                            />
                            <span className="font-medium">Habilitar Alarmas</span>
                        </div>

                        {alarmEnabled && (
                            <div className="space-y-4 p-4 bg-admin-surface border border-admin-border rounded-lg">
                                <Controller
                                    name="alarm.message"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Mensaje de Alarma"
                                            placeholder="Ej: Temperatura fuera de rango"
                                            isRequired
                                            isInvalid={!!errors.alarm?.message}
                                            errorMessage={errors.alarm?.message?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="alarm.severity"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label="Severidad"
                                            selectedKeys={[field.value || 'WARNING']}
                                            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                                        >
                                            <SelectItem key="INFO" value="INFO">Info</SelectItem>
                                            <SelectItem key="WARNING" value="WARNING">Warning</SelectItem>
                                            <SelectItem key="CRITICAL" value="CRITICAL">Crítico</SelectItem>
                                        </Select>
                                    )}
                                />

                                <div className="grid grid-cols-4 gap-4">
                                    <Controller
                                        name="alarm.hh"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                label="HH (Crítico Alto)"
                                                placeholder="90"
                                                value={field.value !== undefined ? String(field.value) : ''}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="alarm.h"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                label="H (Alto)"
                                                placeholder="80"
                                                value={field.value !== undefined ? String(field.value) : ''}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="alarm.l"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                label="L (Bajo)"
                                                placeholder="20"
                                                value={field.value !== undefined ? String(field.value) : ''}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="alarm.ll"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                label="LL (Crítico Bajo)"
                                                placeholder="10"
                                                value={field.value !== undefined ? String(field.value) : ''}
                                            />
                                        )}
                                    />
                                </div>

                                <Controller
                                    name="alarm.deadband"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            label="Deadband (Histéresis)"
                                            placeholder="0"
                                            value={String(field.value || 0)}
                                            className="max-w-xs"
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" type="submit" isLoading={isSubmitting}>
                            {isEditing ? 'Guardar Cambios' : 'Crear Tag'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
