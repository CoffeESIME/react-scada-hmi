'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    Tooltip,
    Spinner,
    useDisclosure,
} from '@nextui-org/react';
import { Toaster, toast } from 'sonner';
import TagFormModal from '@/app/components/tags/TagFormModal';
import { Tag, TagListResponse } from '@/app/components/tags/schemas';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

const protocolColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning'> = {
    modbus: 'primary',
    opcua: 'secondary',
    mqtt: 'success',
    simulated: 'warning',
};

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchTags = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/tags/?page_size=100`);
            if (!response.ok) throw new Error('Error al cargar tags');
            const data: TagListResponse = await response.json();
            setTags(data.items);
        } catch (error: any) {
            toast.error(error.message || 'Error al cargar tags');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        onOpen();
    };

    const handleNew = () => {
        setEditingTag(null);
        onOpen();
    };

    const handleDelete = async (tag: Tag) => {
        if (!confirm(`¿Eliminar el tag "${tag.name}"?`)) return;

        try {
            const response = await fetch(`${API_URL}/api/tags/${tag.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar');
            toast.success('Tag eliminado');
            fetchTags();
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar');
        }
    };

    const handleModalClose = () => {
        setEditingTag(null);
        onClose();
    };

    return (
        <div className="dark min-h-screen bg-admin-bg">
            <div className="p-6 max-w-7xl mx-auto">
                <Toaster position="top-right" richColors />

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-admin-text">Ingeniería de Tags</h1>
                        <p className="text-admin-text-secondary">Gestión de variables y configuración de alarmas</p>
                    </div>
                    <Button color="primary" onPress={handleNew}>
                        + Nuevo Tag
                    </Button>
                </div>

                {/* Table */}
                <Table aria-label="Tags table" isStriped>
                    <TableHeader>
                        <TableColumn>NOMBRE</TableColumn>
                        <TableColumn>PROTOCOLO</TableColumn>
                        <TableColumn>UNIDAD</TableColumn>
                        <TableColumn>SCAN RATE</TableColumn>
                        <TableColumn>ALARMA</TableColumn>
                        <TableColumn>ESTADO</TableColumn>
                        <TableColumn align="center">ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody
                        isLoading={isLoading}
                        loadingContent={<Spinner label="Cargando..." />}
                        emptyContent="No hay tags configurados"
                    >
                        {tags.map((tag) => (
                            <TableRow key={tag.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{tag.name}</p>
                                        {tag.description && (
                                            <p className="text-xs text-gray-500">{tag.description}</p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={protocolColors[tag.source_protocol] || 'default'}
                                        variant="flat"
                                        size="sm"
                                    >
                                        {tag.source_protocol.toUpperCase()}
                                    </Chip>
                                </TableCell>
                                <TableCell>{tag.unit || '-'}</TableCell>
                                <TableCell>{tag.scan_rate_ms} ms</TableCell>
                                <TableCell>
                                    {tag.alarm_definition ? (
                                        <Chip color="danger" variant="dot" size="sm">
                                            {tag.alarm_definition.message.slice(0, 20)}...
                                        </Chip>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={tag.is_enabled ? 'success' : 'default'}
                                        variant="flat"
                                        size="sm"
                                    >
                                        {tag.is_enabled ? 'Activo' : 'Inactivo'}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-center">
                                        <Tooltip content="Editar">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                onPress={() => handleEdit(tag)}
                                            >
                                                ✏️
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Eliminar" color="danger">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                onPress={() => handleDelete(tag)}
                                            >
                                                🗑️
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Modal */}
                <TagFormModal
                    isOpen={isOpen}
                    onClose={handleModalClose}
                    onSuccess={fetchTags}
                    editTag={editingTag}
                />
            </div>
        </div>
    );
}
