
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface Supplier {
  id?: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxId: string;
  notes?: string;
  isActive: boolean;
}

interface SupplierFormProps {
  supplier?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'México',
    postalCode: '',
    taxId: '',
    notes: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

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

    if (!formData.contactName?.trim()) {
      newErrors.contactName = 'El nombre del contacto es requerido';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.country?.trim()) {
      newErrors.country = 'El país es requerido';
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
        <div className="md:col-span-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre de la Empresa *
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

        {/* Contact Name */}
        <div className="md:col-span-1">
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
            Nombre del Contacto *
          </label>
          <input
            type="text"
            name="contactName"
            id="contactName"
            value={formData.contactName || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.contactName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.contactName && <p className="mt-2 text-sm text-red-600">{errors.contactName}</p>}
        </div>

        {/* Email */}
        <div className="md:col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="md:col-span-1">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Tax ID */}
        <div className="md:col-span-1">
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
            RFC / ID Fiscal
          </label>
          <input
            type="text"
            name="taxId"
            id="taxId"
            value={formData.taxId || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
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

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Dirección *
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* City */}
        <div className="md:col-span-1">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad *
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
        </div>

        {/* State */}
        <div className="md:col-span-1">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Estado/Provincia
          </label>
          <input
            type="text"
            name="state"
            id="state"
            value={formData.state || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Country */}
        <div className="md:col-span-1">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            País *
          </label>
          <select
            name="country"
            id="country"
            value={formData.country || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.country ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Seleccionar país</option>
            <option value="México">México</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="Canada">Canadá</option>
            <option value="Colombia">Colombia</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Peru">Perú</option>
            <option value="España">España</option>
          </select>
          {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country}</p>}
        </div>

        {/* Postal Code */}
        <div className="md:col-span-1">
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Código Postal
          </label>
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            value={formData.postalCode || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
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
            placeholder="Notas adicionales sobre el proveedor..."
          />
        </div>
      </div>

      {/* Contract Upload Section */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Contratos y Documentos</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Subir contratos o documentos
                </span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              PDF, DOC, DOCX, JPG, PNG hasta 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {supplier ? 'Actualizar' : 'Crear'} Proveedor
        </Button>
      </div>
    </form>
  );
}
