import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import Swal from 'sweetalert2'

const EmployeeForm = ({ users, shifts, employee, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    shift_id: '',
    hire_date: '',
    salary: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (employee) {
      setFormData({
        user_id: employee.user_id || '',
        shift_id: employee.shift_id || '',
        hire_date: employee.hire_date || '',
        salary: employee.salary || '',
      })
    }
  }, [employee])

  const salarioOnChage = (e) => {
    let value = e.target.value;  // No cambies esta variable directamente, la modificarás más abajo.
    if (/^\d*\.?\d*$/.test(value)) {
      if (value !== "" && value.startsWith("0")) {
        value = value.replace(/^0+/, ""); // Elimina ceros iniciales
      }
      const numericValue = parseFloat(value) || 0; // Convierte el valor a número (maneja vacío como 0)
      if (numericValue >= 0 && numericValue <= 25000) {
        handleChange('salary', value);  // Actualiza el estado con el nuevo valor
      }
    }
  };
  const salarioOnkeyDown = (e)=>{
    if (
      e.key === 'e' || 
      e.key === 'E' || 
      e.key === '+' || 
      e.key === '-' || 
      (!/^\d$/.test(e.key) && e.key !== '.' && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')
    ) {
      e.preventDefault();
    }
  }

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const endpoint = employee?.id ? `/api/employees/${employee.id}` : '/api/employees'
      const method = employee?.id ? 'put' : 'post'
      
      await axios[method](endpoint, formData)
      Swal.fire("¡Éxito!", `Empleado ${employee?.id ? 'actualizado' : 'agregado'} exitosamente`, "success")
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

  const renderInputField = (label, id, type = 'text', required = true, onChange, onKeyDown) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input
        id={id}
        type={type}
        name={id}
        value={formData[id]}
        onChange={onChange || ((e) => handleChange(e.target.name, e.target.value))}
        onKeyDown={onKeyDown}
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
          <option key={option.id} value={option.id}>{option.name} {option.identification_number? `- `+option.identification_number: null} </option>
        ))}
      </select>
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{employee ? 'Editar empleado' : 'Agregar nuevo empleado'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderSelectField('Usuario', 'user_id', users)}
        {renderSelectField('Turno', 'shift_id', shifts)}
        {renderInputField('Fecha de Contratación', 'hire_date', 'date',true,)}
        {renderInputField('Salario', 'salary', 'number',true,salarioOnChage,salarioOnkeyDown)}

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          {employee ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </div>
  )
}

export default EmployeeForm
