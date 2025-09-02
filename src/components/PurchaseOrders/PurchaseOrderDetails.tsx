
'use client';

import { useState } from 'react';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import { 
  CheckIcon, 
  EnvelopeIcon, 
  DocumentArrowDownIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PurchaseOrderItem {
  id: string;
  product: {
    name: string;
    sku: string;
    unit: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: 'PRE_ORDER' | 'ISSUED' | 'RECEIVED' | 'PAID';
  supplier: {
    id: string;
    name: string;
    email: string;
    contactName: string;
    phone: string;
  };
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  paidDate?: string;
  totalAmount: number;
  notes?: string;
  items: PurchaseOrderItem[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PurchaseOrderDetailsProps {
  purchaseOrder: any;
  onStatusChange: (purchaseOrder: any, newStatus: string) => void;
  onClose: () => void;
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

export default function PurchaseOrderDetails({ 
  purchaseOrder, 
  onStatusChange, 
  onClose 
}: PurchaseOrderDetailsProps) {
  const [loading, setLoading] = useState(false);

  if (!purchaseOrder) {
    return null;
  }

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

  const getNextStatusLabel = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? statusLabels[nextStatus as keyof typeof statusLabels] : null;
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await onStatusChange(purchaseOrder, newStatus);
    } finally {
      setLoading(false);
    }
  };

  const canAdvanceStatus = (status: string) => {
    return getNextStatus(status) !== null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Orden {purchaseOrder.orderNumber}
          </h2>
          <p className="text-sm text-gray-500">
            Creada el {format(new Date(purchaseOrder.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
          </p>
        </div>
        <Badge variant={statusColors[purchaseOrder?.status as keyof typeof statusColors] || 'gray'}>
          {statusLabels[purchaseOrder?.status as keyof typeof statusLabels] || 'Unknown'}
        </Badge>
      </div>

      {/* Status Timeline */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de la Orden</h3>
        <div className="flex items-center justify-between">
          {Object.entries(statusLabels).map(([status, label], index) => {
            const isActive = purchaseOrder.status === status;
            const isPassed = Object.keys(statusLabels).indexOf(purchaseOrder.status) > index;
            const isCompleted = isPassed || isActive;

            return (
              <div key={status} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  isCompleted 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? <CheckIcon className="w-5 h-5" /> : index + 1}
                </div>
                <div className="ml-2 text-sm">
                  <div className={`font-medium ${isActive ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {label}
                  </div>
                  {status === 'ISSUED' && purchaseOrder.orderDate && (
                    <div className="text-xs text-gray-500">
                      {format(new Date(purchaseOrder.orderDate), 'dd/MM/yyyy')}
                    </div>
                  )}
                  {status === 'RECEIVED' && purchaseOrder.receivedDate && (
                    <div className="text-xs text-gray-500">
                      {format(new Date(purchaseOrder.receivedDate), 'dd/MM/yyyy')}
                    </div>
                  )}
                  {status === 'PAID' && purchaseOrder.paidDate && (
                    <div className="text-xs text-gray-500">
                      {format(new Date(purchaseOrder.paidDate), 'dd/MM/yyyy')}
                    </div>
                  )}
                </div>
                {index < Object.keys(statusLabels).length - 1 && (
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplier Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Proveedor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Empresa</dt>
            <dd className="text-sm text-gray-900">{purchaseOrder.supplier.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Contacto</dt>
            <dd className="text-sm text-gray-900">{purchaseOrder.supplier.contactName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">
              <a href={`mailto:${purchaseOrder.supplier.email}`} className="text-indigo-600 hover:text-indigo-900">
                {purchaseOrder.supplier.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
            <dd className="text-sm text-gray-900">
              <a href={`tel:${purchaseOrder.supplier.phone}`} className="text-indigo-600 hover:text-indigo-900">
                {purchaseOrder.supplier.phone}
              </a>
            </dd>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Orden</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Fecha de Orden</dt>
            <dd className="text-sm text-gray-900">
              {format(new Date(purchaseOrder.orderDate), 'dd/MM/yyyy', { locale: es })}
            </dd>
          </div>
          {purchaseOrder.expectedDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha Esperada</dt>
              <dd className="text-sm text-gray-900">
                {format(new Date(purchaseOrder.expectedDate), 'dd/MM/yyyy', { locale: es })}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-500">Creado por</dt>
            <dd className="text-sm text-gray-900">
              {purchaseOrder.createdBy.firstName} {purchaseOrder.createdBy.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total</dt>
            <dd className="text-lg font-semibold text-gray-900">
              ${purchaseOrder.totalAmount.toFixed(2)}
            </dd>
          </div>
        </div>
        
        {purchaseOrder.notes && (
          <div className="mt-4">
            <dt className="text-sm font-medium text-gray-500">Notas</dt>
            <dd className="text-sm text-gray-900 mt-1">{purchaseOrder.notes}</dd>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Productos</h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unit.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseOrder.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-sm text-gray-500">SKU: {item.product.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity} {item.product.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  Total:
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  ${purchaseOrder.totalAmount.toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex space-x-3">
          {/* Email Button */}
          {(purchaseOrder.status === 'ISSUED' || purchaseOrder.status === 'RECEIVED') && (
            <Button variant="secondary" size="sm">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Enviar Email
            </Button>
          )}
          
          {/* PDF Button */}
          <Button variant="secondary" size="sm">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Generar PDF
          </Button>
        </div>

        <div className="flex space-x-3">
          {/* Status Change Button */}
          {canAdvanceStatus(purchaseOrder.status) && (
            <Button
              onClick={() => handleStatusChange(getNextStatus(purchaseOrder.status)!)}
              loading={loading}
              size="sm"
            >
              Marcar como {getNextStatusLabel(purchaseOrder.status)}
            </Button>
          )}
          
          {/* Close Button */}
          <Button variant="secondary" onClick={onClose} size="sm">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
