
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';
import api from '@/lib/api';

interface Warehouse {
  id?: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  capacity?: number;
  managerId?: string;
  isActive: boolean;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface WarehouseFormProps {
  warehouse?: Warehouse | null;
  onSubmit: (data: Partial<Warehouse>) => void;
  onCancel: () => void;
}

export default function WarehouseForm({ warehouse, onSubmit, onCancel }: WarehouseFormProps) {
  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: 'México',
    postalCode: '',
    capacity: 0,
    managerId: '',
    isActive: true,
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEmployees();
    
    if (warehouse) {
      setFormData({
        ...warehouse,
        managerId: (warehouse as any).manager?.id || '',
      });
    }
  }, [warehouse]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees', {
        params: { role: 'WAREHOUSE' },
      });
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const generateCode = () => {
    const timestamp = Date.now().toString().slice(-4);
    const randomStr = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `ALM-${timestamp}-${randomStr}`;
  };

  const handleGenerateCode = () => {
    setFormData(prev => ({
      ...prev,
      code: generateCode(),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.code?.trim()) {
      newErrors.code = 'El código es requerido';
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del Almacén *
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

        {/* Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Código *
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="code"
              id="code"
              value={formData.code || ''}
              onChange={handleChange}
              className={`flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.code ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={handleGenerateCode}
              className="relative -ml-px inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
              Generar
            </button>
          </div>
          {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
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
        <div>
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
        <div>
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
        <div>
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
          </select>
          {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country}</p>}
        </div>

        {/* Postal Code */}
        <div>
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

        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Capacidad (m³)
          </label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            min="0"
            value={formData.capacity || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Manager */}
        <div>
          <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
            Encargado
          </label>
          <select
            name="managerId"
            id="managerId"
            value={formData.managerId || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sin asignar</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} ({employee.email})
              </option>
            ))}
          </select>
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
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {warehouse ? 'Actualizar' : 'Crear'} Almacén
        </Button>
      </div>
    </form>
  );
}
