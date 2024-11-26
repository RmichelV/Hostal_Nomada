'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import Swal from 'sweetalert2'
import { PlusIcon, MinusIcon } from "lucide-react"

const ReservationForm = ({ users, rooms, reservation, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    number_of_people:'',
    room_type_id: '',
    check_in: '',
    check_out: '',
    habitaciones: {}, // Guardará las habitaciones seleccionadas
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (reservation) {
      setFormData({
        user_id: reservation.user_id || '',
        number_of_people:reservation.number_of_people||'',
        room_type_id: reservation.room_type_id || '',
        check_in: reservation.check_in || '',
        check_out: reservation.check_out || '',
        habitaciones: reservation.habitaciones || {}, // Asegurar que se carguen correctamente
      })
    }
  }, [reservation])

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const ajustarCantidad = (roomTypeId, cantidad) => {
    setFormData((prevData) => ({
      ...prevData,
      habitaciones: {
        ...prevData.habitaciones,
        [roomTypeId]: Math.max((prevData.habitaciones[roomTypeId] || 0) + cantidad, 0), // Evita negativos
      },
    }))
  }

  const calcularTotalHabitaciones = () => {
    return Object.values(formData.habitaciones).reduce((acc, cantidad) => acc + cantidad, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const endpoint = reservation?.id
        ? `/api/reservations/${reservation.id}`
        : `/api/reservations`
      const method = reservation?.id ? axios.put : axios.post
      await method(endpoint, formData)
      Swal.fire("¡Éxito!", "Reserva procesada exitosamente", "success")
      onFormSubmit()
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {})
      } else {
        Swal.fire("Error", "No se pudo procesar la solicitud", "error")
      }
    }

    setLoading(false)
  }

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto lg:max-w-3xl h-[90vh] overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {reservation ? 'Editar reserva' : 'Nueva reserva'}
      </h1>
      {/* Contenedor con scroll */}
      <div className="overflow-y-auto max-h-[80vh]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="user_id">Cliente</Label>
            <select
              id="user_id"
              value={formData.user_id}
              onChange={(e) => handleChange('user_id', e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled
            >
              <option value="" >Seleccionar cliente</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>

            {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Label htmlFor="check_in">Fecha de Entrada</Label>
              <Input
                id="check_in"
                type="date"
                value={formData.check_in}
                onChange={(e) => handleChange('check_in', e.target.value)}
              />
              {errors.check_in && <p className="text-red-500 text-sm">{errors.check_in}</p>}
            </div>

            <div className="space-y-4">
              <Label htmlFor="check_out">Fecha de Salida</Label>
              <Input
                id="check_out"
                type="date"
                value={formData.check_out}
                onChange={(e) => handleChange('check_out', e.target.value)}
              />
              {errors.check_out && <p className="text-red-500 text-sm">{errors.check_out}</p>}
            </div>
          </div>
          <div className="space-y-4">
          <Label htmlFor="check_out">Número de Personas</Label>

          <Input
                id="number_of_people"
                type="number"
                value={formData.number_of_people}
                onChange={(e) => handleChange('number_of_people', e.target.value)}
              />
</div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Seleccionar habitaciones</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((roomType) => (
                <div
                  key={roomType.id}
                  className="border rounded p-4 flex flex-col items-center justify-between space-y-2"
                >
                  <div className="text-center">
                    <p className="text-sm font-medium">{roomType.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {roomType.description} - Bs.{roomType.price}/noche
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => ajustarCantidad(roomType.id, -1)}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{formData.habitaciones[roomType.id] || 0}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => ajustarCantidad(roomType.id, 1)}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {errors.habitaciones && (
              <p className="text-red-500 text-sm">{errors.habitaciones}</p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-6 w-full sm:w-auto"
            disabled={loading || calcularTotalHabitaciones() === 0}
          >
            {reservation ? 'Actualizar' : 'Crear'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ReservationForm
