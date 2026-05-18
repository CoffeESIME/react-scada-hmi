'use client';

import { useState, useEffect } from 'react';
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Switch, Chip,
} from '@nextui-org/react';
import { api } from '@/lib/api';
import { useGlobalToaster } from '@/hooks/useGlobalToaster';

export interface WriteTagTarget {
    tagId: number;
    tagName: string;
    dataType: 'boolean' | 'integer' | 'float';
    accessMode: 'R' | 'W' | 'RW';
    unit?: string;
    scaling?: {
        type: 'none' | 'multiplier' | 'linear';
        multiplier_factor?: number;
        linear_config?: {
            raw_min: number; raw_max: number;
            scaled_min: number; scaled_max: number;
        };
    };
    prefillValue?: string;
}

interface Props {
    isOpen: boolean;
    target: WriteTagTarget | null;
    onClose: () => void;
}

export default function WriteTagModal({ isOpen, target, onClose }: Props) {
    const [numericValue, setNumericValue] = useState('');
    const [boolValue, setBoolValue] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const { addError, addSuccess } = useGlobalToaster();

    useEffect(() => {
        if (target) {
            setNumericValue(target.prefillValue ?? '');
            setBoolValue(target.prefillValue === '1' || target.prefillValue === 'true');
            setIsWriting(false);
        }
    }, [target]);

    if (!target) return null;

    const isBoolean = target.dataType === 'boolean';
    const scaling = target.scaling;
    const scalingHint = (() => {
        if (!scaling || scaling.type === 'none') return null;
        if (scaling.type === 'multiplier') return `Factor: ×${scaling.multiplier_factor ?? 1}`;
        if (scaling.type === 'linear' && scaling.linear_config) {
            const lc = scaling.linear_config;
            return `${lc.scaled_min}–${lc.scaled_max} ${target.unit || ''} → ${lc.raw_min}–${lc.raw_max} raw`;
        }
        return null;
    })();

    const handleWrite = async () => {
        if (isBoolean) {
            // boolean: siempre válido (0 o 1)
        } else if (target.dataType === 'integer') {
            const parsed = parseInt(numericValue, 10);
            if (isNaN(parsed) || String(parsed) !== numericValue.trim()) {
                addError(`Valor inválido para "${target.tagName}"`, 'Se requiere un número entero (sin decimales).');
                return;
            }
        } else {
            // float
            if (isNaN(parseFloat(numericValue))) {
                addError(`Valor inválido para "${target.tagName}"`, 'Ingresa un número válido.');
                return;
            }
        }

        setIsWriting(true);
        try {
            let value: number;
            if (isBoolean) {
                value = boolValue ? 1 : 0;
            } else if (target.dataType === 'integer') {
                value = parseInt(numericValue, 10);
            } else {
                value = parseFloat(numericValue);
            }
            const res = await api.post(`/tags/${target.tagId}/write`, { value });
            addSuccess(
                `✅ Escritura exitosa — ${target.tagName}`,
                `Valor ${res.data.value_written} enviado (raw: ${res.data.raw_sent})`
            );
            onClose();
        } catch (err: any) {
            const detail = err.response?.data?.detail || err.message || 'Error desconocido';
            addError(`❌ Error al escribir — ${target.tagName}`, detail);
        } finally {
            setIsWriting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            classNames={{
                base: 'bg-[#1a1a2e] border border-[#3a3a5c]',
                header: 'border-b border-[#3a3a5c] text-gray-200',
                footer: 'border-t border-[#3a3a5c]',
            }}
            className="dark"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span>Enviar Setpoint</span>
                        <Chip
                            size="sm"
                            variant="flat"
                            color={target.dataType === 'boolean' ? 'secondary' : target.dataType === 'integer' ? 'warning' : 'primary'}
                            className="text-[10px] uppercase"
                        >
                            {target.dataType}
                        </Chip>
                    </div>
                    <span className="text-sm font-normal text-gray-400">{target.tagName}</span>
                </ModalHeader>
                <ModalBody className="gap-4 py-4">
                    {scalingHint && (
                        <Chip size="sm" variant="flat" color="warning" className="text-xs">
                            Escalado: {scalingHint}
                        </Chip>
                    )}
                    {isBoolean ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <Switch
                                    isSelected={boolValue}
                                    onValueChange={setBoolValue}
                                    color="success"
                                />
                                <span className="text-gray-300 font-mono text-lg">
                                    {boolValue ? '1 — ON' : '0 — OFF'}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-500">Solo se puede enviar 0 (OFF) o 1 (ON).</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <Input
                                type="number"
                                label={`Valor ${target.unit ? `(${target.unit})` : ''}`}
                                placeholder={target.dataType === 'integer' ? '0' : '0.00'}
                                value={numericValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (target.dataType === 'integer') {
                                        // Prevent typing decimals for integer
                                        if (val === '' || val === '-' || /^-?\d+$/.test(val)) {
                                            setNumericValue(val);
                                        }
                                    } else {
                                        setNumericValue(val);
                                    }
                                }}
                                autoFocus
                                step={target.dataType === 'integer' ? '1' : 'any'}
                                inputMode={target.dataType === 'integer' ? 'numeric' : 'decimal'}
                            />
                            <p className="text-[11px] text-gray-500">
                                {target.dataType === 'integer'
                                    ? 'Solo números enteros (sin decimales).'
                                    : 'Puedes ingresar decimales (ej: 3.14).'}
                            </p>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" color="danger" onPress={onClose} isDisabled={isWriting}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleWrite}
                        isLoading={isWriting}
                        isDisabled={isWriting || (!isBoolean && !numericValue)}
                    >
                        Enviar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
