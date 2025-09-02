
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface MovementFormData {
  productId: string;
  warehouseId: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  notes?: string;
  batchNumber?: string;
  expirationDate?: string;
  cost?: number;
}

interface InventoryMovementFormProps {
  onSubmit: (data: MovementFormData) => void;
  onCancel: () => void;
}

const movementTypes = [
  { value: 'IN', label: 'Entrada' },
  { value: 'OUT', label: 'Salida' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'ADJUSTMENT', label: 'Ajuste' },
];

const reasons = {
  IN: [
    'Compra',
    'Devolución de cliente',
    'Ajuste de inventario',
    'Transferencia interna',
    'Otro',
  ],
  OUT: [
    'Venta',
    'Devolución a proveedor',
    'Producto dañado',
    'Vencimiento',
    'Transferencia interna',
    'Otro',
  ],
  TRANSFER: [
    'Reorganización',
    'Optimización de espacio',
    'Demanda regional',
    'Otro',
  ],
  ADJUSTMENT: [
    'Diferencia de inventario',
    'Corrección de error',
    'Producto encontrado',
    'Producto perdido',
    'Otro',
  ],
};

export default function InventoryMovementForm({ onSubmit, onCancel }: InventoryMovementFormProps) {
  const [formData, setFormData] = useState<MovementFormData>({
    productId: '',
    warehouseId: '',
    movementType: 'IN',
    quantity: 0,
    reason: '',
    notes: '',
    batchNumber: '',
    expirationDate: '',
    cost: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    // Reset reason when movement type changes
    setFormData(prev => ({ ...prev, reason: '' }));
  }, [formData.movementType]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'El producto es requerido';
    }

    if (!formData.warehouseId) {
      newErrors.warehouseId = 'El almacén es requerido';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (!formData.reason) {
      newErrors.reason = 'La razón es requerida';
    }

    if (formData.movementType === 'IN' && formData.cost !== undefined && formData.cost < 0) {
      newErrors.cost = 'El costo debe ser mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableReasons = reasons[formData.movementType] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product */}
        <div className="md:col-span-2">
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
            Producto *
          </label>
          <select
            name="productId"
            id="productId"
            value={formData.productId}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.productId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Seleccionar producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
          {errors.productId && <p className="mt-2 text-sm text-red-600">{errors.productId}</p>}
        </div>

        {/* Warehouse */}
        <div>
          <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700">
            Almacén *
          </label>
          <select
            name="warehouseId"
            id="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.warehouseId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Seleccionar almacén</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
          {errors.warehouseId && <p className="mt-2 text-sm text-red-600">{errors.warehouseId}</p>}
        </div>

        {/* Movement Type */}
        <div>
          <label htmlFor="movementType" className="block text-sm font-medium text-gray-700">
            Tipo de Movimiento *
          </label>
          <select
            name="movementType"
            id="movementType"
            value={formData.movementType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {movementTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Cantidad *
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            min="0.01"
            step="0.01"
            value={formData.quantity}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.quantity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>}
        </div>

        {/* Reason */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Razón *
          </label>
          <select
            name="reason"
            id="reason"
            value={formData.reason}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.reason ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Seleccionar razón</option>
            {availableReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          {errors.reason && <p className="mt-2 text-sm text-red-600">{errors.reason}</p>}
        </div>

        {/* Batch Number (for IN movements) */}
        {formData.movementType === 'IN' && (
          <div>
            <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700">
              Número de Lote
            </label>
            <input
              type="text"
              name="batchNumber"
              id="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        )}

        {/* Expiration Date (for IN movements) */}
        {formData.movementType === 'IN' && (
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              name="expirationDate"
              id="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        )}

        {/* Cost (for IN movements) */}
        {formData.movementType === 'IN' && (
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Costo por Unidad
            </label>
            <input
              type="number"
              name="cost"
              id="cost"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.cost ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.cost && <p className="mt-2 text-sm text-red-600">{errors.cost}</p>}
          </div>
        )}

        {/* Notes */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notas Adicionales
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Información adicional sobre el movimiento..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Registrar Movimiento
        </Button>
      </div>
    </form>
  );
}
