
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Table, { Column } from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import Badge from '@/components/UI/Badge';
import Pagination from '@/components/UI/Pagination';
import InventoryMovementForm from '@/components/Inventory/InventoryMovementForm';
import { 
  PlusIcon, 
  QrCodeIcon, 
  ArrowsRightLeftIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
    unit: string;
    minStock: number;
  };
  warehouse: {
    id: string;
    name: string;
  };
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lastMovementDate?: string;
  batches?: InventoryBatch[];
}

interface InventoryBatch {
  id: string;
  batchNumber: string;
  expirationDate?: string;
  quantity: number;
  cost: number;
}

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortField, setSortField] = useState<string>('product.name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [warehouses, setWarehouses] = useState<Array<{id: string, name: string}>>([]);

  const itemsPerPage = 15;

  useEffect(() => {
    fetchInventoryItems();
    fetchWarehouses();
  }, [currentPage, searchTerm, selectedWarehouse, showLowStock, sortField, sortDirection]);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory/stock', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          warehouseId: selectedWarehouse,
          lowStock: showLowStock,
          sortBy: sortField,
          sortOrder: sortDirection,
        },
      });
      
      setInventoryItems(response.data.items || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast.error('Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/warehouses');
      setWarehouses(response.data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateMovement = () => {
    setIsMovementFormOpen(true);
  };

  const handleGenerateQR = async (item: InventoryItem) => {
    try {
      const response = await api.post(`/inventory/${item.id}/qr`);
      toast.success('Código QR generado exitosamente');
      // This would typically download or show the QR code
    } catch (error) {
      toast.error('Error al generar el código QR');
    }
  };

  const handleMovementSubmit = async (data: any) => {
    try {
      await api.post('/inventory/movements', data);
      toast.success('Movimiento de inventario registrado exitosamente');
      setIsMovementFormOpen(false);
      fetchInventoryItems();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar el movimiento');
    }
  };

  const isLowStock = (item: InventoryItem) => {
    return item.currentStock <= item.product.minStock;
  };

  const columns: Column[] = [
    {
      key: 'product.name',
      label: 'Producto',
      sortable: true,
      render: (_, row: InventoryItem) => (
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900 flex items-center">
              {row.product.name}
              {isLowStock(row) && (
                <ExclamationTriangleIcon className="ml-2 h-4 w-4 text-yellow-500" title="Stock bajo" />
              )}
            </div>
            <div className="text-sm text-gray-500">SKU: {row.product.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'warehouse.name',
      label: 'Almacén',
      render: (_, row: InventoryItem) => row.warehouse.name,
    },
    {
      key: 'currentStock',
      label: 'Stock Actual',
      sortable: true,
      render: (value: number, row: InventoryItem) => (
        <div>
          <div className={`text-sm font-medium ${
            isLowStock(row) ? 'text-red-600' : 'text-gray-900'
          }`}>
            {value}
          </div>
          <div className="text-xs text-gray-500">{row.product.unit}</div>
        </div>
      ),
    },
    {
      key: 'reservedStock',
      label: 'Reservado',
      render: (value: number, row: InventoryItem) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.product.unit}</div>
        </div>
      ),
    },
    {
      key: 'availableStock',
      label: 'Disponible',
      render: (value: number, row: InventoryItem) => (
        <div>
          <div className="text-sm font-medium text-green-600">{value}</div>
          <div className="text-xs text-gray-500">{row.product.unit}</div>
        </div>
      ),
    },
    {
      key: 'product.minStock',
      label: 'Stock Mín.',
      render: (_, row: InventoryItem) => (
        <div>
          <div className="text-sm text-gray-900">{row.product.minStock}</div>
          <div className="text-xs text-gray-500">{row.product.unit}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_, row: InventoryItem) => {
        if (isLowStock(row)) {
          return <Badge variant="yellow">Stock Bajo</Badge>;
        } else if (row.availableStock === 0) {
          return <Badge variant="red">Agotado</Badge>;
        } else {
          return <Badge variant="green">Normal</Badge>;
        }
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row: InventoryItem) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleGenerateQR(row)}
            className="text-green-600 hover:text-green-900"
            title="Generar QR"
          >
            <QrCodeIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventario</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona el stock y movimientos de inventario
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary">
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              Ver Movimientos
            </Button>
            <Button onClick={handleCreateMovement}>
              <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
              Registrar Movimiento
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Todos los almacenes</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLowStock}
                  onChange={(e) => setShowLowStock(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Solo stock bajo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={inventoryItems}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No se encontraron elementos de inventario"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={inventoryItems.length * totalPages}
        />

        {/* Movement Form Modal */}
        <Modal
          open={isMovementFormOpen}
          onClose={() => setIsMovementFormOpen(false)}
          title="Registrar Movimiento de Inventario"
          size="lg"
        >
          <InventoryMovementForm
            onSubmit={handleMovementSubmit}
            onCancel={() => setIsMovementFormOpen(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
