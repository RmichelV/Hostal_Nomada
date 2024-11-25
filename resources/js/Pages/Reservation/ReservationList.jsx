'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import Modal from '@/Components/Modal'
import Swal from 'sweetalert2'
import { Link } from '@inertiajs/react'
import ReservationForm from './ReservationForm'
import AppLayout from '@/Layouts/AppLayout'

const ReservationList = ({ reservations = [], users = [], notificaciones = [] }) => {
  const [reservationListData, setReservationListData] = useState([])
  const [roomTypes, setRoomTypes] = useState([]) // Almacena los tipos de habitaciones
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Fetch de reservas
  const fetchReservationList = async () => {
    try {
      const response = await axios.get('/api/reservations')
      setReservationListData(response.data)
    } catch (error) {
      console.error("Error recibiendo reservas:", error)
    }
  }

  // Fetch de tipos de habitaciones
  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/api/roomtypes')
      setRoomTypes(response.data)
    } catch (error) {
      console.error("Error obteniendo tipos de habitaciones:", error)
    }
  }

  useEffect(() => {
    fetchReservationList()
    fetchRoomTypes() // Carga los tipos de habitaciones al inicio
  }, [])

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation)
    setIsFormOpen(true)
  }

  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`/api/reservations/${id}`)
      Swal.fire("¡Éxito!", "Reserva eliminada exitosamente", "success")
      fetchReservationList()
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la reserva", "error")
    }
  }

  const handleDeleteConfirmation = (reservation) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar la reserva de ${reservation.user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteReservation(reservation.id)
      }
    })
  }

  const handleFormSubmit = () => {
    setIsFormOpen(false)
    fetchReservationList()
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Reservas</CardTitle>
            <CardDescription>Gestiona las reservas de los clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reservation">
              <Button className="mb-4 w-full sm:w-auto">
                Volver
              </Button>
            </Link>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Id</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Habitación</TableHead>
                    <TableHead>Fecha Entrada</TableHead>
                    <TableHead>Fecha Salida</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservationListData.map((reservation, index) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{reservation.user.name}</TableCell>
                      <TableCell>{reservation.room_types?.name || 'N/A'}</TableCell>
                      <TableCell>{reservation.check_in}</TableCell>
                      <TableCell>{reservation.check_out}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button onClick={() => handleEdit(reservation)} size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDeleteConfirmation(reservation)} size="sm" variant="destructive">
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
      </div>

      {isFormOpen && (
        <Modal
          show={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        >
          <ReservationForm
            users={users}
            rooms={roomTypes} 
            reservation={selectedReservation}
            onFormSubmit={handleFormSubmit}
          />
        </Modal>
      )}
    </AppLayout>
  )
}

export default ReservationList
