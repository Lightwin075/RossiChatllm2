
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Table, { Column } from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import Badge from '@/components/UI/Badge';
import Pagination from '@/components/UI/Pagination';
import SupplierForm from '@/components/Suppliers/SupplierForm';
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isActive: boolean;
  createdAt: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage, searchTerm, sortField, sortDirection]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/suppliers', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sortBy: sortField,
          sortOrder: sortDirection,
        },
      });
      
      setSuppliers(response.data.suppliers || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Error al cargar los proveedores');
    } finally {
      setLoading(false);
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

  const handleCreate = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = async (supplier: Supplier) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proveedor "${supplier.name}"?`)) {
      try {
        await api.delete(`/suppliers/${supplier.id}`);
        toast.success('Proveedor eliminado exitosamente');
        fetchSuppliers();
      } catch (error) {
        toast.error('Error al eliminar el proveedor');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedSupplier) {
        await api.put(`/suppliers/${selectedSupplier.id}`, data);
        toast.success('Proveedor actualizado exitosamente');
      } else {
        await api.post('/suppliers', data);
        toast.success('Proveedor creado exitosamente');
      }
      
      setIsFormOpen(false);
      setSelectedSupplier(null);
      fetchSuppliers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el proveedor');
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value: string, row: Supplier) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.contactName}</div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string) => (
        <a href={`mailto:${value}`} className="text-indigo-600 hover:text-indigo-900">
          {value}
        </a>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (value: string) => (
        <a href={`tel:${value}`} className="text-gray-900">
          {value}
        </a>
      ),
    },
    {
      key: 'city',
      label: 'Ciudad',
      render: (value: string, row: Supplier) => (
        <div>
          <div>{value}</div>
          <div className="text-sm text-gray-500">{row.country}</div>
        </div>
      ),
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
      render: (_, row: Supplier) => (
        <div className="flex items-center space-x-2">
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
            <h1 className="text-2xl font-semibold text-gray-900">Proveedores</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona los proveedores de tu inventario
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar proveedores..."
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
          data={suppliers}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No se encontraron proveedores"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={suppliers.length * totalPages}
        />

        {/* Form Modal */}
        <Modal
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSupplier(null);
          }}
          title={selectedSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          size="lg"
        >
          <SupplierForm
            supplier={selectedSupplier}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedSupplier(null);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
