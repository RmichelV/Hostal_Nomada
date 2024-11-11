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
import { data } from 'autoprefixer';

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
                    price: room_type.price,
                    number_of_rooms:'',
                    number_of_people:'',
                    check_in:'',
                    check_out:'',
                });
            }
        })
    };

    // const numberPeople = (e) => {
    //     console.log("valor ingresado: " + e.target.value); // Muestra el valor actual del input
    //     setAddData((prevData) => ({ ...prevData, number_of_rooms: e.target.value.replace(/[^0-9]/g, '') }));
    // };
    const numberPeople = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
    
        // Verificar si el valor es uno de los permitidos
        if (value === "" || value === "1" || value === "2" || value === "3") {
            console.log("valor ingresado: " + value); // Muestra el valor actual del input
            setAddData((prevData) => ({ ...prevData, number_of_rooms: value }));
        } else {
            // Si el valor no es válido, no hacer nada o resetear el valor a "1"
            console.log("Valor no válido, solo 1, 2 o 3 son permitidos");
        }
    };

    // Este useEffect se ejecutará cada vez que `addData.number_of_rooms` cambie
    useEffect(() => {
        const rt = addData.room_type_id
        console.log("valor actualizado en addData.number_of_rooms:", addData.number_of_rooms);

        room_types.map(room_type=>{
            if(rt==room_type.id){
                if(room_type.name === "Simple"){
                    const nr = addData.number_of_rooms * 1
                    setAddData('number_of_people',nr)
                } else if (room_type.name === "Doble"){
                    const nr = addData.number_of_rooms * 2
                    setAddData('number_of_people',nr)
                }else if (room_type.name === "Triple" || room_type.name === "Familiar" ){
                    const nr = addData.number_of_rooms * 3
                    setAddData('number_of_people',nr)
                }
            }
        })
    }, [addData.number_of_rooms]);

    ////// no tocar  nada de arriba 
//check in
    const checkIn = (e) => {
        const dateValue = e.target.value;
        const [year, month, day] = dateValue.split("-");
    
        // Validamos que el año no sea mayor a 4 caracteres
        if (year.length > 4) {
            return;
        }
    
        // Actualizamos el estado con el nuevo valor de check_out
        setAddData((prevData) => ({ ...prevData, check_in: dateValue }));
    };
    
    // Usamos el useEffect para monitorear el valor de check_out y mostrarlo cuando cambia
    useEffect(() => {
        console.log("valor actualizado en check_out:", addData.check_in);
    }, [addData.check_in]);

//check_out 
    const checkOut = (e) => {
        const dateValue = e.target.value;
        const [year, month, day] = dateValue.split("-");
    
        // Validamos que el año no sea mayor a 4 caracteres
        if (year.length > 4) {
            return;
        }
    
        // Actualizamos el estado con el nuevo valor de check_out
        setAddData((prevData) => ({ ...prevData, check_out: dateValue }));
    };
    
    // Usamos el useEffect para monitorear el valor de check_out y mostrarlo cuando cambia
    useEffect(() => {
        console.log("valor actualizado en check_out:", addData.check_out);
    }, [addData.check_out]);

    const [showDivs, setShowDivs] = useState(false);

    //precioTotal de las habitaciones
    const calcular = (e) => {

        const pU = addData.price
        const nR = addData.number_of_rooms;
        const nP = addData.number_of_people;
        const cI = new Date(addData.check_in);
        const cO = new Date(addData.check_out);
        const calcularDiferenciaDias = (fechaInicio, fechaFin) => {
            // Calcula la diferencia en milisegundos
            const diferenciaMs = fechaFin - fechaInicio;
        
            // Convierte de milisegundos a días
            const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
        
            return diferenciaDias;
        };
        
        const diasDiferencia = calcularDiferenciaDias(cI, cO);
        
        const precioT = pU * nP * diasDiferencia
        // setAddData('total_price',precioT);
        // setAddData((prevData) => ({ ...prevData, total_price: precioT }));

        
        if(precioT>0){
            setAddData((prevData) => ({ ...prevData, total_price: precioT }));
            setShowDivs(!showDivs);
        }else if (precioT<= 0){
            setAddData((prevData) => ({ ...prevData, total_price: 0 }));
            setShowDivs(false);
            alert("Por favor agregue datos correctos en: numero de habitaciones y fechas de ingreso y salida")
        }
    }
    useEffect(() => {
        console.log("Total Price:", addData.total_price);
        console.log("Show Divs:", showDivs);
    }, [addData.total_price, showDivs]);

    

    // Función submit agregar
    const submitAdd = (e) => {
        e.preventDefault();
        if (!addData.room_type_id) {
            alert("Por favor, seleccione un tipo de habitación.");
            return; 
        } else if (!addData.number_of_people) {
            alert("Por favor, seleccione una cantidad de personas.");
            return; 
        } else if (!addData.total_price) {
            alert("Por favor, presione calcular para ver el precio total");
            return; 
        }else {
            
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
                // header={
                //     <h2 className={`${ReservationsCss.title_h}`}>
                //         Reserva aquí
                //     </h2>
                // }
            />

            <header className="bg-white shadow">
                    <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${ReservationsCss.title_h}`}>
                        Reserva Aquí
                    </div>
            </header>

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
                                        onChange={checkIn}
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
                                        onChange={checkOut} 
                                        required
                                    />

                                    <InputError message={addErrors.check_out} className="mt-2" />
                                </div>
                                
                                <div className="mt-4 flex items-center justify-end">
                                    <PrimaryButton className="ms-4" onClick = {calcular} type="button">
                                        Calcular precio
                                    </PrimaryButton>
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
                                        required
                                        readOnly
                                    />
                                    <InputError message={addErrors.total_price} className="mt-2" />
                                </div>
                                
                                    
                                {showDivs && (
                                    <>
                                        <div className={ReservationsCss.qR}>
                                            <img src={'img/qr.jpeg'} alt="" />
                                            <InputLabel htmlFor="precioTotal" value={"Precio total: "+addData.total_price} />
                                            <InputLabel htmlFor="precioTotal" value="Concepto: Reservación de habitaciones" />
                                        </div>

                                        <div className="mt-4 flex items-center justify-end">
                                        <PrimaryButton className="ms-4" disabled={addProcessing}>
                                            Reservar
                                        </PrimaryButton>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

