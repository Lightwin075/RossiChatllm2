
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Table, { Column } from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import Badge from '@/components/UI/Badge';
import Pagination from '@/components/UI/Pagination';
import PurchaseOrderForm from '@/components/PurchaseOrders/PurchaseOrderForm';
import PurchaseOrderDetails from '@/components/PurchaseOrders/PurchaseOrderDetails';
import { 
  PlusIcon, 
  PencilIcon, 
  EyeIcon, 
  DocumentDuplicateIcon,
  EnvelopeIcon,
  DocumentArrowDownIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: 'PRE_ORDER' | 'ISSUED' | 'RECEIVED' | 'PAID';
  supplier: {
    id: string;
    name: string;
    email: string;
  };
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  paidDate?: string;
  totalAmount: number;
  notes?: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

const statusLabels = {
  PRE_ORDER: 'Pre-orden',
  ISSUED: 'Emitida',
  RECEIVED: 'Recibida',
  PAID: 'Pagada',
};

const statusColors = {
  PRE_ORDER: 'yellow' as const,
  ISSUED: 'blue' as const,
  RECEIVED: 'green' as const,
  PAID: 'gray' as const,
};

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortField, setSortField] = useState<string>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPurchaseOrders();
  }, [currentPage, searchTerm, selectedStatus, sortField, sortDirection]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/purchase-orders', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: selectedStatus,
          sortBy: sortField,
          sortOrder: sortDirection,
        },
      });
      
      setPurchaseOrders(response.data.purchaseOrders || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast.error('Error al cargar las órdenes de compra');
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
    setSelectedPurchaseOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    if (purchaseOrder.status === 'PAID') {
      toast.error('No se puede editar una orden pagada');
      return;
    }
    setSelectedPurchaseOrder(purchaseOrder);
    setIsFormOpen(true);
  };

  const handleView = (purchaseOrder: PurchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setIsDetailsOpen(true);
  };

  const handleClone = async (purchaseOrder: PurchaseOrder) => {
    try {
      const response = await api.post(`/purchase-orders/${purchaseOrder.id}/clone`);
      toast.success('Orden clonada exitosamente');
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Error al clonar la orden');
    }
  };

  const handleSendEmail = async (purchaseOrder: PurchaseOrder) => {
    try {
      await api.post(`/purchase-orders/${purchaseOrder.id}/send-email`);
      toast.success('Email enviado exitosamente');
    } catch (error) {
      toast.error('Error al enviar el email');
    }
  };

  const handleGeneratePDF = async (purchaseOrder: PurchaseOrder) => {
    try {
      const response = await api.get(`/purchase-orders/${purchaseOrder.id}/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orden-compra-${purchaseOrder.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF generado exitosamente');
    } catch (error) {
      toast.error('Error al generar el PDF');
    }
  };

  const handleStatusChange = async (purchaseOrder: PurchaseOrder, newStatus: string) => {
    try {
      await api.patch(`/purchase-orders/${purchaseOrder.id}/status`, { status: newStatus });
      toast.success('Estado actualizado exitosamente');
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDelete = async (purchaseOrder: PurchaseOrder) => {
    if (purchaseOrder.status !== 'PRE_ORDER') {
      toast.error('Solo se pueden eliminar órdenes en estado Pre-orden');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar la orden ${purchaseOrder.orderNumber}?`)) {
      try {
        await api.delete(`/purchase-orders/${purchaseOrder.id}`);
        toast.success('Orden eliminada exitosamente');
        fetchPurchaseOrders();
      } catch (error) {
        toast.error('Error al eliminar la orden');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedPurchaseOrder) {
        await api.put(`/purchase-orders/${selectedPurchaseOrder.id}`, data);
        toast.success('Orden actualizada exitosamente');
      } else {
        await api.post('/purchase-orders', data);
        toast.success('Orden creada exitosamente');
      }
      
      setIsFormOpen(false);
      setSelectedPurchaseOrder(null);
      fetchPurchaseOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la orden');
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PRE_ORDER':
        return 'ISSUED';
      case 'ISSUED':
        return 'RECEIVED';
      case 'RECEIVED':
        return 'PAID';
      default:
        return null;
    }
  };

  const columns: Column[] = [
    {
      key: 'orderNumber',
      label: 'Número',
      sortable: true,
      render: (value: string, row: PurchaseOrder) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(row.orderDate), 'dd/MM/yyyy', { locale: es })}
          </div>
        </div>
      ),
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      render: (value: any) => value?.name,
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: string) => (
        <Badge variant={statusColors[value as keyof typeof statusColors]}>
          {statusLabels[value as keyof typeof statusLabels]}
        </Badge>
      ),
    },
    {
      key: 'createdBy',
      label: 'Creado por',
      render: (value: any) => `${value.firstName} ${value.lastName}`,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row: PurchaseOrder) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(row)}
            className="text-gray-600 hover:text-gray-900"
            title="Ver detalles"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          {row.status !== 'PAID' && (
            <button
              onClick={() => handleEdit(row)}
              className="text-indigo-600 hover:text-indigo-900"
              title="Editar"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => handleClone(row)}
            className="text-green-600 hover:text-green-900"
            title="Clonar"
          >
            <DocumentDuplicateIcon className="h-5 w-5" />
          </button>
          {(row.status === 'ISSUED' || row.status === 'RECEIVED') && (
            <button
              onClick={() => handleSendEmail(row)}
              className="text-blue-600 hover:text-blue-900"
              title="Enviar email"
            >
              <EnvelopeIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => handleGeneratePDF(row)}
            className="text-purple-600 hover:text-purple-900"
            title="Generar PDF"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
          </button>
          {row.status === 'PRE_ORDER' && (
            <button
              onClick={() => handleDelete(row)}
              className="text-red-600 hover:text-red-900"
              title="Eliminar"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
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
            <h1 className="text-2xl font-semibold text-gray-900">Órdenes de Compra</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona las órdenes de compra y su flujo de trabajo
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Orden
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Buscar por número, proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="PRE_ORDER">Pre-orden</option>
                <option value="ISSUED">Emitida</option>
                <option value="RECEIVED">Recibida</option>
                <option value="PAID">Pagada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={purchaseOrders}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No se encontraron órdenes de compra"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={purchaseOrders.length * totalPages}
        />

        {/* Form Modal */}
        <Modal
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPurchaseOrder(null);
          }}
          title={selectedPurchaseOrder ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
          size="xl"
        >
          <PurchaseOrderForm
            purchaseOrder={selectedPurchaseOrder}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedPurchaseOrder(null);
            }}
          />
        </Modal>

        {/* Details Modal */}
        <Modal
          open={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedPurchaseOrder(null);
          }}
          title="Detalles de la Orden de Compra"
          size="xl"
        >
          <PurchaseOrderDetails
            purchaseOrder={selectedPurchaseOrder}
            onStatusChange={handleStatusChange}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedPurchaseOrder(null);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
