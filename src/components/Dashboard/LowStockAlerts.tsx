
'use client';

import { useEffect, useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  warehouse: string;
}

export default function LowStockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      // This would fetch from a real API endpoint for low stock products
      // For now, using dummy data
      const dummyLowStock: LowStockProduct[] = [
        {
          id: '1',
          name: 'Arroz Premium 1kg',
          currentStock: 5,
          minStock: 20,
          unit: 'unidades',
          warehouse: 'Almacén Central',
        },
        {
          id: '2',
          name: 'Aceite de Oliva 500ml',
          currentStock: 8,
          minStock: 15,
          unit: 'unidades',
          warehouse: 'Almacén Norte',
        },
        {
          id: '3',
          name: 'Harina de Trigo 1kg',
          currentStock: 12,
          minStock: 30,
          unit: 'unidades',
          warehouse: 'Almacén Central',
        },
      ];
      
      setLowStockProducts(dummyLowStock);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Alertas de Bajo Stock
            </h3>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (lowStockProducts.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-green-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Alertas de Bajo Stock
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            No hay productos con bajo stock en este momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Alertas de Bajo Stock
            </h3>
          </div>
          <Link
            href="/inventory"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Ver todos
          </Link>
        </div>
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.warehouse}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-800">
                  {product.currentStock} {product.unit}
                </p>
                <p className="text-xs text-gray-500">
                  Min: {product.minStock} {product.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
