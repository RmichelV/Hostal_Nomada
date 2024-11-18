import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Inertia } from "@inertiajs/inertia";

export default function Layout({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-[#008080] border-b border-teal-700  text-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 ">
                        <Link href="/" className="flex items-center text-black">
                            <ApplicationLogo className="block h-14 w-auto fill-current text-gray-800 dark:text-gray-200" />

                        </Link>

                        <div className="hidden sm:flex space-x-8  mt-5 text-black">

                            <Link href={route('reservation')} >
                                Reservaciones
                            </Link>
                            <Link href={route('restaurant')} >
                                Restaurante
                            </Link>
                        </div>

                        <div className="hidden sm:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                    >
                                        Página principal
                                    </Link>
                                    <div className="pt-4 pb-1 border-t border-teal-600 hidden sm:flex space-x-8">

                                            <NavLink method="post" href={route('logout')} as="button">
                                                Cerrar Sesión
                                            </NavLink>
                                        </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="bg-teal-700 text-black hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-medium hover:text-teal-100"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-teal-700 text-black hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-medium hover:text-teal-100"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="-mr-2 flex sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-teal-100 hover:bg-teal-700 focus:outline-none focus:bg-teal-700 focus:text-teal-100 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
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

                {/* Mobile Menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden bg-teal-700`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Página principal
                        </ResponsiveNavLink>
                    </div>

                    {user ? (
                        <div className="pt-4 pb-1 border-t border-teal-600">

                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Cerrar Sesión
                                </ResponsiveNavLink>
                            </div>
                    ) : (
                        <div className="pt-4 pb-1 border-t border-teal-600">
                            <ResponsiveNavLink href={route('login')}>Iniciar Sesión</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('register')}>Registrarse</ResponsiveNavLink>
                        </div>
                    )}
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}
