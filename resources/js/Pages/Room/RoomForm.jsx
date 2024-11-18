import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Swal from 'sweetalert2'

const RoomForm = ({ roomTypes, room, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    room_type_id: '',
    status: true, // Default status to true (active)
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        room_type_id: room.room_type_id || '',
        status: room.status !== undefined ? room.status : true, // Handle the status if the room exists
      })
    }
  }, [room])

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const endpoint = room?.id ? `/api/rooms/${room.id}` : '/api/rooms'
      const method = room?.id ? 'put' : 'post'

      await axios[method](endpoint, formData)
      Swal.fire("¡Éxito!", `Habitación ${room?.id ? 'actualizada' : 'agregada'} exitosamente`, "success")
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
    <div className="p-6 flex flex-col max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{room ? 'Editar habitación' : 'Agregar nueva habitación'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="name" className="text-right">Nombre de Habitación</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="flex-1">
            <Label htmlFor="room_type_id" className="text-right">Tipo de habitación</Label>
            <select
              value={formData.room_type_id}
              onChange={(e) => handleChange('room_type_id', e.target.value)}
              className="w-full text-slate-800 border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="">Seleccionar tipo</option>
              {roomTypes.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
            {errors.room_type_id && <p className="text-red-500 text-sm">{errors.room_type_id}</p>}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Label htmlFor="status" className="text-right">¿Está activa?</Label>
          <input
            id="status"
            type="checkbox"
            checked={formData.status}
            onChange={(e) => handleChange('status', e.target.checked)}
            className="h-5 w-5"
          />
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
        </div>

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          {room ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </div>
  )
}

export default RoomForm
