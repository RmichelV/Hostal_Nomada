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

export default function EmployeeList(props) {
    const { employees, users, rols, shifts } = props;

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
                user_id: '',
                hire_date: '',
                shift_id: '',
                salary:'',
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
            user_id: '',
            hire_date: '',
            shift_id: '',
            salary:'',
        });
    
    // eliminar 
    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: deleteProcessing
        } = useForm({
            id:'',
            user_id:''
        });
    
    //modal agregar
    const openAgregarModal = () => setIsAgregarOpen(true);
    const closeAgregarModal = () => setIsAgregarOpen(false);
    
    //modal editar
    const openEditarModal = (employee) => {
        setEditData({
            id: employee.id,
            user_id: employee.user_id,
            hire_date: employee.hire_date,
            shift_id: employee.shift_id,
            salary: employee.salary,
        });
        setIsEditarOpen(true);
    };
    const closeEditarModal = () => setIsEditarOpen(false);

    //modal eliminar
    const openEliminarModal = (employee) => {
        setDeleteData({ id: employee.id,
                        user_id: employee.user_id
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
        if (!addData.user_id || !addData.shift_id) {
            alert("Por favor, seleccione un usuario.");
            return; // No enviar el formulario si no hay selección
        }
        post(route('employees.store'), {    
            onSuccess: () =>{
                addReset('user_id', 'hire_date', 'shift_id','salary'),
                setIsAgregarOpen(false);
            }  
        });
    };

    // Función submit editar
    const submitEdit = (e) => {
        e.preventDefault();
        put(route('employees.update', editData.id), { 
            data: editData,
            onSuccess: () =>{
                editReset('id', 'user_id', 'hire_date', 'shift_id','salary'), 
                setIsEditarOpen(false);
            }  
        });
    };

     // Función submit eliminar
    const submitDelete = (e) => {
        e.preventDefault();
            destroy(route('employees.destroy', deleteData.id), {
                onSuccess: () => {
                    setIsEliminarOpen(false);
                },
            });
    };

    let i = 0; 

    //calculo del salario


    return (
        <div>
            <AuthenticatedLayout/>
            <AdministrationBar
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Lista de empleados 
                    </h2>
                }
            >
                <Head title="Lista de empleados" />
                
                {/** tabla  */}
                <div className="py">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <button onClick={openAgregarModal} className={`${btnCrud.addButton}`}>
                            Agregar Nueva Empleado
                        </button>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                        
                                <Table>
                                    
                                    <Thead>
                                        <Tr>
                                            <Th>Id</Th>
                                            <Th>Nombre del empleado</Th>
                                            <Th>Fecha de contratación</Th>
                                            <Th>Turnos</Th>
                                            <Th>Salario (Bs.)</Th>
                                            <Th>Bono Antigüedad (Bs.) </Th>
                                            <Th>Salario Final (Bs.)</Th>
                                            <Th>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {employees.map((employee) => {
                                            const hd = employee.hire_date; 
                                            const hdt = new Date(hd); 
                                            const fa = new Date(); 
                                            const antig = fa.getFullYear() - hdt.getFullYear(); 
                                            let bono;
                                            let final_salary;

                                            if(antig>=2 && antig <=4){
                                                bono = 2500 * 0.02;
                                                final_salary =parseFloat( employee.salary) + bono;
                                            } else if( antig >= 5 && antig <= 7){
                                                bono = 2500 * 0.05;
                                                final_salary =parseFloat( employee.salary) + bono;
                                            }else if( antig >= 8 && antig <= 10){
                                                bono = 2500 * 0.11;
                                                final_salary =parseFloat( employee.salary) + bono;
                                            }else if( antig >= 11 && antig <= 14){
                                                bono = 2500 * 0.18;
                                                final_salary =parseFloat( employee.salary) + bono;
                                            }else if( antig >= 15 && antig <= 19){
                                                bono = 2500 * 0.26;
                                                final_salary =parseFloat( employee.salary) + bono;
                                            }else{
                                                bono = 2500 * 0.34;
                                                final_salary =parseFloat( employee.salary) + bono;
                                            }
                                            
                                            return(
                                            <Tr key={employee.id}>
                                                <Td className={`${btnCrud.tc}`}>{i=i+1}</Td>
                                                <Td className={`${btnCrud.tc}`}>
                                                    {users.find(user => user.id === employee.user_id)?.name || 'No especificado'}
                                                </Td>
                                                <Td className={`${btnCrud.tc}`}>{employee.hire_date}</Td>
                                                <Td className={`${btnCrud.tc}`}>
                                                    {shifts.find(shift => shift.id === employee.shift_id)?.name || 'No especificado'}
                                                </Td>
                                                <Td className={`${btnCrud.tc}`}>{employee.salary}</Td>
                                                
                                                <Td className={`${btnCrud.tc}`}> {bono} </Td>
                                                <Td className={`${btnCrud.tc}`}> {final_salary} </Td>
                                                <Td>
                                                    <div className={`${btnCrud.buttons}`}>
                                                        <button onClick={() => openEditarModal(employee)}  className={`${btnCrud.EditButton}`}>
                                                            Editar
                                                        </button>
                                                        <button onClick={() => openEliminarModal(employee)} className={`${btnCrud.DeleteButton}`}>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </Td>
                                            </Tr>
                                        )})}
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
                    <h2 className="font-semibold">Agregar nuevo empleado</h2>
                    <form onSubmit={submitAdd} encType="multipart/form-data">
                        
                        <div>
                            <InputLabel htmlFor="user_id" value="Usuario:" />

                            <select name="user_id" 
                                    id="user_id"
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        console.log(`Selected user ID: ${selectedValue}`); // Depuración
                                        setAddData('user_id', selectedValue);
                                    }}
                            >       
                            <option value="">Seleccione un usuario</option>
                                {users.filter(user => user.rol_id !== 2).map(user=>[
                                    <option value={user.id}>{user.name}</option>])}
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="hire_date" value="Fecha de contratación:" />

                            <TextInput
                                type='date'
                                id="hire_date"
                                name="hire_date"
                                value={addData.hire_date}
                                className="mt-1 block w-full"
                                autoComplete="hire_date"
                                isFocused={true}
                                onChange={(e) => {
                                    const dateValue = e.target.value;
                                    const [year, month, day] = dateValue.split("-");

                                    if (year.length > 4) {
                                        return; 
                                    }
                                    setAddData('hire_date', dateValue); 
                                }}
                                required
                            />

                            <InputError message={addErrors.hire_date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="shift_id" value="Turnos:" />
                                <select name="shift_id" 
                                        id="shift_id"
                                        value={addData.shift_id}
                                        onChange={(e) => setAddData('shift_id', e.target.value)}
                                        >
                                        <option value="">Seleccione un usuario</option>
                                    {shifts.map(shift=>[
                                        <option value={shift.id}>{shift.name}</option>
                                    ])}
                                </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="salary" value="Salario (Bs):" />
                            <TextInput
                                type="number"
                                id="salary"
                                name="salary"
                                value={addData.salary}
                                className="mt-1 block w-full"
                                autoComplete="salary"
                                isFocused={true}
                                onChange={(e) => setAddData('salary', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={addErrors.salary} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={addProcessing}>
                                Agregar
                            </PrimaryButton>
                            <PrimaryButton onClick={closeAgregarModal}  type="button" className="ms-4">
                                Cancelar
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Editar */}
            <Modal show={isEditarOpen} onClose={closeEditarModal} maxWidth="md" modalId='editar'>
                <div className="p-6">
                    <h2 className="font-semibold">Editar Empleado</h2>
                    <form onSubmit={submitEdit} encType="multipart/form-data">
                        
                        <div>
                            <InputLabel htmlFor="user_id" value="Usuario:" />

                            <div>
                                <InputLabel htmlFor="user_id" value="Usuario:" />

                                <select name="user_id" 
                                        id="user_id"
                                        value={editData.user_id}
                                        onChange={(e) => setEditData('user_id', e.target.value)}
                                        >
                                    {users.map(user=>[
                                        <option value={user.id}>{user.name}</option>
                                    ])}
                                </select>

                            </div>

                        </div>

                        <div>
                            <InputLabel htmlFor="hire_date" value="Fecha de contratación:" />

                            <TextInput
                                type='date'
                                id="hire_date"
                                name="hire_date"
                                value={editData.hire_date}
                                className="mt-1 block w-full"
                                autoComplete="hire_date"
                                isFocused={true}
                                onChange={(e) => {
                                    const dateValue = e.target.value;
                                    const [year, month, day] = dateValue.split("-");

                                    if (year.length > 4) {
                                        return; 
                                    }
                                    setEditData('hire_date', dateValue); 
                                }}
                                required
                            />

                            <InputError message={editErrors.hire_date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="shift_id" value="Turno:" />

                            <select name="shift_id" 
                                    id="shift_id"
                                    value={editData.shift_id}
                                    onChange={(e) => setEditData('shift_id', e.target.value)}
                                    >
                                {shifts.map(shift=>[
                                    <option value={shift.id}>{shift.name}</option>
                                ])}
                            </select>

                        </div>

                        <div>
                            <InputLabel htmlFor="salary" value="Salario:" />
                            <TextInput
                                type="number"
                                id="salary"
                                name="salary"
                                value={editData.salary}
                                className="mt-1 block w-full"
                                autoComplete="salary"
                                isFocused={true}
                                onChange={(e) => setEditData('salary', e.target.value.replace(/[^0-9]/g, ''))}
                                required
                            />
                            <InputError message={editErrors.salary} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={editProcessing}>
                                Guardar cambios
                            </PrimaryButton>
                            <PrimaryButton onClick={closeEditarModal} className="ms-4">
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
                            <h2>Estas seguro de eliminar al empleado?</h2>
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

