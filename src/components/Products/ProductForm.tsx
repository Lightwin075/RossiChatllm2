
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';

interface Product {
  id?: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  unit: string;
  minStock: number;
  price: number;
  cost: number;
  isActive: boolean;
  productTypeId: string;
}

interface ProductFormProps {
  product?: any;
  productTypes: Array<{id: string, name: string}>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const units = [
  'piezas',
  'kg',
  'gramos',
  'litros',
  'ml',
  'metros',
  'cm',
  'cajas',
  'paquetes',
  'unidades',
];

export default function ProductForm({ product, productTypes, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    unit: 'piezas',
    minStock: 0,
    price: 0,
    cost: 0,
    isActive: true,
    productTypeId: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        productTypeId: (product as any).productType?.id || '',
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `PRD-${timestamp}-${randomStr}`;
  };

  const handleGenerateSKU = () => {
    setFormData(prev => ({
      ...prev,
      sku: generateSKU(),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    if (!formData.unit?.trim()) {
      newErrors.unit = 'La unidad es requerida';
    }

    if (!formData.productTypeId) {
      newErrors.productTypeId = 'El tipo de producto es requerido';
    }

    if (formData.minStock === undefined || formData.minStock < 0) {
      newErrors.minStock = 'El stock mínimo debe ser mayor o igual a 0';
    }

    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'El precio debe ser mayor o igual a 0';
    }

    if (formData.cost === undefined || formData.cost < 0) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Descripción del producto..."
          />
        </div>

        {/* SKU */}
        <div className="md:col-span-1">
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU *
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="sku"
              id="sku"
              value={formData.sku || ''}
              onChange={handleChange}
              className={`flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.sku ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={handleGenerateSKU}
              className="relative -ml-px inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
              Generar
            </button>
          </div>
          {errors.sku && <p className="mt-2 text-sm text-red-600">{errors.sku}</p>}
        </div>

        {/* Barcode */}
        <div className="md:col-span-1">
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
            Código de Barras
          </label>
          <input
            type="text"
            name="barcode"
            id="barcode"
            value={formData.barcode || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Product Type */}
        <div className="md:col-span-1">
          <label htmlFor="productTypeId" className="block text-sm font-medium text-gray-700">
            Tipo de Producto *
          </label>
          <select
            name="productTypeId"
            id="productTypeId"
            value={formData.productTypeId || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.productTypeId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Seleccionar tipo</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.productTypeId && <p className="mt-2 text-sm text-red-600">{errors.productTypeId}</p>}
        </div>

        {/* Unit */}
        <div className="md:col-span-1">
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Unidad *
          </label>
          <select
            name="unit"
            id="unit"
            value={formData.unit || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.unit ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit && <p className="mt-2 text-sm text-red-600">{errors.unit}</p>}
        </div>

        {/* Min Stock */}
        <div className="md:col-span-1">
          <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
            Stock Mínimo *
          </label>
          <input
            type="number"
            name="minStock"
            id="minStock"
            min="0"
            value={formData.minStock || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.minStock ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.minStock && <p className="mt-2 text-sm text-red-600">{errors.minStock}</p>}
        </div>

        {/* Price */}
        <div className="md:col-span-1">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio de Venta *
          </label>
          <input
            type="number"
            name="price"
            id="price"
            min="0"
            step="0.01"
            value={formData.price || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
        </div>

        {/* Cost */}
        <div className="md:col-span-1">
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Costo *
          </label>
          <input
            type="number"
            name="cost"
            id="cost"
            min="0"
            step="0.01"
            value={formData.cost || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.cost ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.cost && <p className="mt-2 text-sm text-red-600">{errors.cost}</p>}
        </div>

        {/* Status */}
        <div className="md:col-span-1">
          <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            name="isActive"
            id="isActive"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {product ? 'Actualizar' : 'Crear'} Producto
        </Button>
      </div>
    </form>
  );
}
