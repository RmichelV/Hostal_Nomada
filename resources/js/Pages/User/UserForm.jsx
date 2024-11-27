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

  //valores del onchage de los inputs 
  const nombre = (e) => {
    const value = e.currentTarget.value;
    
    // Permitir solo letras (mayúsculas y minúsculas) y espacios en blanco
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setFormData(prevData => ({ ...prevData, name: value }));
    }
  };
  //valores para identification number
  const manejarKeyDown = (e) => {
    // Prevenir que se ingrese 'e', signos de operación y cualquier otro carácter no numérico
    const invalidKeys = ['e', 'E', '+', '-', '*', '/', '.', ','];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault(); // Prevenir que se ingrese el carácter no permitido
    }
  };

  const manejarChange = (e) => {
      let value = e.currentTarget.value;
    
      // Eliminar caracteres no numéricos (esto incluye signos de operadores y la letra 'e')
      value = value.replace(/[^0-9]/g, '');
    
      // Limitar a 10 dígitos
      if (value.length <= 10) {
        setFormData(prevData => ({ ...prevData, identification_number: value })); 
      }
  };

  //año 
  const year = (e)=>{
    const year = (e) => {
      const inputValue = e.currentTarget.value;
      const [year, month, day] = inputValue.split('-');
    
      if (year && year.length > 4) {
        const correctedYear = year.slice(0, 4);
        e.currentTarget.value = `${correctedYear}-${month || ''}-${day || ''}`;
        setFormData(prevData => ({ ...prevData, birthday: e.currentTarget.value })); // Actualiza el estado correctamente
      }
    };
  }


  //telefono 
  const manejarKeyDownT = (e) => {
    const input = e.currentTarget;
    const value = input.value;
  
    // Prevenir más de un signo '+' al inicio y limitar a 10 dígitos
    if (
      (e.key === '+' && value.includes('+') && input.selectionStart !== 0) ||
      (/\d/.test(e.key) && value.replace(/\D/g, '').length >= 10)
    ) {
      e.preventDefault();
    }
  };
  
  const manejarChangeT = (e) => {
    const value = e.currentTarget.value;
    
    // Permitir solo dígitos y un único "+" al inicio
    const sanitizedValue = value.replace(/[^+\d]/g, '').replace(/^(.+?)\+/g, '$1');
    
    setFormData(prevData => ({ ...prevData, phone: sanitizedValue })); // Actualiza el estado correctamente
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

  const renderInputField = (label, id, type = 'text', required = true, onChange,onKeyDown,onInput) => (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 items-center">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input
        id={id}
        type={type}
        name={id}
        value={formData[id]}
        onChange={onChange || ((e) => handleChange(e.target.name, e.target.value))}
        onKeyDown={onKeyDown}
        onInput={onInput}
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
    <div className="p-6 flex flex-col max-w-lg mx-auto overflow-y-auto max-h-[500px]">
      <h1 className="text-2xl font-bold mb-6 text-center">{user ? 'Editar usuario' : 'Agregar nuevo usuario'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderInputField('Nombre', 'name',Text,true,nombre)}
        {renderInputField('Correo Electrónico', 'email', 'email')}
        {renderInputField('Número de Identificación', 'identification_number', 'number',true,manejarChange, manejarKeyDown)}
        {renderInputField('Fecha de Nacimiento', 'birthday', 'date', false,'','',year)}
        {renderInputField('Teléfono', 'phone', 'tel', false,manejarChangeT,manejarKeyDownT)}
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
            {renderInputField('Confirmar Contraseña', 'password_confirmation', 'password')}
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
