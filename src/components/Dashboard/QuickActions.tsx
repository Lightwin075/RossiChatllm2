
'use client';

import Link from 'next/link';
import { 
  PlusIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const actions = [
  {
    name: 'Nueva Orden de Compra',
    href: '/purchase-orders/new',
    icon: ShoppingCartIcon,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  },
  {
    name: 'Agregar Producto',
    href: '/products/new',
    icon: PlusIcon,
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
  },
  {
    name: 'Nuevo Proveedor',
    href: '/suppliers/new',
    icon: UserGroupIcon,
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
  },
  {
    name: 'Revisar Inventario',
    href: '/inventory',
    icon: ClipboardDocumentListIcon,
    iconForeground: 'text-rose-700',
    iconBackground: 'bg-rose-50',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {actions.map((action) => (
              <li key={action.name} className="py-4">
                <Link
                  href={action.href}
                  className="flex items-center space-x-4 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-lg ${action.iconBackground} flex items-center justify-center`}>
                      <action.icon className={`h-5 w-5 ${action.iconForeground}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {action.name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
