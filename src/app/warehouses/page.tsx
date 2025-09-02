
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Table, { Column } from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import Badge from '@/components/UI/Badge';
import WarehouseForm from '@/components/Warehouses/WarehouseForm';
import WarehouseStats from '@/components/Warehouses/WarehouseStats';
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isActive: boolean;
  capacity?: number;
  currentOccupancy?: number;
  manager?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  _count?: {
    inventoryItems: number;
  };
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, [searchTerm]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/warehouses', {
        params: {
          search: searchTerm,
          include: 'manager,_count',
        },
      });
      
      setWarehouses(response.data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error('Error al cargar los almacenes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedWarehouse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsFormOpen(true);
  };

  const handleViewStats = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsStatsOpen(true);
  };

  const handleDelete = async (warehouse: Warehouse) => {
    if (warehouse._count?.inventoryItems && warehouse._count.inventoryItems > 0) {
      toast.error(`No se puede eliminar. Hay ${warehouse._count.inventoryItems} productos en este almacén.`);
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar el almacén "${warehouse.name}"?`)) {
      try {
        await api.delete(`/warehouses/${warehouse.id}`);
        toast.success('Almacén eliminado exitosamente');
        fetchWarehouses();
      } catch (error) {
        toast.error('Error al eliminar el almacén');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedWarehouse) {
        await api.put(`/warehouses/${selectedWarehouse.id}`, data);
        toast.success('Almacén actualizado exitosamente');
      } else {
        await api.post('/warehouses', data);
        toast.success('Almacén creado exitosamente');
      }
      
      setIsFormOpen(false);
      setSelectedWarehouse(null);
      fetchWarehouses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el almacén');
    }
  };

  const getOccupancyPercentage = (warehouse: Warehouse) => {
    if (!warehouse.capacity || !warehouse.currentOccupancy) return 0;
    return (warehouse.currentOccupancy / warehouse.capacity) * 100;
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value: string, row: Warehouse) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">Código: {row.code}</div>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Ubicación',
      render: (value: string, row: Warehouse) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.city}, {row.state}</div>
        </div>
      ),
    },
    {
      key: 'manager',
      label: 'Encargado',
      render: (value: any) => (
        <div>
          {value ? (
            <>
              <div className="text-sm font-medium text-gray-900">
                {value.firstName} {value.lastName}
              </div>
              <div className="text-sm text-gray-500">{value.email}</div>
            </>
          ) : (
            <span className="text-sm text-gray-500">Sin asignar</span>
          )}
        </div>
      ),
    },
    {
      key: '_count',
      label: 'Productos',
      render: (value: any) => (
        <Badge variant="blue">{value?.inventoryItems || 0}</Badge>
      ),
    },
    {
      key: 'capacity',
      label: 'Ocupación',
      render: (_, row: Warehouse) => {
        if (!row.capacity) return <span className="text-gray-500">N/A</span>;
        
        const percentage = getOccupancyPercentage(row);
        let variant: 'green' | 'yellow' | 'red' = 'green';
        
        if (percentage > 80) variant = 'red';
        else if (percentage > 60) variant = 'yellow';
        
        return (
          <div>
            <Badge variant={variant}>{percentage.toFixed(1)}%</Badge>
            <div className="text-xs text-gray-500">
              {row.currentOccupancy || 0} / {row.capacity}
            </div>
          </div>
        );
      },
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value: boolean) => (
        <Badge variant={value ? 'green' : 'red'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row: Warehouse) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewStats(row)}
            className="text-blue-600 hover:text-blue-900"
            title="Ver estadísticas"
          >
            <ChartBarIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Editar"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-900"
            title="Eliminar"
          >
            <TrashIcon className="h-5 w-5" />
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
            <h1 className="text-2xl font-semibold text-gray-900">Almacenes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona los almacenes y su información
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Almacén
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar almacenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={warehouses}
          loading={loading}
          emptyMessage="No se encontraron almacenes"
        />

        {/* Form Modal */}
        <Modal
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedWarehouse(null);
          }}
          title={selectedWarehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
          size="lg"
        >
          <WarehouseForm
            warehouse={selectedWarehouse}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedWarehouse(null);
            }}
          />
        </Modal>

        {/* Stats Modal */}
        <Modal
          open={isStatsOpen}
          onClose={() => {
            setIsStatsOpen(false);
            setSelectedWarehouse(null);
          }}
          title={`Estadísticas - ${selectedWarehouse?.name}`}
          size="xl"
        >
          <WarehouseStats
            warehouse={selectedWarehouse}
            onClose={() => {
              setIsStatsOpen(false);
              setSelectedWarehouse(null);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
