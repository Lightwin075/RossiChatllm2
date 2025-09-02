
'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/UI/Button';

interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  roleType: 'SUPER_ADMIN' | 'ADMIN' | 'WAREHOUSE';
  isActive: boolean;
  password?: string;
}

interface EmployeeFormProps {
  employee?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const roles = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'WAREHOUSE', label: 'Almacén' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
];

const departments = [
  'Administración',
  'Almacén',
  'Compras',
  'Ventas',
  'Sistemas',
  'Contabilidad',
  'Recursos Humanos',
  'Logística',
];

const positions = [
  'Gerente General',
  'Gerente de Almacén',
  'Supervisor de Almacén',
  'Operador de Almacén',
  'Encargado de Compras',
  'Asistente de Compras',
  'Contador',
  'Asistente Contable',
  'Administrador de Sistemas',
  'Asistente Administrativo',
];

export default function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    roleType: 'WAREHOUSE',
    isActive: true,
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        roleType: (employee as any).role?.type || 'WAREHOUSE',
        password: '', // Never pre-fill password
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.position?.trim()) {
      newErrors.position = 'El cargo es requerido';
    }

    if (!formData.roleType) {
      newErrors.roleType = 'El rol es requerido';
    }

    // Password validation only for new employees
    if (!employee && !formData.password?.trim()) {
      newErrors.password = 'La contraseña es requerida para nuevos empleados';
    } else if (!employee && formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Phone validation (optional but format check if provided)
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido';
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
      const submitData = { ...formData };
      
      // Remove password if editing and it's empty (means no change)
      if (employee && !submitData.password) {
        delete submitData.password;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Apellido *
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div>
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
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono
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
            placeholder="+52 123 456 7890"
          />
          {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Cargo *
          </label>
          <select
            name="position"
            id="position"
            value={formData.position || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.position ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Seleccionar cargo</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          {errors.position && <p className="mt-2 text-sm text-red-600">{errors.position}</p>}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Departamento
          </label>
          <select
            name="department"
            id="department"
            value={formData.department || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccionar departamento</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <label htmlFor="roleType" className="block text-sm font-medium text-gray-700">
            Rol en el Sistema *
          </label>
          <select
            name="roleType"
            id="roleType"
            value={formData.roleType || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.roleType ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.roleType && <p className="mt-2 text-sm text-red-600">{errors.roleType}</p>}
          <p className="mt-1 text-xs text-gray-500">
            {formData.roleType === 'SUPER_ADMIN' && 'Acceso completo a todo el sistema'}
            {formData.roleType === 'ADMIN' && 'Acceso a gestión de proveedores, productos, órdenes y reportes'}
            {formData.roleType === 'WAREHOUSE' && 'Acceso limitado a inventario y órdenes de compra'}
          </p>
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

        {/* Password */}
        <div className="md:col-span-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {employee ? 'Nueva Contraseña (dejar vacío para mantener actual)' : 'Contraseña *'}
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder={employee ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
          />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
        </div>
      </div>

      {/* Permission Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Información sobre Permisos</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Super Admin:</strong> Acceso completo al sistema, gestión de usuarios</p>
          <p><strong>Administrador:</strong> Gestión de proveedores, productos, órdenes, reportes</p>
          <p><strong>Almacén:</strong> Gestión de inventario, recepción de órdenes, movimientos</p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {employee ? 'Actualizar' : 'Crear'} Empleado
        </Button>
      </div>
    </form>
  );
}
