
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Table, { Column } from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import Badge from '@/components/UI/Badge';
import ProductTypeForm from '@/components/Products/ProductTypeForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ProductType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    products: number;
  };
}

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductTypes();
  }, [searchTerm]);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/product-types', {
        params: {
          search: searchTerm,
        },
      });
      
      setProductTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching product types:', error);
      toast.error('Error al cargar los tipos de producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProductType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (productType: ProductType) => {
    setSelectedProductType(productType);
    setIsFormOpen(true);
  };

  const handleDelete = async (productType: ProductType) => {
    if (productType._count?.products && productType._count.products > 0) {
      toast.error(`No se puede eliminar. Hay ${productType._count.products} productos asociados a este tipo.`);
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar el tipo "${productType.name}"?`)) {
      try {
        await api.delete(`/product-types/${productType.id}`);
        toast.success('Tipo de producto eliminado exitosamente');
        fetchProductTypes();
      } catch (error) {
        toast.error('Error al eliminar el tipo de producto');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedProductType) {
        await api.put(`/product-types/${selectedProductType.id}`, data);
        toast.success('Tipo de producto actualizado exitosamente');
      } else {
        await api.post('/product-types', data);
        toast.success('Tipo de producto creado exitosamente');
      }
      
      setIsFormOpen(false);
      setSelectedProductType(null);
      fetchProductTypes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el tipo de producto');
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Descripción',
      render: (value: string) => (
        <span className="text-gray-600">{value || 'Sin descripción'}</span>
      ),
    },
    {
      key: '_count',
      label: 'Productos',
      render: (value: any) => (
        <Badge variant="blue">{value?.products || 0}</Badge>
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
      render: (_, row: ProductType) => (
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
            <h1 className="text-2xl font-semibold text-gray-900">Tipos de Producto</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona las categorías de productos
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Tipo
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar tipos de producto..."
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
          data={productTypes}
          loading={loading}
          emptyMessage="No se encontraron tipos de producto"
        />

        {/* Form Modal */}
        <Modal
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProductType(null);
          }}
          title={selectedProductType ? 'Editar Tipo de Producto' : 'Nuevo Tipo de Producto'}
        >
          <ProductTypeForm
            productType={selectedProductType}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedProductType(null);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
