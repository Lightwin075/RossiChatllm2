
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Table, { Column } from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import Badge from '@/components/UI/Badge';
import Pagination from '@/components/UI/Pagination';
import ProductForm from '@/components/Products/ProductForm';
import { PlusIcon, PencilIcon, TrashIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  unit: string;
  minStock: number;
  price: number;
  cost: number;
  isActive: boolean;
  productType: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedType, setSelectedType] = useState<string>('');
  const [productTypes, setProductTypes] = useState<Array<{id: string, name: string}>>([]);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
  }, [currentPage, searchTerm, sortField, sortDirection, selectedType]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sortBy: sortField,
          sortOrder: sortDirection,
          type: selectedType,
        },
      });
      
      setProducts(response.data.products || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await api.get('/product-types');
      setProductTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching product types:', error);
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
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}"?`)) {
      try {
        await api.delete(`/products/${product.id}`);
        toast.success('Producto eliminado exitosamente');
        fetchProducts();
      } catch (error) {
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const handleGenerateQR = async (product: Product) => {
    try {
      const response = await api.post(`/products/${product.id}/qr`);
      // This would generate and download/show QR code
      toast.success('Código QR generado exitosamente');
    } catch (error) {
      toast.error('Error al generar el código QR');
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, data);
        toast.success('Producto actualizado exitosamente');
      } else {
        await api.post('/products', data);
        toast.success('Producto creado exitosamente');
      }
      
      setIsFormOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Producto',
      sortable: true,
      render: (value: string, row: Product) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">SKU: {row.sku}</div>
        </div>
      ),
    },
    {
      key: 'productType',
      label: 'Tipo',
      render: (value: any) => (
        <Badge variant="blue">{value?.name}</Badge>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'cost',
      label: 'Costo',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'minStock',
      label: 'Stock Mín.',
      render: (value: number, row: Product) => (
        <div>
          <div>{value}</div>
          <div className="text-xs text-gray-500">{row.unit}</div>
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
      render: (_, row: Product) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Editar"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleGenerateQR(row)}
            className="text-green-600 hover:text-green-900"
            title="Generar QR"
          >
            <QrCodeIcon className="h-5 w-5" />
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
            <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona el catálogo de productos
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Todos los tipos</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={products}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No se encontraron productos"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={products.length * totalPages}
        />

        {/* Form Modal */}
        <Modal
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
          size="lg"
        >
          <ProductForm
            product={selectedProduct}
            productTypes={productTypes}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedProduct(null);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
