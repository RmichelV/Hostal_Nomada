'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import Swal from 'sweetalert2'

const ReservationForm = ({ users, roomTypes, reservation, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    room_type_id: '',
    check_in: '',
    check_out: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (reservation) {
      setFormData({
        user_id: reservation.user_id || '',
        // room_type_id: reservation.room_type_id || '',
        check_in: reservation.check_in || '',
        check_out: reservation.check_out || '',
      })
    }
  }, [reservation])

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const endpoint = `/api/reservations/${reservation.id}`
      await axios.put(endpoint, formData)
      Swal.fire("¡Éxito!", "Reserva actualizada exitosamente", "success")
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

  const renderInputField = (label, id, type = 'text', required = true) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input
        id={id}
        type={type}
        name={id}
        value={formData[id]}
        onChange={(e) => handleChange(id, e.target.value)}
        required={required}
        className="w-full"
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  )

  const renderSelectField = (label, id, options) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <select
        value={formData[id]}
        onChange={(e) => handleChange(id, e.target.value)}
        required
        className="col-span text-slate-800 border border-gray-300 rounded-md px-3 py-2 bg-white"
      >
        <option value="">Seleccionar {label}</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar reserva</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderSelectField('Cliente', 'user_id', users)}
        {/* {renderSelectField('Tipo ', 'room_type_id', roomTypes)} */}
        {renderInputField('Fecha de Entrada', 'check_in', 'date')}
        {renderInputField('Fecha de Salida', 'check_out', 'date')}

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          Actualizar
        </Button>
      </form>
    </div>
  )
}

export default ReservationForm
