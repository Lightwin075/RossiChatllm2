
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';

interface ProductType {
  id?: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface ProductTypeFormProps {
  productType?: ProductType | null;
  onSubmit: (data: Partial<ProductType>) => void;
  onCancel: () => void;
}

export default function ProductTypeForm({ productType, onSubmit, onCancel }: ProductTypeFormProps) {
  const [formData, setFormData] = useState<Partial<ProductType>>({
    name: '',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productType) {
      setFormData(productType);
    }
  }, [productType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
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
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del Tipo *
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
          placeholder="Ej: Bebidas, Snacks, Lácteos, etc."
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
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
          placeholder="Descripción del tipo de producto..."
        />
      </div>

      {/* Status */}
      <div>
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

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {productType ? 'Actualizar' : 'Crear'} Tipo
        </Button>
      </div>
    </form>
  );
}
