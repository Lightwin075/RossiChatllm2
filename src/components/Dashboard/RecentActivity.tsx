
'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  user: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // This would fetch from a real API endpoint for recent activities/audit logs
      // For now, using dummy data
      const dummyActivities: Activity[] = [
        {
          id: '1',
          type: 'purchase_order',
          message: 'Orden de compra #PO-001 creada para Proveedor ABC',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          user: 'Juan Pérez',
        },
        {
          id: '2',
          type: 'product',
          message: 'Producto "Arroz Premium 1kg" actualizado',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          user: 'María González',
        },
        {
          id: '3',
          type: 'inventory',
          message: 'Stock actualizado para 15 productos en Almacén Central',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          user: 'Carlos Ramírez',
        },
        {
          id: '4',
          type: 'supplier',
          message: 'Nuevo proveedor "Distribuidora XYZ" agregado',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          user: 'Ana López',
        },
      ];
      
      setActivities(dummyActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase_order':
        return '🛒';
      case 'product':
        return '📦';
      case 'inventory':
        return '📊';
      case 'supplier':
        return '🏢';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Actividad Reciente
        </h3>
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-sm text-gray-900">
                          {activity.message}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {activity.user} • {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
