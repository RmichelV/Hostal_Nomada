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
import DishForm from './DishForm'; // Formulario para agregar/editar platos
import AppLayout from '@/Layouts/AppLayout';

const RestaurantDishes = ({ dishes = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dishesData, setDishesData] = useState(dishes);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, []);



  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setIsFormOpen(true);
  };

  const handleDeleteDish = async (id) => {
    try {
      await axios.delete(`/api/restaurant_dishes/${id}`);
      Swal.fire('¡Éxito!', 'Plato eliminado exitosamente', 'success');
      setDishesData(dishesData.filter((dish) => dish.id !== id));
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el plato', 'error');
    }
  };

  const handleDeleteConfirmation = (dish) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el plato ${dish.dishname}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteDish(dish.id);
      }
    });
  };

  const handleAddOrUpdate = (dish) => {
    if (!dish) {
      console.error("El objeto está vacío o es undefined.");
      return;
    }
    if (selectedDish) {
      setDishesData((prevData) =>
        prevData.map((d) => (d.id === dish.id ? dish : d))
      );
    } else {
      setDishesData((prevData) => [dish, ...prevData]);
    }
    setIsFormOpen(false);
  };
  const fetchDishes = async () => {
    try {
      const response = await axios.get('/api/restaurant_dishes');
      if (response.status === 200) {
        setDishesData(response.data);
      }
    } catch (error) {
      console.error('Error obteniendo los platos:', error);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Platos del Restaurante</CardTitle>
            <CardDescription>Gestiona los platos de tu restaurante</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setSelectedDish(null);
                setIsFormOpen(true);
              }}
              className="mb-4 w-full sm:w-auto"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Agregar Nuevo Plato
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
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dishesData.map((dish, index) => (
                    <TableRow key={dish.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{dish.dishname}</TableCell>
                      <TableCell>{dish.description}</TableCell>
                      <TableCell>{dish.price}</TableCell>
                      <TableCell>
                        <img
                          src={dish.dish_image ? `${dish.dish_image}` : '/img/noimage.jpeg'}
                          alt={dish.dishname}
                          className="w-16 h-16 object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button onClick={() => handleEdit(dish)} size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteConfirmation(dish)}
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
            <DishForm dish={selectedDish || {}} onFormSubmit={handleAddOrUpdate} />
          </Modal>
        )}
      </div>
    </AppLayout>
  );
};

export default RestaurantDishes;
