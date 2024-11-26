'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Menu, X,Users,Salad,SquareUserRound,BedDouble,DoorOpen,HandPlatter ,BookOpenText  } from 'lucide-react';
import NavLink from '@/Components/NavLink';
import { Button } from '@/Components/ui/button';
// import '../../css/app.css';

const Sidebar = ({ head }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { icon: LayoutDashboard, text: 'Panel de Control', route: 'dashboard' },
    { icon: BookOpenText, text: 'Reportes', route: 'report' },
    { icon: SquareUserRound, text: 'Usuarios', route: 'user' },
    { icon: Users, text: 'Empleados', route: 'employee' },
    { icon: DoorOpen, text: 'Tipos de Habitaciones', route: 'room_type' },
    { icon: BedDouble, text: 'Habitaciones', route: 'room' },
    { icon: Salad, text: 'Platos', route: 'dish' },
    { icon: HandPlatter , text: 'Insumos', route: 'supply' },
    
  ];
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#3c8e99] dark:bg-gray-800 border-r border-[#3c8e99] dark:border-gray-700 p-4 transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static`}
      >
        {head}

        <nav className="space-y-2 flex flex-col mt-4">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              href={`/${item.route}`}
              active={window.location.pathname === `/${item.route}`}
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.text}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
