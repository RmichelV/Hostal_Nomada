import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Swal from 'sweetalert2';

const UserForm = ({  rols,countries, user, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    country_id: '',
    rol_id: '',
    identification_number: '',
    birthday: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        country_id: user.country_id || '',
        rol_id: user.rol_id || '',
        identification_number: user.identification_number || '',
        birthday: user.birthday || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
      delete dataToSubmit.password_confirmation;
    }
    try {
      const endpoint = user?.id ? `/api/users/${user.id}` : '/api/users';
      const method = user?.id ? 'put' : 'post';

      await axios[method](endpoint, dataToSubmit);
      Swal.fire("¡Éxito!", `Usuario ${user?.id ? 'actualizado' : 'agregado'} exitosamente`, "success");
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

  const renderInputField = (label, id, type = 'text', required = true) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input
        id={id}
        type={type}
        name={id}
        value={formData[id]}
        onChange={(e) => handleChange(id, e.target.value)}
        className="w-full"
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );

  const renderSelectField = (label, id, options = []) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <select
        value={formData[id]}
        onChange={(e) => handleChange(id, e.target.value)}
        
        className="col-span text-slate-800 border border-gray-300 rounded-md px-3 py-2 bg-white"
      >
        <option value="">Seleccionar {label}</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="p-6 flex flex-col max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{user ? 'Editar usuario' : 'Agregar nuevo usuario'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderInputField('Nombre', 'name')}
        {renderInputField('Correo Electrónico', 'email', 'email')}
        {renderInputField('Número de Identificación', 'identification_number', 'number')}
        {renderInputField('Fecha de Nacimiento', 'birthday', 'date', false)}
        {renderInputField('Teléfono', 'phone', 'tel', false)}
        {renderSelectField('País', 'country_id', countries)}
        {renderSelectField('Rol', 'rol_id', rols)}
        {user ? (
          <>
            {renderInputField('Contraseña (dejar vacío si no se desea cambiar)', 'password', 'password', false)}
            {renderInputField('Confirmar Contraseña', 'password_confirmation', 'password',false)}
          </>
        ) : (
          <>
            {renderInputField('Contraseña', 'password', 'password')}
            {renderInputField('Confirmar Contraseña', 'password_confirmation', 'password_confirmation')}
          </>
        )}

        <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={loading}>
          {user ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
