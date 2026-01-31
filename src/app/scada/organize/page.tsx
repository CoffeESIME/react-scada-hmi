'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Spinner,
  Tooltip,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface ScreenListItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_home: boolean;
}

export default function OrganizeScreensPage() {
  const router = useRouter();
  const [screens, setScreens] = useState<ScreenListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchScreens = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<ScreenListItem[]>('/screens/');
      setScreens(response.data);
    } catch (error: any) {
      toast.error('Error al cargar pantallas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/screens/${id}`);
      toast.success('Pantalla eliminada');
      setScreens((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      toast.error('Error al eliminar pantalla');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetHome = async (screen: ScreenListItem) => {
    try {
      await api.put(`/screens/${screen.id}`, {
        is_home: true,
      });
      toast.success(`"${screen.name}" es ahora la pantalla principal`);
      // Refresh list to update home status
      fetchScreens();
    } catch (error: any) {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-admin-text">
              Administrar Pantallas
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Gestiona las pantallas SCADA del sistema
            </p>
          </div>
          <Button
            color="primary"
            onPress={() => router.push('/scada/create')}
          >
            + Nueva Pantalla
          </Button>
        </div>

        {/* Table */}
        <div className="bg-admin-surface rounded-lg border border-admin-border">
          <Table
            aria-label="Tabla de pantallas SCADA"
            classNames={{
              base: "dark",
              wrapper: "bg-transparent",
              th: "bg-admin-bg text-admin-text border-b border-admin-border",
              td: "text-admin-text border-b border-admin-border/50",
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>SLUG</TableColumn>
              <TableColumn>DESCRIPCIÓN</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn align="center">ACCIONES</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              loadingContent={<Spinner color="primary" />}
              emptyContent={
                <div className="py-8 text-center text-gray-400">
                  No hay pantallas creadas.
                  <br />
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="mt-4"
                    onPress={() => router.push('/scada/create')}
                  >
                    Crear primera pantalla
                  </Button>
                </div>
              }
            >
              {screens.map((screen) => (
                <TableRow key={screen.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{screen.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-admin-bg px-2 py-1 rounded">
                      {screen.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400 text-sm truncate max-w-xs block">
                      {screen.description || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {screen.is_home ? (
                      <Chip color="success" size="sm" variant="flat">
                        🏠 Principal
                      </Chip>
                    ) : (
                      <Tooltip content="Establecer como principal">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="cursor-pointer hover:bg-admin-border"
                          onClick={() => handleSetHome(screen)}
                        >
                          Normal
                        </Chip>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip content="Ver en Runtime">
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          onPress={() => router.push(`/scada/view/${screen.id}`)}
                        >
                          👁 Ver
                        </Button>
                      </Tooltip>
                      <Tooltip content="Editar en Canvas">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => router.push(`/scada/edit/${screen.id}`)}
                        >
                          ✏️ Editar
                        </Button>
                      </Tooltip>
                      <Tooltip content="Eliminar pantalla">
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isLoading={deletingId === screen.id}
                          onPress={() => handleDelete(screen.id, screen.name)}
                        >
                          🗑
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
