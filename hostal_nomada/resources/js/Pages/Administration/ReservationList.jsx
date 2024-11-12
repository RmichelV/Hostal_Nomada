import React, { useState, useEffect } from 'react';
//componentes 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdministrationBar from '@/Layouts/AdministrationNav';

//tabla
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

//formulario
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

//modal 
import Modal from '@/Components/Modal';
//css
import btnCrud from '../../../css/botonesCrud.module.css';
import ReservationsCss from '/resources/css/Reservations.module.css';

export default function ReservationList(props) {
    const { users, reservations, room_types } = props;
    
    // Estados del modal editar 
    const [isEditarOpen, setIsEditarOpen] = useState(false);

    // Estados del modal eliminar
    const [isEliminarOpen, setIsEliminarOpen] = useState(false);

    // Formulario de editar datos
    const { 
        data: editData, 
        setData: setEditData, 
        put, 
        processing: editProcessing, 
        errors: editErrors, 
        reset:editReset } = useForm({
            id:'',
            room_type_id: '',
            price:'',
            number_of_rooms: '',
            number_of_people: '',
            check_in: '',
            check_out: '',
            total_price: '',
        });

    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: deleteProcessing
        } = useForm({
            id:'',
            user_id:'',
            room_type_id: '',
            price:'',
            number_of_rooms: '',
            number_of_people: '',
            check_in: '',
            check_out: '',
            total_price: '',
        });
    
        
    //modal editar
    const openEditarModal = (reservation) => {
        setEditData({
            id:reservation.id,
            room_type_id:reservation.room_type_id,
            price:'',
            number_of_rooms: reservation.number_of_rooms,
            number_of_people: reservation.number_of_people,
            check_in: reservation.check_in,
            check_out: reservation.check_out,
            total_price: reservation.total_price,
        });
        setIsEditarOpen(true);
    };
    const closeEditarModal = () => setIsEditarOpen(false);

    //constantes de la edicion del modal 

    const roomPrice = (e) => {
        const th = e.target.value 
        setEditData('room_type_id',th) 
        console.log('este es el id del cuarto selecionado: ' + th)
        room_types.map(room_type=>{
            if(room_type.id == th){
                console.log('este es el nombre de la habitacion seleccionada: '+ room_type.name);
                console.log('este es el precio de la habitacion seleccionada: '+ room_type.price);
                setEditData({
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


    const numberPeople = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
    
        // Verificar si el valor es uno de los permitidos
        if (value === "" || value === "1" || value === "2" || value === "3") {
            console.log("valor ingresado: " + value); // Muestra el valor actual del input
            setEditData((prevData) => ({ ...prevData, number_of_rooms: value }));
        } else {
            // Si el valor no es válido, no hacer nada o resetear el valor a "1"
            console.log("Valor no válido, solo 1, 2 o 3 son permitidos");
        }
    };

    useEffect(() => {
        const rt = editData.room_type_id
        console.log("valor actualizado en addData.number_of_rooms:", editData.number_of_rooms);

        room_types.map(room_type=>{
            if(rt==room_type.id){
                if(room_type.name === "Simple"){
                    const nr = editData.number_of_rooms * 1
                    setEditData('number_of_people',nr)
                } else if (room_type.name === "Doble"){
                    const nr = editData.number_of_rooms * 2
                    setEditData('number_of_people',nr)
                }else if (room_type.name === "Triple" || room_type.name === "Familiar" ){
                    const nr = editData.number_of_rooms * 3
                    setEditData('number_of_people',nr)
                }
            }
        })
    }, [editData.number_of_rooms]);

    //check in
    const checkIn = (e) => {
        const dateValue = e.target.value;
        const [year, month, day] = dateValue.split("-");
    
        // Validamos que el año no sea mayor a 4 caracteres
        if (year.length > 4) {
            return;
        }
    
        // Actualizamos el estado con el nuevo valor de check_out
        setEditData((prevData) => ({ ...prevData, check_in: dateValue }));
    };
    
    // Usamos el useEffect para monitorear el valor de check_out y mostrarlo cuando cambia
    useEffect(() => {
        console.log("valor actualizado en check_out:", editData.check_in);
    }, [editData.check_in]);

//check_out 
    const checkOut = (e) => {
        const dateValue = e.target.value;
        const [year, month, day] = dateValue.split("-");
    
        // Validamos que el año no sea mayor a 4 caracteres
        if (year.length > 4) {
            return;
        }
    
        // Actualizamos el estado con el nuevo valor de check_out
        setEditData((prevData) => ({ ...prevData, check_out: dateValue }));
    };
    
    // Usamos el useEffect para monitorear el valor de check_out y mostrarlo cuando cambia
    useEffect(() => {
        console.log("valor actualizado en check_out:", editData.check_out);
    }, [editData.check_out]);

    const [showDivs, setShowDivs] = useState(false);

    //precioTotal de las habitaciones
    const calcular = (e) => {

        const pU = editData.price
        const nR = editData.number_of_rooms;
        const nP = editData.number_of_people;
        const cI = new Date(editData.check_in);
        const cO = new Date(editData.check_out);
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
            setEditData((prevData) => ({ ...prevData, total_price: precioT }));
            setShowDivs(!showDivs);
        }else if (precioT<= 0){
            setEditData((prevData) => ({ ...prevData, total_price: 0 }));
            setShowDivs(false);
            alert("Por favor agregue datos correctos en: numero de habitaciones y fechas de ingreso y salida")
        }
    }
    useEffect(() => {
        console.log("Total Price:", editData.total_price);
        console.log("Show Divs:", showDivs);
    }, [editData.total_price, showDivs]);



    //modal eliminar
    const openEliminarModal = (reservation) => {
        setDeleteData({ id: reservation.id,
                        room_type_id: reservation.room_type_id
        }); 
        setIsEliminarOpen(true);
    };

    const closeEliminarModal = () => setIsEliminarOpen(false);

    const { modal_id } = usePage().props;

    useEffect(() => {
        if(modal_id === 'editar'){
            setIsEditarOpen(true);
        } else if(modal_id === 'eliminar') {
            setIsEliminarOpen(true);
        }
    }, [modal_id]);

    // Función submit editar
    const submitEdit = (e) => {
        e.preventDefault();
        put(route('reservations.update', editData.id), { 
            data: editData,
            onSuccess: () =>{
                editReset(
                    'id', 'room_type_id', 'price', 'number_of_rooms', 'number_of_people', 'check_in', 'check_out', 'total_price'
                ), 
                setIsEditarOpen(false);
            }  
        });
    };

     // Función submit eliminar
    const submitDelete = (e) => {
        e.preventDefault();
            destroy(route('reservations.destroy', deleteData.id), {
                onSuccess: () => {
                    setIsEliminarOpen(false);
                },
            });
    };

    let i = 0; 

    return (
        <div>
            <Head title="Lista de usuarios"/>
            <AuthenticatedLayout/>
            <AdministrationBar
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Lista de reservaciones registradas
                    </h2>
                }
            >
                <Head title="Lista de reservaciones registradas" />
                
                {/** tabla  */}
                <div className="py">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Id</Th>
                                            <Th>Usuario</Th>
                                            <Th>Tipo de Habitación</Th>
                                            <Th>Cantidad de habitaciones</Th>
                                            <Th>Cantidad de personas</Th>
                                            <Th>Fecha de ingreso</Th>
                                            <Th>Fecha de salida</Th>
                                            <Th>Precio Total</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {reservations.map((reservation) => (
                                            <Tr key={reservation.id}>
                                                <Td className={`${btnCrud.tc}`}>{i=i+1}</Td>
                                                <Td className={`${btnCrud.tc}`}>
                                                    {users.find(user => user.id === reservation.user_id)?.name || 'No especificado'}
                                                </Td>
                                                <Td className={`${btnCrud.tc}`}>
                                                    {room_types.find(room_type => room_type.id === reservation.room_type_id)?.name || 'No especificado'}
                                                </Td>
                                        
                                                <Td className={`${btnCrud.tc}`}>{reservation.number_of_rooms}</Td>
                                                <Td className={`${btnCrud.tc}`}>{reservation.number_of_people}</Td>
                                                <Td className={`${btnCrud.tc}`}>{reservation.check_in}</Td>
                                                <Td className={`${btnCrud.tc}`}>{reservation.check_out}</Td>
                                                <Td className={`${btnCrud.tc}`}>{reservation.total_price}</Td>
                                                
                                                <Td>
                                                    <div className={`${btnCrud.buttons}`}>
                                                        <button onClick={() => openEditarModal(reservation)}  className={`${btnCrud.EditButton}`}>
                                                            Editar
                                                        </button>
                                                        <button onClick={() => openEliminarModal(reservation)} className={`${btnCrud.DeleteButton}`}>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </AdministrationBar>

            {/* Modal Editar */}
            {/* <Modal show={isEditarOpen} onClose={closeEditarModal} maxWidth="md" modalId='editar'>
                <div className="p-6">
                    <h2 className="font-semibold">Editar Reservacion</h2>
                        <form onSubmit={submitEdit} encType="multipart/form-data">
                            <div>
                                <InputLabel htmlFor="room_type_id" value="Tipo de habitación:" />
                                <select 
                                    name="room_type_id" 
                                    id="room_type_id"
                                    value={setEditData.room_type_id}
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
                                    value={setEditData.price}
                                    className="mt-1 block w-full"
                                    autoComplete="price"
                                    readOnly
                                />
                                <InputError message={editErrors.price} className="mt-2" />
                            </div>
                                
                            <div>
                                <InputLabel htmlFor="number_of_rooms" value="Cantidad de habitaciones: " />
                                <TextInput
                                    type="number"
                                    id="number_of_rooms"
                                    name="number_of_rooms"
                                    value={setEditData.number_of_rooms}
                                    className="mt-1 block w-full"
                                    autoComplete="number_of_rooms"
                                    isFocused={true}
                                    onChange={numberPeople}
                                    required
                                />
                                <InputError message={editErrors.number_of_rooms} className="mt-2" />
                            </div>
                                
                            <div>
                                <InputLabel htmlFor="number_of_people" value="Cantidad de personas: " />
                                <input 
                                    type="text" 
                                    name="number_of_people" 
                                    id="number_of_people" 
                                    value={setEditData.number_of_people} 
                                    readOnly
                                />
                                <InputError message={editErrors.number_of_people} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="check_in" value="Fecha de ingreso:" />

                                <TextInput
                                    type='date'
                                    id="check_in"
                                    name="check_in"
                                    value={setEditData.check_in}
                                    className="mt-1 block w-full"
                                    autoComplete="check_in"
                                    isFocused={true}
                                    onChange={checkIn}
                                    required
                                />

                                <InputError message={editErrors.check_in} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="check_out" value="Fecha de salida:" />

                                <TextInput
                                    type='date'
                                    id="check_out"
                                    name="check_out"
                                    value={setEditData.check_out}
                                    className="mt-1 block w-full"
                                    autoComplete="check_out"
                                    isFocused={true}
                                    onChange={checkOut} 
                                    required
                                />

                                <InputError message={editErrors.check_out} className="mt-2" />
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
                                    value={setEditData.total_price}
                                    className="mt-1 block w-full"
                                    autoComplete="total_price"
                                    isFocused={true}
                                    required
                                    readOnly
                                />
                                <InputError message={editErrors.total_price} className="mt-2" />
                            </div>
                                
                                    
                            {showDivs && (
                                <>
                                    <div className={ReservationsCss.qR}>
                                        <img src={'img/qr.jpeg'} alt="" />
                                        <InputLabel htmlFor="precioTotal" value={"Precio total: "+editData.total_price} />
                                        <InputLabel htmlFor="precioTotal" value="Concepto: Reservación de habitaciones" />
                                    </div>

                                    <div className="mt-4 flex items-center justify-end">
                                    <PrimaryButton className="ms-4" disabled={editProcessing}>
                                        Reservar
                                    </PrimaryButton>
                                    </div>
                                </>
                            )}
                        </form>
                </div>
            </Modal> */}
             <Modal show={isEditarOpen} onClose={closeEditarModal} maxWidth="md" modalId='editar'>
                <div className="p-6">
                    <h2 className="font-semibold">Editar usuario</h2>
                    <form onSubmit={submitEdit} encType="multipart/form-data">
                        
                        <div>
                            <InputLabel htmlFor="room_type_id" value="Tipo de habitación:" />

                            <select name="room_type_id" 
                                    id="room_type_id"
                                    value={editData.room_type_id}
                                    onChange={roomPrice}
                                    >
                                {room_types.map(room_type=>[
                                    <option value={room_type.id}>{room_type.name}</option>
                                ])}
                            </select>

                        </div>

                        <div>
                            <InputLabel htmlFor="price" value="Precio:" />
                            <TextInput
                                type="number"
                                id="price"
                                name="price"
                                value={setEditData.price}
                                className="mt-1 block w-full"
                                autoComplete="price"
                                readOnly
                            />
                            <InputError message={editErrors.price} className="mt-2" />
                        </div>
                    

                        <div>
                            <InputLabel htmlFor="number_of_rooms" value="Numero de habitaciones:" />
                            <TextInput
                                type="number"
                                id="number_of_rooms"
                                name="number_of_rooms"
                                value={editData.number_of_rooms}
                                className="mt-1 block w-full"
                                autoComplete="number_of_rooms"
                                isFocused={true}
                                onChange={(e) => setEditData('number_of_rooms', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={editErrors.number_of_rooms} className="mt-2" />
                        </div>
                        
                        {/* <div>
                            <InputLabel htmlFor="nationality_id" value="Nacionalidad:" />

                            <select name="nationality_id" 
                                    id="nationality_id"
                                    value={editData.nationality_id}
                                    onChange={(e) => setEditData('nationality_id', e.target.value)}
                                    >
                                {nationalities.map(nationality=>[
                                    <option value={nationality.id}>{nationality.name}</option>
                                ])}
                            </select>

                        </div>

                        <div>
                            <InputLabel htmlFor="birthday" value="Fecha de Nacimiento:" />

                            <TextInput
                                type='date'
                                id="birthday"
                                name="birthday"
                                value={editData.birthday}
                                className="mt-1 block w-full"
                                autoComplete="birthday"
                                isFocused={true}
                                onChange={(e) => {
                                    const dateValue = e.target.value;
                                    const [year, month, day] = dateValue.split("-");

                                    if (year.length > 4) {
                                        return; 
                                    }
                                    setEditData('birthday', dateValue); 
                                }}
                                required
                            />

                            <InputError message={editErrors.birthday} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="rol_id" value="Tipo de rol:" />

                            <select name="rol_id" 
                                    id="rol_id"
                                    value={editData.rol_id}
                                    onChange={(e) => setEditData('rol_id', e.target.value)}
                                    >
                                {rols.map(rol=>[
                                    <option value={rol.id}>{rol.name}</option>
                                ])}
                            </select>

                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Telefono de contacto:" />

                            <TextInput
                                type='number'
                                id="phone"
                                name="phone"
                                value={editData.phone}
                                className="mt-1 block w-full"
                                autoComplete="phone"
                                isFocused={true}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, ''); 
                                    setEditData('phone', value);
                                }}
                                required
                            />

                            <InputError message={editErrors.phone} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={editData.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError message={editErrors.email} className="mt-2" />
                        </div> */}

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={editProcessing}>
                                Guardar cambios
                            </PrimaryButton>
                            <PrimaryButton onClick={closeEditarModal} type='button' className="ms-4">
                                Cancelar
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal eliminar */}
            {/* <Modal show={isEliminarOpen} onClose={closeEliminarModal} maxWidth="md" modalId='eliminar'>
                <div className="p-6">
                    <h2 className="font-semibold">Eliminar usuario</h2>
                    <form onSubmit={submitDelete} encType="multipart/form-data">
                        <div>
                            <h2>Estas seguro de eliminar a {deleteData.name} de tu lista de usuarios?</h2>
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={deleteProcessing}>
                                Eliminar
                            </PrimaryButton>
                            <PrimaryButton onClick={closeEliminarModal} type="button" className="ms-4">
                                Cancelar
                            </PrimaryButton>
                        </div>
                        
                    </form>
                </div>
            </Modal> */}
        </div>
    );
}