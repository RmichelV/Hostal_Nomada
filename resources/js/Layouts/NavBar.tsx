import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { BellRing } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import DropdownLink from '@/Components/DropdownLink';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import axios from 'axios';
import classNames from 'classnames';
import { router } from '@inertiajs/core';

export default function NavBar({ handleLogout }:any) {
  const route = useRoute();
  const page = useTypedPage();
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await axios.post('/notifications/read');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // const logout = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   router.post(route('logout'));
  // };

  return (
    <nav className="bg-[#027d8c] fixed top-0 left-0 right-0 z-10 border-b border-[#35818b] dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Left Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={route('dashboard')}>
                <img src="/logo.png" alt="Logo" className="block h-9 w-auto" />
              </Link>
            </div>
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                Panel de Control
              </NavLink>
              <NavLink href={route('reservation')} active={route().current('reservation')}>
                Reservaciones
              </NavLink>
              <NavLink href={route('restaurant')} active={route().current('restaurant')}>
                Restaurante
              </NavLink>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            {/* Notifications */}
            <div className="relative mr-5">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <BellRing className="h-5 w-5 text-white" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs font-medium text-center text-white bg-red-600 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20">
                  <div className="py-2">
                    {notifications.length > 0 ? (
                      notifications.map((notification: any) => (
                        <div
                          key={notification.id}
                          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                        >
                          Mensaje: {notification.data.message}.
                          <a
                            href={`/reservas/${notification.data.reserva_id}`}
                            className="text-blue-500 hover:underline"
                          >
                            Ver detalles
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                        Sin notificaciones
                      </div>
                    )}
                  </div>
                  <button
                    onClick={markNotificationsAsRead}
                    className="w-full text-center py-2 text-sm text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              )}
            </div>

            <Dropdown
              align="right"
              width="48"
              renderTrigger={() => (
                <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none">
                  {page.props.auth.user?.profile_photo_path ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={`/storage/${page.props.auth.user?.profile_photo_path}`}
                      alt={page.props.auth.user?.name}
                    />
                  ) : (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={page.props.auth.user?.profile_photo_url}
                      alt={page.props.auth.user?.name}
                    />
                  )}
                </button>
              )}
            >
              <DropdownLink href={route('profile.show')}>Perfil</DropdownLink>
              <form onSubmit={handleLogout}>
                <DropdownLink as="button">Cerrar sesión</DropdownLink>
              </form>
            </Dropdown>
          </div>
        </div>
        
      </div>
    </nav>
  );
}
