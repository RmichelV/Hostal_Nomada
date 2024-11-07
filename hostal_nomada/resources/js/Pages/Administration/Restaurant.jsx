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

export default function Restaurant(props) {
    const { restaurants } = props;

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
                description:'',
                food_image: '',
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
            description:'',
            food_image: '',
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
    const openEditarModal = (restaurant) => {
        setEditData({
            id: restaurant.id,
            name: restaurant.name,
            description: restaurant.description,
            food_image: '', 
        });
        setIsEditarOpen(true);
    };
    const closeEditarModal = () => setIsEditarOpen(false);

    //modal eliminar
    const openEliminarModal = (restaurant) => {
        setDeleteData({ id: restaurant.id,
                        name: restaurant.name
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
        post(route('restaurants.store'), {    
            onSuccess: () =>{
                addReset('name','description', 'food_image'),
                setIsAgregarOpen(false);
            }  
        });
    };

    // Función submit editar
    const submitEdit = (e) => {
        e.preventDefault();
        put(route('restaurants.update', editData.id), { 
            data: editData,
            onSuccess: () =>{
                editReset('id', 'name','description', 'food_image'), 
                setIsEditarOpen(false);
            }  
        });
    };

     // Función submit eliminar
    const submitDelete = (e) => {
        e.preventDefault();
            destroy(route('restaurants.destroy', deleteData.id), {
                onSuccess: () => {
                    setIsEliminarOpen(false);
                },
            });
    };

    let i = 0; 

    return (
        <div>
            <Head title="Restaurant"/>
            <AuthenticatedLayout/>
            <AdministrationBar
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Administración de Restaurant
                    </h2>
                }
            >
                <Head title="Restaurant" />
                
                {/** tabla  */}
                <div className="py">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <button onClick={openAgregarModal} className={`${btnCrud.addButton}`}>
                            Agregar Nuevo plato
                        </button>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                        
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Id</Th>
                                            <Th>Nombre del plato</Th>
                                            <Th>Descripción</Th>
                                            <Th>Imagen del plato</Th>
                                            <Th>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {restaurants.map((restaurant) => (
                                            <Tr key={restaurant.id}>
                                                <Td className={`${btnCrud.tc}`}>{i=i+1}</Td>
                                                <Td className={`${btnCrud.tc}`}>{restaurant.name}</Td>
                                                <Td>{restaurant.description}</Td>
                                                <Td>
                                                    <img src={`img/${restaurant.food_image}`} alt="" className={btnCrud.image_room}/>
                                                </Td>
                                                <Td>
                                                    <div className={`${btnCrud.buttons}`}>
                                                        <button onClick={() => openEditarModal(restaurant)}  className={`${btnCrud.EditButton}`}>
                                                            Editar
                                                        </button>
                                                        <button onClick={() => openEliminarModal(restaurant)} className={`${btnCrud.DeleteButton}`}>
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
                    <h2 className="font-semibold">Agregar nuevo plato</h2>
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
                            <InputLabel htmlFor="food_image" value="Cargar imagen de la habitación:" />
                            <TextInput
                                type="file"
                                id="food_image"
                                name="food_image"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file && file.size < 5 * 1024 * 1024) {
                                        setAddData('food_image', file);
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
                    <h2 className="font-semibold">Editar Platillo</h2>
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
                    <h2 className="font-semibold">Eliminar Plato</h2>
                    <form onSubmit={submitDelete} encType="multipart/form-data">
                        <div>
                            <h2>Estas seguro de eliminar el platillo {deleteData.name}?</h2>
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