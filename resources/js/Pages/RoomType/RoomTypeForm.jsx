import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import Swal from 'sweetalert2';
import { PlusIcon, MinusIcon } from "lucide-react";

const RoomTypeForm = ({ roomType = {}, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    room_image: null,
  });
  const [supplies, setSupplies] = useState([]);
  const [newSupply, setNewSupply] = useState({ name: '', quantity: '' });
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

        // Inicializar suministros con cantidad
        setSupplies(
            (roomType.supplies || []).map((supply) => ({
                id: supply.id,
                name: supply.name,
                quantity: supply.quantity || 0, // Asegurar cantidad
            }))
        );
    }
}, [roomType]);

  
  const fetchSupplies = async () => {
    try {
      const response = await axios.get('/api/supplies');
      setSupplies(response.data);
    } catch (error) {
      console.error("Error recuperando insumos:", error);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, room_image: e.target.files[0] }));
  };

  // const handleAddSupply = () => {
  //   if (newSupply.name && newSupply.quantity) {
  //     setSupplies(prev => [...prev, { ...newSupply }]);
  //     setNewSupply({ name: '', quantity: '' });
  //   }
  // };

  const ajustarCantidad = (index, delta) => {
    setSupplies(prev => {
      const updatedSupplies = [...prev];
      updatedSupplies[index].quantity = Math.max(0, (updatedSupplies[index].quantity || 0) + delta);
      return updatedSupplies;
    });
  };

  const handleRemoveSupply = (index) => {
    setSupplies(prev => prev.filter((_, i) => i !== index));
  };
  const handleAddSupply = () => {
    if (newSupply.name && newSupply.quantity >= 1) {
      setSupplies((prev) => [
        ...prev,
        { id: newSupply.id || Date.now(), name: newSupply.name, quantity: newSupply.quantity },
      ]);
      setNewSupply({ name: '', quantity: '' });
    }
  };
  
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formDataToSend = new FormData();
  //   Object.keys(formData).forEach(key => {
  //     if (key === 'room_image' && formData[key]) {
  //       formDataToSend.append(key, formData[key]);
  //     } else {
  //       formDataToSend.append(key, formData[key]);
  //     }
  //   });

  //   formDataToSend.append('supplies', JSON.stringify(supplies));

  //   try {
  //     let response;
  //     if (roomType?.id) {
  //       response = await axios.post(`/api/roomtypes/${roomType.id}`, formDataToSend, {
  //         headers: { 'X-HTTP-Method-Override': 'PUT' },
  //       });
  //     } else {
  //       response = await axios.post('/api/roomtypes', formDataToSend);
  //     }

  //     if (response.status >= 200 && response.status < 300) {
  //       Swal.fire('¡Éxito!', 'Datos guardados correctamente.', 'success');
  //       onFormSubmit(response.data);
  //     } else {
  //       setErrors(response.data.errors || {});
  //       Swal.fire('Error', 'No se pudo guardar los datos.', 'error');
  //     }
  //   } catch (error) {
  //     Swal.fire('Error', 'Ocurrió un problema al guardar los datos.', 'error');
  //   }
  //   setLoading(false);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'room_image' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    // Filtrar suministros con cantidad >= 1
    const validSupplies = supplies.filter((supply) => supply.quantity >= 1);
    validSupplies.forEach((supply, index) => {
      formDataToSend.append(`supplies[${index}][id]`, supply.id || '');
      formDataToSend.append(`supplies[${index}][name]`, supply.name);
      formDataToSend.append(`supplies[${index}][quantity]`, supply.quantity);
    });
  
    try {
      let response;
      if (roomType?.id) {
        response = await axios.post(`/api/roomtypes/${roomType.id}`, formDataToSend, {
          headers: { 'X-HTTP-Method-Override': 'PUT' },
        });
      } else {
        response = await axios.post('/api/roomtypes', formDataToSend);
      }
  
      if (response.status >= 200 && response.status < 300) {
        Swal.fire('¡Éxito!', 'Datos guardados correctamente.', 'success');
        onFormSubmit(response.data);
      } else {
        setErrors(response.data.errors || {});
        Swal.fire('Error', 'No se pudo guardar los datos.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', `Ocurrió un problema al guardar los datos. ${error.data}`, 'error');
    }
    setLoading(false);
  };
  
  
  
  
  
  
  

  return (
    <div className="p-6 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tipos de Habitación</h1>
      <div className="overflow-y-auto max-h-[80vh]">
      <form onSubmit={handleSubmit}>
        <div className="space-y-1 ">
          <Label>Nombre</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Nombre del tipo de habitación"
            onKeyPress={(e) => {
              const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <Label>Cantidad</Label>
          <Input
            value={formData.quantity}
            onChange={(e) => {
              let value = e.target.value;
              if (/^\d*$/.test(value)) { // Permite solo números
                // Evitar múltiples ceros al inicio
                if (value !== "" && value.startsWith("0")) {
                  value = value.replace(/^0+/, ""); // Elimina ceros iniciales
                }
                const numericValue = parseInt(value, 10); // Convierte a número entero
                if ((numericValue >= 0 && numericValue <= 25) || value === "") {
                  handleInputChange('quantity', value); // Actualiza el estado si está dentro del rango o vacío
                }
              }
            }}
            type="text" // Usa "text" para evitar comportamientos no deseados de "number"
            placeholder="Cantidad"
            onKeyDown={(e) => {
              if (
                e.key === 'e' || 
                e.key === 'E' || 
                e.key === '+' || 
                e.key === '-' || 
                e.key === '.'
              ) {
                e.preventDefault(); // Bloquea caracteres no deseados
              }
            }}
          />
          <Label>Precio</Label>
          <Input
            value={formData.price}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                if (value !== "" && value.startsWith("0")) {
                  value = value.replace(/^0+/, ""); // Elimina ceros iniciales
                } // Permite números con un punto decimal
                const numericValue = parseFloat(value) || 0; // Convierte el valor a número (maneja vacío como 0)
                if (numericValue >= 0 && numericValue <= 2500) {
                  handleInputChange('price', value);
                }
              }
            }}
            type="text"
            placeholder="Precio"
            onKeyDown={(e) => {
              if (
                e.key === 'e' || 
                e.key === 'E' || 
                e.key === '+' || 
                e.key === '-' || 
                (!/^\d$/.test(e.key) && e.key !== '.' && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')
              ) {
                e.preventDefault();
              }
            }}
          />
          <Label>Descripción</Label>
          <Input
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descripción"
          />
          <Label>Imagen</Label>
          <Input type="file" onChange={handleFileChange} />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Suministros</h2>
          <div className="flex space-x-4">
            {/* <Input
              value={newSupply.name}
              onChange={(e) => setNewSupply(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={(e) => {
                const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
                if (!regex.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Nombre del suministro"
            />
            <Input
                value={newSupply.quantity}
                onChange={(e) => {
                  let value = e.target.value;
                  if (/^\d*$/.test(value)) { // Permite solo números
                    // Elimina ceros iniciales
                    if (value !== "" && value.startsWith("0")) {
                      value = value.replace(/^0+/, ""); // Sustituye múltiples ceros iniciales por un solo "0"
                    }
                    const numericValue = parseInt(value, 10); // Convierte a número entero
                    if ((numericValue >= 0 && numericValue <= 25) || value === "") {
                      setNewSupply((prev) => ({ ...prev, quantity: value })); // Actualiza el estado
                    }
                  }
                }}
                type="text" // Usa "text" para evitar comportamientos no deseados de "number"
                placeholder="Cantidad"
                onKeyDown={(e) => {
                  if (
                    e.key === 'e' || 
                    e.key === 'E' || 
                    e.key === '+' || 
                    e.key === '-' || 
                    e.key === '.' || 
                    e.key === ' ' // Bloquea espacio
                  ) {
                    e.preventDefault(); // Evita caracteres no deseados
                  }
                }}
              /> */}
          </div>

          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                {/* <TableHead>Acciones</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
    {supplies.map((supply, index) => (
        <TableRow key={index}>
            <TableCell>{supply.name}</TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    onClick={() => ajustarCantidad(index, -1)} 
                    disabled={supply.quantity <= 0} // Deshabilita si la cantidad es 0 o menor
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span>{supply.quantity || 0}</span>
                  <Button 
                    type="button" 
                    onClick={() => ajustarCantidad(index, 1)} 
                    disabled={supply.quantity >= 5} // Deshabilita si la cantidad es 5 o mayor
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            <TableCell>
                {/* <Button type="button" variant="destructive" onClick={() => handleRemoveSupply(index)}>
                    Eliminar
                </Button> */}
            </TableCell>
        </TableRow>
    ))}
</TableBody>

          </Table>
        </div>

        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? 'Guardando...' : roomType?.id ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </div></div>
  );
};

export default RoomTypeForm;
