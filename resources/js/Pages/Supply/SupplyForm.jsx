import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Swal from 'sweetalert2';

const SupplyForm = ({ supply = {}, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 1,
    supply_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supply && Object.keys(supply).length > 0) {
      setFormData({
        name: supply.name || '',
        description: supply.description || '',
        price: supply.price || 1,
        supply_image: supply.supply_image || null,
      });
    }
  }, [supply]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({ ...prevData, supply_image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'supply_image' && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      let response;
      if (supply?.id) {
        response = await axios.post(`/api/supplies/${supply.id}`, formDataToSend, {
          headers: { 'X-HTTP-Method-Override': 'PUT' },
        });

        if (response.status === 200) {
          Swal.fire("¡Éxito!", "Suministro actualizado exitosamente", "success");
          onFormSubmit(response.data);
        }
      } else {
        response = await axios.post('/api/supplies', formDataToSend);

        if (response.status >= 200 && response.status <= 250) {
          Swal.fire("¡Éxito!", "Suministro agregado exitosamente", "success");
          onFormSubmit(response.data);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        Swal.fire("Error", "Ocurrió un error inesperado", "error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {supply && supply.id ? 'Editar Suministro' : 'Agregar Nuevo Suministro'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
          <Label htmlFor="supply_image">Imagen</Label>
          <Input
            id="supply_image"
            type="file"
            onChange={handleFileChange}
          />
          {errors.supply_image && <p className="text-red-500 text-sm">{errors.supply_image}</p>}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : supply && supply.id ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </div>
  );
};

export default SupplyForm;
