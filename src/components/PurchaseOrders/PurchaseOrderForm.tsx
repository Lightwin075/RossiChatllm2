
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  cost: number;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  contactName: string;
}

interface OrderItem {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PurchaseOrder {
  id?: string;
  supplierId: string;
  orderDate: string;
  expectedDate?: string;
  notes?: string;
  items: OrderItem[];
}

interface PurchaseOrderFormProps {
  purchaseOrder?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function PurchaseOrderForm({ purchaseOrder, onSubmit, onCancel }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    notes: '',
    items: [],
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    
    if (purchaseOrder) {
      setFormData({
        ...purchaseOrder,
        orderDate: purchaseOrder.orderDate?.split('T')[0] || '',
        expectedDate: purchaseOrder.expectedDate?.split('T')[0] || '',
      });
    } else {
      // Initialize with one empty item
      setFormData(prev => ({
        ...prev,
        items: [createEmptyItem()],
      }));
    }
  }, [purchaseOrder]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const createEmptyItem = (): OrderItem => ({
    productId: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Auto-calculate prices
    if (field === 'productId' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedItems[index].unitPrice = product.cost;
        updatedItems[index].product = product;
      }
    }

    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), createEmptyItem()],
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const calculateTotal = () => {
    return (formData.items || []).reduce((total, item) => total + item.totalPrice, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierId) {
      newErrors.supplierId = 'El proveedor es requerido';
    }

    if (!formData.orderDate) {
      newErrors.orderDate = 'La fecha de orden es requerida';
    }

    if (!formData.items?.length) {
      newErrors.items = 'Debe agregar al menos un producto';
    } else {
      const hasInvalidItems = formData.items.some(item => !item.productId || item.quantity <= 0);
      if (hasInvalidItems) {
        newErrors.items = 'Todos los productos deben tener una cantidad válida';
      }
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
      await onSubmit({
        ...formData,
        totalAmount: calculateTotal(),
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier */}
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
            Proveedor *
          </label>
          <select
            name="supplierId"
            id="supplierId"
            value={formData.supplierId || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.supplierId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Seleccionar proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {errors.supplierId && <p className="mt-2 text-sm text-red-600">{errors.supplierId}</p>}
        </div>

        {/* Order Date */}
        <div>
          <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">
            Fecha de Orden *
          </label>
          <input
            type="date"
            name="orderDate"
            id="orderDate"
            value={formData.orderDate || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.orderDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.orderDate && <p className="mt-2 text-sm text-red-600">{errors.orderDate}</p>}
        </div>

        {/* Expected Date */}
        <div>
          <label htmlFor="expectedDate" className="block text-sm font-medium text-gray-700">
            Fecha Esperada de Entrega
          </label>
          <input
            type="date"
            name="expectedDate"
            id="expectedDate"
            value={formData.expectedDate || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notas
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Notas adicionales para la orden..."
          />
        </div>
      </div>

      {/* Order Items */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Productos</h3>
          <Button type="button" onClick={addItem} size="sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Agregar Producto
          </Button>
        </div>

        {errors.items && <p className="mb-4 text-sm text-red-600">{errors.items}</p>}

        <div className="space-y-4">
          {(formData.items || []).map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border border-gray-200 rounded-lg">
              {/* Product */}
              <div className="col-span-12 md:col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Producto
                </label>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Unit Price */}
              <div className="col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Precio Unitario
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Total Price */}
              <div className="col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Total
                </label>
                <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md sm:text-sm">
                  ${item.totalPrice.toFixed(2)}
                </div>
              </div>

              {/* Remove Button */}
              <div className="col-span-6 md:col-span-2">
                {(formData.items?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-1 w-full flex justify-center px-3 py-2 text-red-600 hover:text-red-900"
                    title="Eliminar producto"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 flex justify-end">
          <div className="text-lg font-semibold">
            Total: ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {purchaseOrder ? 'Actualizar' : 'Crear'} Orden
        </Button>
      </div>
    </form>
  );
}
