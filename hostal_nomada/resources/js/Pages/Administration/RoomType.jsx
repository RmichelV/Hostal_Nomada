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

    // Formulario de datos
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        quantity: '',
        price: '',
        room_image: '',
    });

    // Estado del modal
    const [isAgregarOpen, setIsAgregarOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);

    const openAgregarModal = () => setIsAgregarOpen(true);
    const closeAgregarModal = () => setIsAgregarOpen(false);

    const openEditarModal = () => setIsEditarOpen(true);
    const closeEditarModal = () => setIsEditarOpen(false);

    const { modal_id } = usePage().props;

    useEffect(() => {
        if (modal_id === 'agregar') {
            setIsAgregarOpen(true);
        } else if (modal_id === 'editar') {
            setIsEditarOpen(true);
        }
    }, [modal_id]);

    // Función submit agregar
    const submitAdd = (e) => {
        e.preventDefault();
        post(route('room_types.store'), {
            
            onSuccess: () =>{
                reset('name', 'quantity', 'price', 'room_image'),
                setIsAgregarOpen(false);
            }  
        });
    };

    return (
        <div>
            <AuthenticatedLayout/>
            <AdministrationBar
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tipos de habitaciones
                    </h2>
                }
            >
                <Head title="Tipos de habitaciones" />
                
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
                                                <Td className={`${btnCrud.tc}`}>{room_type.id}</Td>
                                                <Td className={`${btnCrud.tc}`}>{room_type.name}</Td>
                                                <Td className={`${btnCrud.tc}`}>{room_type.quantity}</Td>
                                                <Td className={`${btnCrud.tc}`}>{room_type.price}</Td>
                                                <Td>{room_type.description}</Td>
                                                <Td>
                                                    <img src={`img/${room_type.room_image}`} alt=""className={btnCrud.image_room}/>
                                                </Td>
                                                <Td>
                                                    <div className={`${btnCrud.buttons}`}>
                                                        <button onClick={openEditarModal} className={`${btnCrud.addButton}`}>
                                                            Editar
                                                        </button>
                                                        <button onClick={openAgregarModal} className={`${btnCrud.addButton}`}>
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
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="quantity" value="Cantidad de habitaciones:" />
                            <TextInput
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={data.quantity}
                                className="mt-1 block w-full"
                                autoComplete="quantity"
                                isFocused={true}
                                onChange={(e) => setData('quantity', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={errors.quantity} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="price" value="Precio unitario (Bs):" />
                            <TextInput
                                type="number"
                                id="price"
                                name="price"
                                value={data.price}
                                className="mt-1 block w-full"
                                autoComplete="price"
                                isFocused={true}
                                onChange={(e) => setData('price', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Descripción de la habitación:" />
                            <TextInput
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full"
                                autoComplete="description"
                                isFocused={true}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                            />
                            <InputError message={errors.description} className="mt-2" />
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
                                        setData('room_image', file);
                                    } else {
                                        alert("El archivo debe ser menor a 5MB.");
                                    }
                                }}
                                required
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Agregar
                            </PrimaryButton>
                            <PrimaryButton onClick={closeAgregarModal} className="btn-secondary ms-4">
                                Cancelar
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}