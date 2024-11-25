'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import SupplyForm from './SupplyForm';
import AppLayout from '@/Layouts/AppLayout';

const SuppliesManagement = ({ supplies = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [suppliesData, setSuppliesData] = useState(supplies);
  const [selectedSupply, setSelectedSupply] = useState(null);

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await axios.get('/api/supplies');
      if (response.status === 200) {
        setSuppliesData(response.data);
      }
    } catch (error) {
      console.error('Error obteniendo los suministros:', error);
    }
  };

  const handleEdit = (supply) => {
    setSelectedSupply(supply);
    setIsFormOpen(true);
  };

  const handleDeleteSupply = async (id) => {
    try {
      await axios.delete(`/api/supplies/${id}`);
      Swal.fire('¡Éxito!', 'Suministro eliminado exitosamente', 'success');
      setSuppliesData(suppliesData.filter((supply) => supply.id !== id));
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el suministro', 'error');
    }
  };

  const handleDeleteConfirmation = (supply) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el suministro ${supply.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSupply(supply.id);
      }
    });
  };

  const handleAddOrUpdate = (supply) => {
    if (!supply) {
      console.error("El objeto está vacío o es undefined.");
      return;
    }
    if (selectedSupply) {
      setSuppliesData((prevData) =>
        prevData.map((s) => (s.id === supply.id ? supply : s))
      );
    } else {
      setSuppliesData((prevData) => [supply, ...prevData]);
    }
    setIsFormOpen(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Gestión de Suministros</CardTitle>
            <CardDescription>Administra los suministros del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setSelectedSupply(null);
                setIsFormOpen(true);
              }}
              className="mb-4 w-full sm:w-auto"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Agregar Nuevo Suministro
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Imagen</TableHead>
                    <TableHead className='text-center'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliesData.map((supply, index) => (
                    <TableRow key={supply.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{supply.name}</TableCell>
                      <TableCell>{supply.description}</TableCell>
                      <TableCell>{`Bs. ${parseFloat(supply.price).toFixed(2)}`}</TableCell>
                      <TableCell>
                        <img
                          src={supply.supply_image ? `${supply.supply_image}` : '/img/noimage.jpeg'}
                          alt={supply.name}
                          className="w-16 h-16 object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button onClick={() => handleEdit(supply)} size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteConfirmation(supply)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {isFormOpen && (
          <Modal
            show={isFormOpen}
            onClose={() => setIsFormOpen(false)}
          >
            <SupplyForm supply={selectedSupply || {}} onFormSubmit={handleAddOrUpdate} />
          </Modal>
        )}
      </div>
    </AppLayout>
  );
};

export default SuppliesManagement;
