'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import Modal from '@/Components/Modal'
import Swal from 'sweetalert2'
import RoomForm from './RoomForm'
import AppLayout from '@/Layouts/AppLayout'

const Rooms = ({ rooms = [], roomTypes = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [roomsData, setRoomsData] = useState(rooms)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms')
      setRoomsData(response.data)
    } catch (error) {
      console.error("Error recibiendo habitaciones:", error)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleEdit = (room) => {
    setSelectedRoom(room)
    setIsFormOpen(true)
  }

  const handleDeleteRoom = async (id) => {
    try {
      await axios.delete(`/api/rooms/${id}`)
      Swal.fire("¡Éxito!", "Habitación eliminada exitosamente", "success")
      fetchRooms()
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la habitación", "error")
    }
  }

  const handleDeleteConfirmation = (room) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar la habitación ${room.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteRoom(room.id)
      }
    })
  }
  const statusColors = {
    Ocupada: 'text-red-600',
    Libre: 'text-green-600',
    'No acceso': 'text-gray-600',
  };
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Habitaciones</CardTitle>
            <CardDescription>Gestiona las habitaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => {
              setSelectedRoom(null)
              setIsFormOpen(true)
            }} className="mb-4 w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" /> Agregar Nueva Habitación
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Id</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo de Habitación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomsData.map((room, index) => (
                    <TableRow key={room.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell >{room.room_type.name}</TableCell>
                      <TableCell>
                        <span
                          className={`${
                            room.status ? 'text-green-600' : 'text-red-600'
                          } font-semibold`}
                        >
                          <div className={`font-bold ${statusColors[room.status] || 'text-black'}`}>
                              {room.status}
                            </div>                        
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button onClick={() => handleEdit(room)} size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDeleteConfirmation(room)} size="sm" variant="destructive">
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
            <RoomForm
              roomTypes={roomTypes}
              room={selectedRoom}
              onFormSubmit={() => {
                fetchRooms()
                setIsFormOpen(false)
              }}
            />
          </Modal>
        )}
      </div>
    </AppLayout>
  )
}

export default Rooms
