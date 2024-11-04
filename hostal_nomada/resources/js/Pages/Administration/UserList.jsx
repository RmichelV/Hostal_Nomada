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

export default function UserList(props) {
    const { users, nationalities, rols } = props;
    
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
            id: '', 
            name: '',
            last_name:'',
            identification_number:'',
            nationality_id:'',
            birthday:'',
            rol_id:'',
            phone:'',
            email:''
        });

    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: deleteProcessing
        } = useForm({
            id:'',
            name:'',
            last_name:''
        });
    
    
    //modal editar
    const openEditarModal = (user) => {
        setEditData({
            id: user.id,
            name: user.name,
            last_name: user.last_name,
            identification_number: user.identification_number,
            nationality_id: user.nationality_id,
            birthday: user.birthday,
            rol_id: user.rol_id,
            phone: user.phone,
            email: user.email
        });
        setIsEditarOpen(true);
    };
    const closeEditarModal = () => setIsEditarOpen(false);

    //modal eliminar
    const openEliminarModal = (user) => {
        setDeleteData({ id: user.id,
                        name: user.name
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
        put(route('users.update', editData.id), { 
            data: editData,
            onSuccess: () =>{
                editReset('id', 'name', 'last_name', 'identification_number','nationality_id', 'birthday', 'rol_id', 'phone', 'email'), 
                setIsEditarOpen(false);
            }  
        });
    };

     // Función submit eliminar
    const submitDelete = (e) => {
        e.preventDefault();
            destroy(route('users.destroy', deleteData.id), {
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
                        Lista de usuarios registrados
                    </h2>
                }
            >
                <Head title="Lista de usuarios registrados" />
                
                {/** tabla  */}
                <div className="py">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Id</Th>
                                            <Th>Nombre(s)</Th>
                                            <Th>Apellido(s)</Th>
                                            <Th>Numero de identificación</Th>
                                            <Th>Nationalidad</Th>
                                            <Th>Fecha de nacimiento</Th>
                                            <Th>Tipo de rol</Th>
                                            <Th>Telefono</Th>
                                            <Th>Email</Th>
                                            <Th>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {users.map((user) => (
                                            <Tr key={user.id}>
                                                <Td className={`${btnCrud.tc}`}>{i=i+1}</Td>
                                                <Td className={`${btnCrud.tc}`}>{user.name}</Td>
                                                <Td className={`${btnCrud.tc}`}>{user.last_name}</Td>
                                                <Td className={`${btnCrud.tc}`}>{user.identification_number}</Td>
                                                <Td className={`${btnCrud.tc}`}>
                                                    {nationalities.find(nationality => nationality.id === user.nationality_id)?.name || 'No especificado'}
                                                </Td>
                                                <Td className={`${btnCrud.tc}`}>{user.birthday}</Td>
                                                <Td className={`${btnCrud.tc}`}>
                                                    {rols.find(rol => rol.id === user.rol_id)?.name || 'No especificado'}
                                                </Td>
                                                <Td className={`${btnCrud.tc}`}>{user.phone}</Td>
                                                <Td className={`${btnCrud.tc}`}>{user.email}</Td>
                                                <Td>
                                                    <div className={`${btnCrud.buttons}`}>
                                                        <button onClick={() => openEditarModal(user)}  className={`${btnCrud.EditButton}`}>
                                                            Editar
                                                        </button>
                                                        <button onClick={() => openEliminarModal(user)} className={`${btnCrud.DeleteButton}`}>
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
            <Modal show={isEditarOpen} onClose={closeEditarModal} maxWidth="md" modalId='editar'>
                <div className="p-6">
                    <h2 className="font-semibold">Editar usuario</h2>
                    <form onSubmit={submitEdit} encType="multipart/form-data">
                        <div>
                            <InputLabel htmlFor="name" value="Nombre(s)" />
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
                            <InputLabel htmlFor="last_name" value="Apellido(s)" />
                            <TextInput
                                id="last_name"
                                name="last_name"
                                value={editData.last_name}
                                className="mt-1 block w-full"
                                autoComplete="last_name"
                                isFocused={true}
                                onChange={(e) => setEditData('last_name', e.target.value)}
                                required
                            />
                            <InputError message={editErrors.last_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="identification_number" value="Numero de identificación:" />
                            <TextInput
                                type="number"
                                id="identification_number"
                                name="identification_number"
                                value={editData.identification_number}
                                className="mt-1 block w-full"
                                autoComplete="identification_number"
                                isFocused={true}
                                onChange={(e) => setEditData('identification_number', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={editErrors.identification_number} className="mt-2" />
                        </div>
                        
                        <div>
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
                        </div>

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
            <Modal show={isEliminarOpen} onClose={closeEliminarModal} maxWidth="md" modalId='eliminar'>
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
            </Modal>
        </div>
    );
}