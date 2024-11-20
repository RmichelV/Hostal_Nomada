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
    price: 1,
    dish_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dish && Object.keys(dish).length > 0) {
      setFormData({
        dishname: dish.dishname || '',
        description: dish.description || '',
        price: dish.price || 1,
        dish_image: dish.dish_image || null,
      });
    }
  }, [dish]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({ ...prevData, dish_image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'dish_image' && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      let response;
      if (dish?.id) {
        response = await axios.post(`/api/restaurant_dishes/${dish.id}`, formDataToSend, {
          headers: { 'X-HTTP-Method-Override': 'PUT' },
        });

        if (response.status === 200) {
          Swal.fire("¡Éxito!", "Plato actualizado exitosamente", "success");
          onFormSubmit(formData);
        }
        else {
          Swal.fire("Error", "No se pudo actualizar el tipo de habitación", "error");
        }
        onFormSubmit(formData);
      } else {
        response = await axios.post('/api/restaurant_dishes', formDataToSend);

        if (response.status >= 200 && response.status <= 250) {
          Swal.fire("¡Éxito!", "Plato agregado exitosamente", "success");
          onFormSubmit(formData);
        }
        else {
          Swal.fire("Error", "No se pudo agregar el tipo de habitación", "error");
        }
      }

      if (response && response.status === 422) {
        setErrors(response.data.errors || {});
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un error inesperado", "error");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {dish && dish.id ? 'Editar Plato' : 'Agregar Nuevo Plato'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="dishname" className="text-right">Nombre del Plato</Label>
          <Input
            id="dishname"
            name="dishname"
            value={formData.dishname}
            onChange={(e) => handleChange('dishname', e.target.value)}
            required
          />
          {errors.dishname && <p className="text-red-500 text-sm">{errors.dishname}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="description" className="text-right">Descripción</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="price" className="text-right">Precio</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="dish_image" className="text-right">Imagen del Plato</Label>
          <Input
            id="dish_image"
            name="dish_image"
            type="file"
            onChange={handleFileChange}
          />
          {errors.dish_image && <p className="text-red-500 text-sm">{errors.dish_image}</p>}
        </div>

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          {loading ? 'Enviando...' : dish && dish.id ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </div>
  );
};

export default DishForm;
