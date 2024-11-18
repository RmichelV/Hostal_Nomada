import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Swal from 'sweetalert2';

const DishForm = ({ dish = {}, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    dishname: '',
    description: '',
    price: '',
    room_dish: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dish && Object.keys(dish).length > 0) {
      setFormData({
        dishname: dish.dishname || '',
        description: dish.description || '',
        price: dish.price || '',
        room_dish: dish.room_dish || null,
      });
    }
  }, [dish]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));  // Reset error when field changes
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({ ...prevData, room_dish: e.target.files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dishname) newErrors.dishname = 'El nombre del plato es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;  // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) return; // If validation fails, do not proceed

    setLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'room_dish' && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      } else if (key !== 'room_dish') {
        formDataToSend.append(key, formData[key]);
      }
    });

    let response = null;

    try {
      if (dish?.id) {
        response = await axios.post(`/api/restaurant_dishes/${dish.id}`, formDataToSend, {
          headers: { 'X-HTTP-Method-Override': 'PUT' },
        });

        if (response.status === 200) {
          Swal.fire("¡Éxito!", "Plato actualizado exitosamente", "success");
          onFormSubmit();
        } else {
          Swal.fire("Error", "No se pudo actualizar el plato", "error");
        }
      } else {
        response = await axios.post('/api/restaurant_dishes', formDataToSend);

        if (response.status >= 200 && response.status <= 250) {
          Swal.fire("¡Éxito!", "Plato agregado exitosamente", "success");
          onFormSubmit();
        } else {
          Swal.fire("Error", "No se pudo agregar el plato", "error");
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
        placeholder={placeholder}
        className="w-full"
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );

  const renderFileInput = () => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor="room_dish" className="text-right">Imagen del Plato</Label>
      <Input
        id="room_dish"
        type="file"
        name="room_dish"
        onChange={handleFileChange}
        className="w-full"
      />
    </div>
  );

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {dish && dish.id ? 'Editar Plato' : 'Agregar Nuevo Plato'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        {renderInputField('Nombre del Plato', 'dishname')}
        {renderInputField('Descripción', 'description', 'text', true, 'Añade una breve descripción del plato')}
        {renderInputField('Precio', 'price', 'decimal', true, 'Ej:10.50')}
        
        {renderFileInput()}

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          {loading ? 'Enviando...' : dish && dish.id ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </div>
  );
};

export default DishForm;
