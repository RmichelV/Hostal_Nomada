'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import AppLayout from '@/Layouts/AppLayout';
import RoomTypeForm from './RoomTypeForm';

const RoomAndSuppliesManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [isSupplyFormOpen, setIsSupplyFormOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  // Fetch data for room types and supplies
  const fetchData = async () => {
    try {
      const roomResponse = await axios.get('/api/roomtypes');
      const supplyResponse = await axios.get('/api/supplies');
      setRoomTypes(roomResponse.data);
      setSupplies(supplyResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    const endpoint = type === 'roomType' ? `/api/roomtypes/${id}` : `/api/supplies/${id}`;
    try {
      await axios.delete(endpoint);
      Swal.fire('¡Éxito!', `${type === 'roomType' ? 'Tipo de habitación' : 'Suministro'} eliminado exitosamente`, 'success');
      fetchData();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el elemento', 'error');
    }
  };

  const handleDeleteConfirmation = (type, item) => {
    const name = type === 'roomType' ? item.name : item.name;
    Swal.fire({
      title: `¿Estás seguro de eliminar "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(type, item.id);
      }
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-8">
        {/* Section: Room Types */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Habitación</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setSelectedRoomType(null);
                setIsRoomFormOpen(true);
              }}
              className="mb-4"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Agregar Tipo de Habitación
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomTypes.map((roomType) => (
                  <TableRow key={roomType.id}>
                    <TableCell>{roomType.name}</TableCell>
                    <TableCell>${roomType.price}</TableCell>
                    <TableCell>{roomType.quantity}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button onClick={() => setSelectedRoomType(roomType)} size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteConfirmation('roomType', roomType)}
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
          </CardContent>
        </Card>

        {/* Section: Supplies */}
        <Card>
          <CardHeader>
            <CardTitle>Suministros</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setIsSupplyFormOpen(true)}
              className="mb-4"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Agregar Suministro
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplies.map((supply) => (
                  <TableRow key={supply.id}>
                    <TableCell>{supply.name}</TableCell>
                    <TableCell>${supply.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button onClick={() => {}} size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteConfirmation('supply', supply)}
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
          </CardContent>
        </Card>

        {/* Room Type Form Modal */}
        {isRoomFormOpen && (
          <Modal show={isRoomFormOpen} onClose={() => setIsRoomFormOpen(false)}>
            <RoomTypeForm roomType={selectedRoomType} onFormSubmit={fetchData} />
          </Modal>
        )}

        {/* Supply Form Modal */}
        {isSupplyFormOpen && (
          <Modal show={isSupplyFormOpen} onClose={() => setIsSupplyFormOpen(false)}>
            {/* Aquí puedes agregar un formulario para suministros */}
          </Modal>
        )}
      </div>
    </AppLayout>
  );
};

export default RoomAndSuppliesManager;
