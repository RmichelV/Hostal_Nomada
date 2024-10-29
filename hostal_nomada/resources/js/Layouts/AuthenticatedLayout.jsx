import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '../../css/NavBar.module.css'


export default function AuthenticatedLayout({ header, children, auth }) {

    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className={`border-b border-gray-100 bg-white ${Navbar.navbarBackground}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>
                            
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex" >
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Página principal
                                </NavLink>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Restaurante
                                </NavLink>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('reservations.index')}
                                    active={route().current('reservation.index')}
                                >
                                    Reservacion de habitaciones
                                </NavLink>
                            </div>


                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Contactos
                                </NavLink>
                            </div>
                        
                            {user && user.rol_id!=2 &&(
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('administration')}
                                        active={route().current('administration')}
                                    >
                                        Administración
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {/** menu de nombre (edicion y cerrar sesion) */} 
                        { user ? (
                            <div className="hidden sm:ms-6 sm:flex sm:items-center">     
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                Editar Perfil
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Cerrar Sesión
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        ):( 
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('login')}
                                    active={route().current('login')}
                                >
                                    Iniciar Sesión
                                </NavLink>

                                <NavLink
                                    href={route('register')}
                                    active={route().current('register')}
                                >
                                    Registrarse
                                </NavLink>
                            </div> 
                        )}

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
                            href={route('home')}
                            active={route().current('home')}
                        >
                            Pagina Principal
                        </ResponsiveNavLink>
                    </div>

                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('home')}
                            active={route().current('home')}
                        >
                            Reservaciones
                        </ResponsiveNavLink>
                    </div>

                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('home')}
                            active={route().current('home')}
                        >
                            Restaurante
                        </ResponsiveNavLink>
                    </div>

                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('home')}
                            active={route().current('home')}
                        >
                            Contactos
                        </ResponsiveNavLink>
                    </div>
                    
                    {user && user.rol_id !=2 && (
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route('home')}
                                active={route().current('home')}
                            >
                                Administración
                            </ResponsiveNavLink>
                        </div>
                    )}


                    {user ? (
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    ):(
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route('login')}
                                active={route().current('login')}
                            >
                                Iniciar Sesión
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('register')}
                                active={route().current('register')}
                            >
                                Registrarse
                            </ResponsiveNavLink>
                        </div>
                    )}
                </div>
            </nav>
            
            <main className={Navbar.mainTitle}>
                <img src="img/LaPaz.png" alt="La Paz" className={Navbar.BannerLaPaz} id='bannerLaPaz' />
                <div className={`${Navbar.title}`}>
                    <h1 className={Navbar.title_up}>
                        HOSTAL NOMADA SUITS
                    </h1>
                    <h2 className={`${Navbar.title_down}`}>
                        El mejor hostal ubicado en la ciudad maravilla La Paz - Bolivia
                    </h2>
                </div>
            </main>
            
            

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            
        </div>
    );
}


