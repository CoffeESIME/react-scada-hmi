import React, { useState, useEffect } from 'react';
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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { api, ScreenShare, getScreenShares, shareScreen, revokeScreenShare } from '@/lib/api';

interface ShareScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenId?: number;
}

export default function ShareScreenModal({ isOpen, onClose, screenId }: ShareScreenModalProps) {
  const [shares, setShares] = useState<ScreenShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [role, setRole] = useState<'VIEWER' | 'EDITOR'>('VIEWER');

  const fetchShares = async () => {
    if (!screenId) return;
    setIsLoading(true);
    try {
      const data = await getScreenShares(screenId);
      setShares(data);
    } catch (error) {
      console.error('Error fetching shares:', error);
      toast.error('Error al cargar accesos compartidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && screenId) {
      fetchShares();
      setUsernameOrEmail('');
      setRole('VIEWER');
    }
  }, [isOpen, screenId]);

  const handleShare = async () => {
    if (!screenId || !usernameOrEmail.trim()) return;
    setIsSubmitting(true);
    try {
      await shareScreen(screenId, usernameOrEmail.trim(), role);
      toast.success('Pantalla compartida con éxito');
      setUsernameOrEmail('');
      fetchShares();
    } catch (error: any) {
      console.error('Error sharing screen:', error);
      toast.error(error.response?.data?.detail || 'Error al compartir pantalla');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (userId: number) => {
    if (!screenId) return;
    try {
      await revokeScreenShare(screenId, userId);
      toast.success('Acceso revocado');
      fetchShares();
    } catch (error) {
      console.error('Error revoking share:', error);
      toast.error('Error al revocar acceso');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" classNames={{ base: "dark bg-[#1a1a2e] text-white" }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-[#3a3a5c]">
              Compartir Pantalla
            </ModalHeader>
            <ModalBody className="py-6">
              {/* Formulario para compartir */}
              <div className="flex gap-4 items-end mb-6">
                <div className="flex-1">
                  <Input
                    label="Usuario o Email"
                    placeholder="ej: juan123 o juan@empresa.com"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    variant="bordered"
                    size="sm"
                    classNames={{ inputWrapper: "border-[#3a3a5c]" }}
                  />
                </div>
                <div className="w-48">
                  <Select
                    label="Permiso"
                    selectedKeys={[role]}
                    onChange={(e) => setRole(e.target.value as any)}
                    variant="bordered"
                    size="sm"
                    classNames={{ trigger: "border-[#3a3a5c]" }}
                  >
                    <SelectItem key="VIEWER" value="VIEWER">Solo Lectura (Viewer)</SelectItem>
                    <SelectItem key="EDITOR" value="EDITOR">Edición (Editor)</SelectItem>
                  </Select>
                </div>
                <Button 
                  color="primary" 
                  onPress={handleShare} 
                  isLoading={isSubmitting}
                  isDisabled={!usernameOrEmail.trim()}
                >
                  Compartir
                </Button>
              </div>

              {/* Lista de usuarios con acceso */}
              <h3 className="text-md font-semibold mb-3">Usuarios con acceso</h3>
              <div className="border border-[#3a3a5c] rounded-lg overflow-hidden">
                <Table 
                  aria-label="Usuarios con acceso"
                  classNames={{
                    wrapper: "bg-transparent shadow-none",
                    th: "bg-[#16213e] text-gray-300 border-b border-[#3a3a5c]",
                    td: "border-b border-[#3a3a5c]/50",
                  }}
                >
                  <TableHeader>
                    <TableColumn>USUARIO</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>ROL</TableColumn>
                    <TableColumn align="center">ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody 
                    isLoading={isLoading}
                    loadingContent={<Spinner color="primary" />}
                    emptyContent="No hay usuarios adicionales con acceso."
                  >
                    {shares.map((share) => (
                      <TableRow key={share.id}>
                        <TableCell>{share.username}</TableCell>
                        <TableCell>{share.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${share.role === 'EDITOR' ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-300'}`}>
                            {share.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onPress={() => handleRevoke(share.user_id)}
                            >
                              Revocar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-[#3a3a5c]">
              <Button color="primary" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
