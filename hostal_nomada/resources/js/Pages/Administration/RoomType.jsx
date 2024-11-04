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

export default function RoomType(props) {
    const { room_types } = props;

    // Estados del modal agregar 
    const [isAgregarOpen, setIsAgregarOpen] = useState(false);
    
    // Estados del modal editar 
    const [isEditarOpen, setIsEditarOpen] = useState(false);

    // Estados del modal eliminar
    const [isEliminarOpen, setIsEliminarOpen] = useState(false);

    // Formulario de datos agregar 
    const { data: addData, 
            setData: setAddData, 
            post, 
            processing: addProcessing, 
            errors: addErrors, 
            reset:addReset} = useForm({
                name: '',
                quantity: '',
                price: '',
                description:'',
                room_image: '',
            });
    
    // Formulario de editar datos
    const { 
        data: editData, 
        setData: setEditData, 
        put, 
        processing: editProcessing, 
        errors: editErrors, 
        reset:editReset } = useForm({
            id: '', 
            name: '',
            quantity: '',
            price: '',
            description:'',
            room_image: '',
        });

    //eliminar 
    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: deleteProcessing
        } = useForm({
            id:'',
            name:''
        });
    
    //modal agregar
    const openAgregarModal = () => setIsAgregarOpen(true);
    const closeAgregarModal = () => setIsAgregarOpen(false);
    
    //modal editar
    const openEditarModal = (room_type) => {
        setEditData({
            id: room_type.id,
            name: room_type.name,
            quantity: room_type.quantity,
            price: room_type.price,
            description: room_type.description,
            room_image: '', 
        });
        setIsEditarOpen(true);
    };
    const closeEditarModal = () => setIsEditarOpen(false);

    //modal eliminar
    const openEliminarModal = (room_type) => {
        setDeleteData({ id: room_type.id,
                        name: room_type.name
        }); 
        setIsEliminarOpen(true);
    };

    const closeEliminarModal = () => setIsEliminarOpen(false);

    const { modal_id } = usePage().props;

    useEffect(() => {
        if (modal_id === 'agregar') {
            setIsAgregarOpen(true);
        } else if(modal_id === 'editar'){
            setIsEditarOpen(true);
        } else if(modal_id === 'eliminar') {
            setIsEliminarOpen(true);
        }
    }, [modal_id]);

    // Función submit agregar
    const submitAdd = (e) => {
        e.preventDefault();
        post(route('room_types.store'), {    
            onSuccess: () =>{
                addReset('name', 'quantity', 'price','description', 'room_image'),
                setIsAgregarOpen(false);
            }  
        });
    };

    // Función submit editar
    const submitEdit = (e) => {
        e.preventDefault();
        put(route('room_types.update', editData.id), { 
            data: editData,
            onSuccess: () =>{
                editReset('id', 'name', 'quantity', 'price','description', 'room_image'), 
                setIsEditarOpen(false);
            }  
        });
    };

     // Función submit eliminar
    const submitDelete = (e) => {
        e.preventDefault();
            destroy(route('room_types.destroy', deleteData.id), {
                onSuccess: () => {
                    setIsEliminarOpen(false);
                },
            });
    };

    let i = 0; 

    return (
        <div>
            <Head title="Tipos de habitación"/>
            <AuthenticatedLayout/>
            <AdministrationBar
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tipos de habitaciones
                    </h2>
                }
            >
                <Head title="Tipos de habitaciones" />
                
                {/** tabla  */}
                <div className="py">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <button onClick={openAgregarModal} className={`${btnCrud.addButton}`}>
                            Agregar Nueva habitación
                        </button>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                        
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Id</Th>
                                            <Th>Nombre de la habitación</Th>
                                            <Th>Cantidad habitaciones</Th>
                                            <Th>Precio Unitario Bs.</Th>
                                            <Th>Descripción</Th>
                                            <Th>Imagen de la habitacion</Th>
                                            <Th>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {room_types.map((room_type) => (
                                            <Tr key={room_type.id}>
                                                <Td className={`${btnCrud.tc}`}>{i=i+1}</Td>
                                                <Td className={`${btnCrud.tc}`}>{room_type.name}</Td>
                                                <Td className={`${btnCrud.tc}`}>{room_type.quantity}</Td>
                                                <Td className={`${btnCrud.tc}`}>{room_type.price}</Td>
                                                <Td>{room_type.description}</Td>
                                                <Td>
                                                    <img src={`img/${room_type.room_image}`} alt="" className={btnCrud.image_room}/>
                                                </Td>
                                                <Td>
                                                    <div className={`${btnCrud.buttons}`}>
                                                        <button onClick={() => openEditarModal(room_type)}  className={`${btnCrud.EditButton}`}>
                                                            Editar
                                                        </button>
                                                        <button onClick={() => openEliminarModal(room_type)} className={`${btnCrud.DeleteButton}`}>
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

            {/* Modal Agregar */}
            <Modal show={isAgregarOpen} onClose={closeAgregarModal} maxWidth="md" modalId='agregar'>
                <div className="p-6">
                    <h2 className="font-semibold">Agregar nueva habitación</h2>
                    <form onSubmit={submitAdd} encType="multipart/form-data">
                        <div>
                            <InputLabel htmlFor="name" value="Nombre de la habitación:" />
                            <TextInput
                                id="name"
                                name="name"
                                value={addData.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setAddData('name', e.target.value)}
                                required
                            />
                            <InputError message={addErrors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="quantity" value="Cantidad de habitaciones:" />
                            <TextInput
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={addData.quantity}
                                className="mt-1 block w-full"
                                autoComplete="quantity"
                                isFocused={true}
                                onChange={(e) => setAddData('quantity', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={addErrors.quantity} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="price" value="Precio unitario (Bs):" />
                            <TextInput
                                type="number"
                                id="price"
                                name="price"
                                value={addData.price}
                                className="mt-1 block w-full"
                                autoComplete="price"
                                isFocused={true}
                                onChange={(e) => setAddData('price', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={addErrors.price} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Descripción de la habitación:" />
                            <TextInput
                                id="description"
                                name="description"
                                value={addData.description}
                                className="mt-1 block w-full"
                                autoComplete="description"
                                isFocused={true}
                                onChange={(e) => setAddData('description', e.target.value)}
                                required
                            />
                            <InputError message={addErrors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="room_image" value="Cargar imagen de la habitación:" />
                            <TextInput
                                type="file"
                                id="room_image"
                                name="room_image"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file && file.size < 5 * 1024 * 1024) {
                                        setAddData('room_image', file);
                                    } else {
                                        alert("El archivo debe ser menor a 5MB.");
                                    }
                                }}
                                required
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={addProcessing}>
                                Agregar
                            </PrimaryButton>
                            <PrimaryButton onClick={closeAgregarModal} className="ms-4" type="button">
                                Cancelar
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Editar */}
            <Modal show={isEditarOpen} onClose={closeEditarModal} maxWidth="md" modalId='editar'>
                <div className="p-6">
                    <h2 className="font-semibold">Editar habitación</h2>
                    <form onSubmit={submitEdit} encType="multipart/form-data">
                        <div>
                            <InputLabel htmlFor="name" value="Nombre de la habitación:" />
                            <TextInput
                                id="name"
                                name="name"
                                value={editData.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setEditData('name', e.target.value)}
                                required
                            />
                            <InputError message={editErrors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="quantity" value="Cantidad de habitaciones:" />
                            <TextInput
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={editData.quantity}
                                className="mt-1 block w-full"
                                autoComplete="quantity"
                                isFocused={true}
                                onChange={(e) => setEditData('quantity', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={editErrors.quantity} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="price" value="Precio unitario (Bs):" />
                            <TextInput
                                type="number"
                                id="price"
                                name="price"
                                value={editData.price}
                                className="mt-1 block w-full"
                                autoComplete="price"
                                isFocused={true}
                                onChange={(e) => setEditData('price', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={editErrors.price} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Descripción de la habitación:" />
                            <TextInput
                                id="description"
                                name="description"
                                value={editData.description}
                                className="mt-1 block w-full"
                                autoComplete="description"
                                isFocused={true}
                                onChange={(e) => setEditData('description', e.target.value)}
                                required
                            />
                            <InputError message={editErrors.description} className="mt-2" />
                        </div>

                        {/* <div>
                            <InputLabel htmlFor="room_image" value="Cargar imagen de la habitación:" />
                            <TextInput
                                type="file"
                                id="room_image"
                                name="room_image"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file && file.size < 5 * 1024 * 1024) {
                                        setEditData('room_image', file);
                                    } else {
                                        alert("El archivo debe ser menor a 5MB.");
                                    }
                                }}
                            />
                        </div> */}

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={editProcessing}>
                                Guardar cambios
                            </PrimaryButton>
                            <PrimaryButton onClick={closeEditarModal} className="ms-4" type="button">
                                Cancelar
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal eliminar */}
            <Modal show={isEliminarOpen} onClose={closeEliminarModal} maxWidth="md" modalId='eliminar'>
                <div className="p-6">
                    <h2 className="font-semibold">Eliminar habitación</h2>
                    <form onSubmit={submitDelete} encType="multipart/form-data">
                        <div>
                            <h2>Estas seguro de eliminar la habitacion {deleteData.name}?</h2>
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
            </Modal>
        </div>
    );
}