import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Swal from 'sweetalert2';

const RoomTypeForm = ({ roomType = {}, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    room_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (roomType && Object.keys(roomType).length > 0) {
      setFormData({
        name: roomType.name || '',
        quantity: roomType.quantity || '',
        price: roomType.price || '',
        description: roomType.description || '',
        room_image: roomType.room_image || null,
      });
    }
  }, [roomType]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({ ...prevData, room_image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'room_image' && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      } else if (key !== 'room_image') {
        formDataToSend.append(key, formData[key]);
      }
    });

    let response = null;

    try {
      if (roomType?.id) {
        response = await axios.post(`/api/roomtypes/${roomType.id}`, formDataToSend, {
          headers: { 'X-HTTP-Method-Override': 'PUT' },
        });

        if (response.status === 200) {
          Swal.fire("¡Éxito!", "Tipo de habitación actualizado exitosamente", "success");
          onFormSubmit(formData); // Asegúrate de pasar el objeto completo
        } else {
          Swal.fire("Error", "No se pudo actualizar el tipo de habitación", "error");
        }
        onFormSubmit(formData); // Asegúrate de pasar el objeto completo

      } else {
        response = await axios.post('/api/roomtypes', formDataToSend);

        if (response.status >= 200 && response.status <= 250) {
          Swal.fire("¡Éxito!", "Tipo de habitación agregado exitosamente", "success");
          onFormSubmit(formData); // Asegúrate de pasar el objeto completo
        } else {
          Swal.fire("Error", "No se pudo agregar el tipo de habitación", "error");
        }
      }

      if (response && response.status === 422) {
        // Handle validation errors
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un error inesperado", "error");
    }

    setLoading(false);
  };

  const renderInputField = (label, id, type = 'text', required = true, placeholder = '') => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input
        id={id}
        type={type}
        name={id}
        value={formData[id]}
        onChange={(e) => handleChange(id, e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full"
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );

  const renderFileInput = () => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor="room_image" className="text-right">Imagen de la habitación</Label>
      <Input
        id="room_image"
        type="file"
        name="room_image"
        onChange={handleFileChange}
        className="w-full"
      />
      {errors.room_image && <p className="text-red-500 text-sm">{errors.room_image}</p>}
    </div>
  );

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {roomType && roomType.id ? 'Editar Tipo de Habitación' : 'Agregar Nuevo Tipo de Habitación'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        {renderInputField('Nombre', 'name')}
        {renderInputField('Cantidad', 'quantity', 'number', false)}
        {renderInputField('Precio', 'price', 'number')}
        {renderInputField('Descripción', 'description', 'text', true, 'Añade una breve descripción')}
        
        {renderFileInput()}

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          {loading ? 'Enviando...' : roomType && roomType.id ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </div>
  );
};

export default RoomTypeForm;
