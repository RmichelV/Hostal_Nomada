import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Swal from 'sweetalert2';

const RoomForm = ({ roomTypes, room, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    room_type_id: '',
    status: 'Libre',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        room_type_id: room.room_type_id || '',
        status: room.status || 'Libre',
      });
    }
  }, [room]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const endpoint = room?.id ? `/api/rooms/${room.id}` : '/api/rooms';
      const method = room?.id ? 'put' : 'post';

      await axios[method](endpoint, formData);
      Swal.fire("¡Éxito!", `Habitación ${room?.id ? 'actualizada' : 'agregada'} exitosamente`, "success");
      onFormSubmit();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        Swal.fire("Error", "No se pudo procesar la solicitud", "error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{room ? 'Editar habitación' : 'Agregar nueva habitación'}</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Nombre de Habitación */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-start">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="name" className="text-right">Nombre de Habitación</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-y-1">
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
            {errors.room_type_id && <p className="text-red-500 text-sm mt-1">{errors.room_type_id}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-start">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="status" className="text-right">Estado</Label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full text-slate-800 border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="Libre">Libre</option>
              <option value="Ocupada">Ocupada</option>
              <option value="No acceso">No acceso</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4 mt-6">
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            {loading ? 'Procesando...' : room ? 'Actualizar' : 'Agregar'}
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;