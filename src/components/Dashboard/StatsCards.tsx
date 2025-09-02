
'use client';

import { useEffect, useState } from 'react';
import { 
  BuildingOfficeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Stats {
  totalSuppliers: number;
  totalProducts: number;
  totalPurchaseOrders: number;
  totalWarehouses: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // These endpoints would need to be created on the backend for dashboard stats
      // For now, using dummy data
      setStats({
        totalSuppliers: 25,
        totalProducts: 150,
        totalPurchaseOrders: 87,
        totalWarehouses: 5,
        pendingOrders: 12,
        lowStockProducts: 8,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      name: 'Proveedores',
      stat: stats?.totalSuppliers || 0,
      icon: BuildingOfficeIcon,
      change: '+2.1%',
      changeType: 'increase',
    },
    {
      name: 'Productos',
      stat: stats?.totalProducts || 0,
      icon: CubeIcon,
      change: '+5.4%',
      changeType: 'increase',
    },
    {
      name: 'Órdenes de Compra',
      stat: stats?.totalPurchaseOrders || 0,
      icon: ShoppingCartIcon,
      change: `${stats?.pendingOrders || 0} pendientes`,
      changeType: 'neutral',
    },
    {
      name: 'Almacenes',
      stat: stats?.totalWarehouses || 0,
      icon: ArchiveBoxIcon,
      change: `${stats?.lowStockProducts || 0} bajo stock`,
      changeType: 'decrease',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((item) => (
        <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{item.stat}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span
                className={`font-medium ${
                  item.changeType === 'increase'
                    ? 'text-green-600'
                    : item.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
