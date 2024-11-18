import { Link } from '@inertiajs/react';
import React, { PropsWithChildren } from 'react';

interface Props {
  href: string;
  active?: boolean;
  className?: string;
}

export default function NavLink({
  active = false,
  className = '',
  children,
  ...props
}: PropsWithChildren<Props>) {
  const baseClasses =
    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ';

  const activeClasses =
    'border-[#081618] text-white focus:border-[#081618] dark:border-[#081618] dark:text-gray-100';

  const inactiveClasses =
    'border-transparent text-gray-800 hover:border-gray-300 hover:text-gray-900 focus:border-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300 dark:focus:border-gray-700 dark:focus:text-gray-300';

  return (
    <Link
      {...props}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${className}`}
    >
      {children}
    </Link>
  );
}
