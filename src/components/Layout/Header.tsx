
'use client';

import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { 
  Bars3Icon, 
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { data: session } = useSession();
  
  const user = session?.user as any;
  const userRole = user?.role;
  
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Administrador';
      case 'WAREHOUSE':
        return 'Almacén';
      default:
        return role;
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Abrir sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1">
            {/* You can add search functionality here if needed */}
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Notifications button */}
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Abrir menú de usuario</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    {user?.name}
                  </span>
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-indigo-600 font-medium">{getRoleDisplayName(userRole)}</p>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={clsx(
                          active ? 'bg-gray-50' : '',
                          'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        Cerrar Sesión
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
