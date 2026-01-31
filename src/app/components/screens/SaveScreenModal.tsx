'use client';

import { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Checkbox,
} from '@nextui-org/react';
import { useReactFlow } from 'reactflow';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface SaveScreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: (screenId: number) => void;
    /** If provided, updates existing screen instead of creating new */
    editScreenId?: number;
    /** Pre-fill values when editing */
    initialValues?: {
        name?: string;
        description?: string;
        isHome?: boolean;
    };
}

interface ScreenResponse {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_home: boolean;
    layout_data: any;
}

export function SaveScreenModal({
    isOpen,
    onClose,
    onSaved,
    editScreenId,
    initialValues,
}: SaveScreenModalProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [isHome, setIsHome] = useState(initialValues?.isHome || false);
    const [isLoading, setIsLoading] = useState(false);

    const { toObject } = useReactFlow();

    const isEditing = !!editScreenId;

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        setIsLoading(true);

        try {
            // Get current React Flow state
            const flowState = toObject();

            const layoutData = {
                nodes: flowState.nodes,
                edges: flowState.edges,
                viewport: flowState.viewport,
            };

            if (isEditing) {
                // Update existing screen
                await api.put<ScreenResponse>(`/screens/${editScreenId}`, {
                    name: name.trim(),
                    description: description.trim() || null,
                    is_home: isHome,
                    layout_data: layoutData,
                });
                toast.success('Pantalla actualizada');
            } else {
                // Create new screen
                const response = await api.post<ScreenResponse>('/screens/', {
                    name: name.trim(),
                    description: description.trim() || null,
                    is_home: isHome,
                    layout_data: layoutData,
                });
                toast.success('Pantalla guardada');
                onSaved?.(response.data.id);
            }

            onClose();
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.detail || error.message || 'Error al guardar';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        if (!initialValues) {
            setName('');
            setDescription('');
            setIsHome(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            classNames={{
                base: "dark bg-admin-surface border border-admin-border",
                header: "border-b border-admin-border",
                body: "py-6",
                footer: "border-t border-admin-border",
            }}
        >
            <ModalContent>
                <ModalHeader className="text-admin-text">
                    {isEditing ? 'Actualizar Pantalla' : 'Guardar Pantalla'}
                </ModalHeader>

                <ModalBody>
                    <Input
                        label="Nombre"
                        placeholder="Ej: Dashboard Principal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        isRequired
                        classNames={{
                            input: "bg-admin-bg text-admin-text",
                            inputWrapper: "bg-admin-bg border-admin-border",
                        }}
                    />

                    <Textarea
                        label="Descripción"
                        placeholder="Descripción opcional de la pantalla..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        minRows={2}
                        classNames={{
                            input: "bg-admin-bg text-admin-text",
                            inputWrapper: "bg-admin-bg border-admin-border",
                        }}
                    />

                    <Checkbox
                        isSelected={isHome}
                        onValueChange={setIsHome}
                        classNames={{
                            label: "text-admin-text",
                        }}
                    >
                        <div className="flex flex-col">
                            <span>Pantalla Principal</span>
                            <span className="text-xs text-gray-400">
                                Se mostrará como home al iniciar el HMI
                            </span>
                        </div>
                    </Checkbox>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="flat"
                        onPress={handleClose}
                        className="text-admin-text"
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSave}
                        isLoading={isLoading}
                    >
                        {isEditing ? 'Actualizar' : 'Guardar'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default SaveScreenModal;
