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
    /** Pre-rellena el input con este valor (ej. botón Start → 1) */
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

    // Reset state + apply prefill whenever the target changes
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
        const value = isBoolean ? (boolValue ? 1 : 0) : parseFloat(numericValue);

        if (!isBoolean && isNaN(value)) {
            addError(`Valor inválido para el tag "${target.tagName}"`, 'Ingresa un número válido.');
            return;
        }

        setIsWriting(true);
        try {
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
                    <span>Escribir Valor</span>
                    <span className="text-sm font-normal text-gray-400">{target.tagName}</span>
                </ModalHeader>
                <ModalBody className="gap-4 py-4">
                    {scalingHint && (
                        <Chip size="sm" variant="flat" color="warning" className="text-xs">
                            Escalado: {scalingHint}
                        </Chip>
                    )}
                    {isBoolean ? (
                        <div className="flex items-center gap-3">
                            <Switch
                                isSelected={boolValue}
                                onValueChange={setBoolValue}
                                color="success"
                            />
                            <span className="text-gray-300">{boolValue ? 'ON (1)' : 'OFF (0)'}</span>
                        </div>
                    ) : (
                        <Input
                            type="number"
                            label={`Valor ${target.unit ? `(${target.unit})` : ''}`}
                            placeholder="0.0"
                            value={numericValue}
                            onChange={(e) => setNumericValue(e.target.value)}
                            autoFocus
                            step={target.dataType === 'integer' ? '1' : 'any'}
                        />
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
