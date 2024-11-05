import React, { useState, useEffect } from 'react';
//componentes 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

//formulario
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

//css 
import ReservationsCss from '/resources/css/Reservations.module.css';

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
                price:'',
                number_of_rooms: '',
                number_of_people: '',
                check_in: '',
                check_out: '',
                total_price: '',
            });


    const roomPrice = (e) => {
        const th = e.target.value 
        setAddData('room_type_id',th)
        console.log('este es el id del cuarto selecionado: ' + th)
        room_types.map(room_type=>{
            if(room_type.id == th){
                console.log('este es el nombre de la habitacion seleccionada: '+ room_type.name);
                setAddData({
                    room_type_id: th, 
                    price: room_type.price 
                });
            }
        })
    };

    const numberPeople = (e)=>{
        const th = addData.room_type_id
        console.log( "tipo de habitacion id:" + th)
        
        // const ch =  setAddData('number_of_rooms', e.target.value.replace(/[^0-9]/g, ''))

        const ch = e.target.value.replace(/[^0-9]/g, '');
        

        room_types.map(room_type=>{
            
            if(th == room_type.id){
                console.log(room_type.name)
                console.log("cantidad de habitaciones: "+ ch)
                let multiplier = 1;
                if (room_type.name === "Simple") multiplier = 1;
                else if (room_type.name === "Doble" || room_type.name === "Matrimonial" || room_type.name === "Suit") multiplier = 2;
                else if (room_type.name === "Triple" || room_type.name === "Familiar") multiplier = 3;
                if (ch) {
                    const num = ch * multiplier;
                    setAddData('number_of_people', num);
                    
                }
            }
        })
    }

    const precioTotal = () => {
        const { check_in, check_out, price, number_of_people, number_of_rooms } = addData;
        

            // console.log ('entrada: '=addData.check_in)
            // console.log ('salida: '= checkout)
            // console.log ('precio u: '=addData.price)
            // console.log ('personas: '=addData.number_of_people)
            // console.log ('habitaciones: '=addData.number_of_people)

        if (check_in && check_out) {
            const startDate = new Date(check_in);
            const endDate = new Date(check_out);
            const diffInTime = endDate - startDate;
            const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
            // setAddData('diasTotales', diffInDays);
            const total_price = price * number_of_rooms * number_of_people  * diffInDays

            setAddData('total_price', total_price)
        } else {
            setAddData('total_price', 0); 
        }
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
            <AuthenticatedLayout
                header={
                    <h2 className={`${ReservationsCss.title_h}`}>
                        Reserva aquí
                    </h2>
                }
            />

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
                                        onChange={roomPrice} 
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
                                        readOnly
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
                                        onChange={numberPeople}
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
                                        readOnly
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
                                            precioTotal();       
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
                                        // onChange={(e) => setAddData('total_price', e.target.value.replace(/[^0-9]/g, ''))}
                                        required
                                        readOnly
                                    />
                                    <InputError message={addErrors.total_price} className="mt-2" />
                                </div>

                                <div>
                                    <img src={'/public/img/qr.jpeg'} alt="" />
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

