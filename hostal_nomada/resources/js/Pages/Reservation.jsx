import React, { useState, useEffect } from 'react';
//componentes 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

//formulario
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Reservation(props) {
    const { reservations, room_types, users} = props;

    // Formulario de datos agregar 
    const { data: addData, 
            setData: setAddData, 
            post, 
            processing: addProcessing, 
            errors: addErrors, 
            reset:addReset} = useForm({
                room_type_id: '',
                number_of_rooms: '',
                number_of_people: '',
                check_in: '',
                check_out: '',
                total_price: '',
            });


            const roomCapacityLimits = {
                10: 1,
                11: 2,
                12: 3,
                13: 3,
                14: 2,
                15: 2,

            };

            // const handleRoomTypeChange = (e) => {
            //     const selectedRoomTypeId = e.target.value; //no tocar 

            //     const numberOfRooms = addData.number_of_rooms;
                
            //     // console.log(selectedRoomTypeId);
                    
            //     const selectedRoomType = room_types.find(room => room.id === parseInt(selectedRoomTypeId)); //no tocar
                
            //     setAddData('room_type_id', selectedRoomTypeId); //no tocar 

            //     if (selectedRoomType) { // no tocar 
            //         setAddData('price', selectedRoomType.price);

                    
            //     } 

            // };

            const handleRoomTypeChange = (e) => {
                const selectedRoomTypeId = e.target.value; // Esto es el id seleccionado en el input, en formato string.
            
                const selectedRoomType = room_types.find(room => room.id === parseInt(selectedRoomTypeId)); // Encuentra el objeto que coincide
            
                // Aquí puedes acceder al id del
                const numberOfRooms = addData.number_of_rooms; 
                const roomId = selectedRoomType?.id; // Esto devolverá el id como un número o `undefined` si no se encontró
            
                setAddData('room_type_id', selectedRoomTypeId); // Actualiza el room_type_id en el setAddData.
            
                if (selectedRoomType) { // Si se encuentra el tipo de habitación
                    setAddData('price', selectedRoomType.price); 
                    
                
                }

                const checkIn = new Date(addData.check_in);
                const checkOut = new Date(addData.check_out);
                
                const diffTime = Math.abs(checkOut - checkIn); // Resta en milisegundos
                const total_dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir a días
                
                const tp = total_dias * 
                setAddData('total_price',tp);

            };




    // Función submit agregar
    const submitAdd = (e) => {
        e.preventDefault();
        if (!addData.room_type_id) {
            alert("Por favor, seleccione un tipo de habitación.");
            return; 
        } else if (!addData.number_of_people) {
            alert("Por favor, seleccione una cantidad de personas.");
            return; 
        } else {
            
        }
        post(route('reservations.store'), {    
            onSuccess: () =>{
                addReset(),
                setIsAgregarOpen(false);
            }  
        });
    };

    let i = 0; 

    return (
        <div>
            <Head title="Reservar"/>
            <AuthenticatedLayout/>

                <div className="py">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                            <form onSubmit={submitAdd} encType="multipart/form-data">
                        
                                <div>
                                    <InputLabel htmlFor="room_type_id" value="Tipo de habitación:" />
                                    <select 
                                        name="room_type_id" 
                                        id="room_type_id"
                                        value={addData.room_type_id}
                                        onChange={handleRoomTypeChange} 
                                    >
                                        <option value="">Seleccione un tipo de habitación</option>
                                        {room_types.map(room_type => (
                                            <option key={room_type.id} value={room_type.id}>
                                                {room_type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <InputLabel htmlFor="price" value="Precio:" />
                                    <TextInput
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={addData.price}
                                        className="mt-1 block w-full"
                                        autoComplete="price"
                                        readOnly // Esto evita que el usuario pueda editarlo directamente
                                    />
                                    <InputError message={addErrors.price} className="mt-2" />
                                </div>
                                

                                <div>
                                    <InputLabel htmlFor="number_of_rooms" value="Cantidad de habitaciones: " />
                                    <TextInput
                                        type="number"
                                        id="number_of_rooms"
                                        name="number_of_rooms"
                                        value={addData.number_of_rooms}
                                        className="mt-1 block w-full"
                                        autoComplete="number_of_rooms"
                                        isFocused={true}
                                        onChange={(e) => setAddData('number_of_rooms', e.target.value.replace(/[^0-9]/g, ''))}
                                        required
                                    />
                                    <InputError message={addErrors.number_of_rooms} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="number_of_people" value="Cantidad de personas: " />
                                    <input 
                                        type="text" 
                                        name="number_of_people" 
                                        id="number_of_people" 
                                        value={addData.number_of_people} 
                                        onChange={(e) => setAddData('number_of_people', e.target.value.replace(/[^0-9]/g, ''))}
                                    />
                                    <InputError message={addErrors.number_of_people} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="check_in" value="Fecha de ingreso:" />

                                    <TextInput
                                        type='date'
                                        id="check_in"
                                        name="check_in"
                                        value={addData.check_in}
                                        className="mt-1 block w-full"
                                        autoComplete="check_in"
                                        isFocused={true}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                            const [year, month, day] = dateValue.split("-");

                                            if (year.length > 4) {
                                                return; 
                                            }
                                            setAddData('check_in', dateValue); 
                                        }}
                                        required
                                    />

                                    <InputError message={addErrors.check_in} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="check_out" value="Fecha de salida:" />

                                    <TextInput
                                        type='date'
                                        id="check_out"
                                        name="check_out"
                                        value={addData.check_out}
                                        className="mt-1 block w-full"
                                        autoComplete="check_out"
                                        isFocused={true}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                            const [year, month, day] = dateValue.split("-");

                                            if (year.length > 4) {
                                                return; 
                                            }
                                            setAddData('check_out', dateValue); 
                                        }}
                                        required
                                    />

                                    <InputError message={addErrors.check_out} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="total_price" value="Precio Total: " />
                                    <TextInput
                                        type="number"
                                        id="total_price"
                                        name="total_price"
                                        value={addData.total_price}
                                        className="mt-1 block w-full"
                                        autoComplete="total_price"
                                        isFocused={true}
                                        onChange={(e) => setAddData('total_price', e.target.value.replace(/[^0-9]/g, ''))}
                                        required
                                    />
                                    <InputError message={addErrors.total_price} className="mt-2" />
                                </div>

                                <div>
                                    <img src={'img/qr.jpg'} alt="" />
                                </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={addProcessing}>
                                Agregar
                            </PrimaryButton>

                        </div>
                    </form>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

