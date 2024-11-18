'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/Components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/Components/ui/card"
import Modal from '@/Components/Modal'
import Swal from 'sweetalert2'
import RoomTypeForm from './RoomTypeForm'
import AppLayout from '@/Layouts/AppLayout'

const RoomTypes = ({ roomTypes = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [roomTypesData, setRoomTypesData] = useState(roomTypes)
  const [selectedRoomType, setSelectedRoomType] = useState(null)

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/api/roomtypes')
      setRoomTypesData(response.data)
    } catch (error) {
      console.error("Error recibiendo tipos de habitación:", error)
    }
  }

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  const handleEdit = (roomType) => {
    setSelectedRoomType(roomType)
    setIsFormOpen(true)
  }

  const handleDeleteRoomType = async (id) => {
    try {
      await axios.delete(`/api/roomtypes/${id}`)
      Swal.fire("¡Éxito!", "Tipo de habitación eliminado exitosamente", "success")
      setRoomTypesData(roomTypesData.filter(roomType => roomType.id !== id))
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el tipo de habitación", "error")
    }
  }

  const handleDeleteConfirmation = (roomType) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el tipo de habitación ${roomType.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteRoomType(roomType.id)
      }
    })
  }

  const handleAddOrUpdate = (roomType=[]) => {
    if (selectedRoomType) {
      setRoomTypesData(roomTypesData.map(rt => rt.id === roomType.id ? roomType : rt));
    } else {
      setRoomTypesData([...roomTypesData, roomType]);
    }
    setIsFormOpen(false);
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Tipos de Habitación</CardTitle>
            <CardDescription>Gestiona los tipos de habitación</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => {
              setSelectedRoomType(null)
              setIsFormOpen(true)
            }} className="mb-4 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" /> Agregar Nuevo Tipo de Habitación
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Id</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="hidden md:table-cell">Cantidad</TableHead>
                    <TableHead className="hidden sm:table-cell">Precio</TableHead>
                    <TableHead className="hidden sm:table-cell">Acciones</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
  {roomTypesData.map((roomType, index) => (
    <TableRow key={roomType?.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{roomType?.name}</TableCell>
      <TableCell>{roomType?.description}</TableCell>
      <TableCell className="hidden md:table-cell">{roomType?.quantity}</TableCell>
      <TableCell className="hidden sm:table-cell">{roomType?.price}</TableCell>
      <TableCell>
          <img
            src={roomType?.room_image ? `${roomType?.room_image}`: "/img/noimage.jpeg" } 
            alt={roomType?.name}
            className="w-16 h-16 object-cover"
          />
       
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => handleEdit(roomType)} size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleDeleteConfirmation(roomType)} size="sm" variant="destructive">
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
            <RoomTypeForm roomType={selectedRoomType || {}} onFormSubmit={handleAddOrUpdate} />

          </Modal>
        )}
      </div>
    </AppLayout>
  )
}

export default RoomTypes
