
'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/UI/Badge';
import api from '@/lib/api';

interface Warehouse {
  id: string;
  name: string;
  code: string;
  capacity?: number;
  currentOccupancy?: number;
}

interface WarehouseStatsData {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  topProducts: Array<{
    id: string;
    product: {
      name: string;
      sku: string;
    };
    quantity: number;
    value: number;
  }>;
  recentMovements: Array<{
    id: string;
    type: string;
    product: {
      name: string;
    };
    quantity: number;
    date: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    value: number;
  }>;
}

interface WarehouseStatsProps {
  warehouse: Warehouse | null;
  onClose: () => void;
}

export default function WarehouseStats({ warehouse, onClose }: WarehouseStatsProps) {
  const [stats, setStats] = useState<WarehouseStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (warehouse) {
      fetchStats();
    }
  }, [warehouse]);

  const fetchStats = async () => {
    if (!warehouse) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/warehouses/${warehouse.id}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching warehouse stats:', error);
      // For demo purposes, using mock data
      setStats({
        totalProducts: 145,
        totalValue: 85420.50,
        lowStockItems: 8,
        topProducts: [
          {
            id: '1',
            product: { name: 'Arroz Premium 1kg', sku: 'ARR-001' },
            quantity: 120,
            value: 2400,
          },
          {
            id: '2',
            product: { name: 'Aceite de Oliva 500ml', sku: 'ACE-001' },
            quantity: 85,
            value: 1700,
          },
        ],
        recentMovements: [
          {
            id: '1',
            type: 'IN',
            product: { name: 'Arroz Premium 1kg' },
            quantity: 50,
            date: '2025-01-08',
          },
          {
            id: '2',
            type: 'OUT',
            product: { name: 'Aceite de Oliva 500ml' },
            quantity: 15,
            date: '2025-01-07',
          },
        ],
        categoryBreakdown: [
          { category: 'Abarrotes', count: 45, value: 25000 },
          { category: 'Bebidas', count: 30, value: 18000 },
          { category: 'Lácteos', count: 25, value: 15000 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (!warehouse) return null;

  const getOccupancyPercentage = () => {
    if (!warehouse.capacity || !warehouse.currentOccupancy) return 0;
    return (warehouse.currentOccupancy / warehouse.capacity) * 100;
  };

  const getOccupancyColor = () => {
    const percentage = getOccupancyPercentage();
    if (percentage > 80) return 'red';
    if (percentage > 60) return 'yellow';
    return 'green';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-24 rounded-lg" />
            ))}
          </div>
          <div className="bg-gray-100 h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">{stats?.totalProducts || 0}</div>
          <div className="text-sm text-blue-700">Total Productos</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-900">
            ${(stats?.totalValue || 0).toFixed(2)}
          </div>
          <div className="text-sm text-green-700">Valor Total</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-900">{stats?.lowStockItems || 0}</div>
          <div className="text-sm text-yellow-700">Stock Bajo</div>
        </div>
        
        {warehouse.capacity && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">
              {getOccupancyPercentage().toFixed(1)}%
            </div>
            <div className="text-sm text-purple-700">Ocupación</div>
          </div>
        )}
      </div>

      {/* Capacity Details */}
      {warehouse.capacity && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Capacidad del Almacén</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Ocupación actual</span>
            <span className="text-sm text-gray-900">
              {warehouse.currentOccupancy || 0} / {warehouse.capacity} m³
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                getOccupancyColor() === 'red' ? 'bg-red-600' :
                getOccupancyColor() === 'yellow' ? 'bg-yellow-600' :
                'bg-green-600'
              }`}
              style={{ width: `${getOccupancyPercentage()}%` }}
            />
          </div>
          <div className="mt-2">
            <Badge variant={getOccupancyColor() as any}>
              {getOccupancyPercentage() > 80 ? 'Alta ocupación' :
               getOccupancyPercentage() > 60 ? 'Ocupación media' :
               'Ocupación baja'}
            </Badge>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Productos Principales</h3>
          <div className="space-y-3">
            {stats?.topProducts.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                  <div className="text-xs text-gray-500">{item.product.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.quantity}</div>
                  <div className="text-xs text-gray-500">${item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Movements */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Movimientos Recientes</h3>
          <div className="space-y-3">
            {stats?.recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{movement.product.name}</div>
                  <div className="text-xs text-gray-500">{movement.date}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={movement.type === 'IN' ? 'green' : 'red'}>
                    {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                  </Badge>
                  <span className="text-sm font-medium">{movement.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Desglose por Categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats?.categoryBreakdown.map((category) => (
            <div key={category.category} className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{category.count}</div>
              <div className="text-sm font-medium text-gray-900">{category.category}</div>
              <div className="text-xs text-gray-500">${category.value.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
