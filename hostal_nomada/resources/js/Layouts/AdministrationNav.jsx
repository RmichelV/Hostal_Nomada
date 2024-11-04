import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '../../css/NavBar.module.css'


export default function AdministrationNav({ header, children, auth }) {

    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div>
            <nav className={`border-b border-gray-100 bg-white ${Navbar.navbarBackground}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex" >
                                <NavLink
                                    href={route('users.index')}
                                    active={route().current('users.index')}
                                >
                                    Lista de usuarios
                                </NavLink>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('employees.index')}
                                    active={route().current('employees.index')}
                                >
                                    Lista de empleados
                                </NavLink>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('room_types.index')}
                                    active={route().current('room_types.index')}
                                >
                                    Tipos de habitaciones
                                </NavLink>
                            </div>

                            {user 
                            && user.rol_id!=2 && 
                            (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('reservations.index')}
                                        active={route().current('reservations.index')}
                                    >
                                        Lista de reservaciones
                                    </NavLink>

                                    <NavLink
                                        href={route('home')}
                                        active={route().current('home')}
                                    >
                                        Registrar habitacion
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {/** creacion del icono de hamburguesa */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

    {/* menu responsivo */}
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('users.index')}
                            active={route().current('users.index')}
                        >
                            Lista de usuarios
                        </ResponsiveNavLink>
                    </div>

                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('employees.index')}
                            active={route().current('employees.index')}
                        >
                            Lista de empleados
                        </ResponsiveNavLink>
                    </div>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('room_types.index')}
                            active={route().current('room_types.index')}
                        >
                            Tipos de habitación
                        </ResponsiveNavLink>
                    </div>

                    {user && user.rol_id !=1 && (
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route('reservations.index')}
                                active={route().current('reservations.index')}
                            >
                                Lista de reservaciones
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('home')}
                                active={route().current('home')}
                            >
                                Registrar habitación
                            </ResponsiveNavLink>
                        </div>
                    )}
                </div>
            </nav>
            
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>
                {children}
            </main>
            
        </div>
    );
}


