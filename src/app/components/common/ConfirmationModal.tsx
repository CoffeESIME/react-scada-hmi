'use client';

import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDanger?: boolean;
}

/**
 * Componente modal genérico para confirmar acciones.
 * Se usa para reemplazar window.confirm() con una UI consistente.
 */
export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmar acción',
    message = '¿Estás seguro de continuar?',
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    isDanger = false,
}: ConfirmationModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                base: "dark bg-admin-surface border border-admin-border",
                header: "border-b border-admin-border text-admin-text",
                body: "py-6 text-gray-300",
                footer: "border-t border-admin-border",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
        >
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <p>{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="flat"
                        onPress={onClose}
                        className="text-admin-text"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        color={isDanger ? 'danger' : 'primary'}
                        onPress={handleConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
