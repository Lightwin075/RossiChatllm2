
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Table, { Column } from '@/components/UI/Table';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import Badge from '@/components/UI/Badge';
import Pagination from '@/components/UI/Pagination';
import EmployeeForm from '@/components/Employees/EmployeeForm';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  role: {
    type: 'SUPER_ADMIN' | 'ADMIN' | 'WAREHOUSE';
    name: string;
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrador',
  WAREHOUSE: 'Almacén',
};

const roleColors = {
  SUPER_ADMIN: 'purple' as const,
  ADMIN: 'blue' as const,
  WAREHOUSE: 'green' as const,
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [sortField, setSortField] = useState<string>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, selectedRole, selectedDepartment, sortField, sortDirection]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          role: selectedRole,
          department: selectedDepartment,
          sortBy: sortField,
          sortOrder: sortDirection,
        },
      });
      
      setEmployees(response.data.employees || []);
      setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Error al cargar los empleados');
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
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = async (employee: Employee) => {
    if (employee.role.type === 'SUPER_ADMIN') {
      toast.error('No se puede eliminar un Super Admin');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar al empleado "${employee.firstName} ${employee.lastName}"?`)) {
      try {
        await api.delete(`/employees/${employee.id}`);
        toast.success('Empleado eliminado exitosamente');
        fetchEmployees();
      } catch (error) {
        toast.error('Error al eliminar el empleado');
      }
    }
  };

  const handleResetPassword = async (employee: Employee) => {
    if (window.confirm(`¿Deseas enviar un email para restablecer la contraseña de "${employee.firstName} ${employee.lastName}"?`)) {
      try {
        await api.post(`/employees/${employee.id}/reset-password`);
        toast.success('Email de restablecimiento enviado exitosamente');
      } catch (error) {
        toast.error('Error al enviar el email de restablecimiento');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedEmployee) {
        await api.put(`/employees/${selectedEmployee.id}`, data);
        toast.success('Empleado actualizado exitosamente');
      } else {
        await api.post('/employees', data);
        toast.success('Empleado creado exitosamente');
      }
      
      setIsFormOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el empleado');
    }
  };

  const columns: Column[] = [
    {
      key: 'firstName',
      label: 'Nombre',
      sortable: true,
      render: (_, row: Employee) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'position',
      label: 'Cargo',
      render: (value: string, row: Employee) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          {row.department && (
            <div className="text-sm text-gray-500">{row.department}</div>
          )}
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (value: string) => (
        value ? (
          <a href={`tel:${value}`} className="text-indigo-600 hover:text-indigo-900">
            {value}
          </a>
        ) : (
          <span className="text-gray-500">-</span>
        )
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (value: any) => {
        const roleType = value?.type as keyof typeof roleColors;
        return (
          <Badge variant={roleColors[roleType] || 'gray'}>
            {roleLabels[roleType] || 'Unknown'}
          </Badge>
        );
      },
    },
    {
      key: 'lastLogin',
      label: 'Último Acceso',
      render: (value: string) => (
        value ? (
          <div className="text-sm text-gray-900">
            {format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: es })}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Nunca</span>
        )
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
      render: (_, row: Employee) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Editar"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleResetPassword(row)}
            className="text-yellow-600 hover:text-yellow-900"
            title="Restablecer contraseña"
          >
            <KeyIcon className="h-5 w-5" />
          </button>
          {row.role.type !== 'SUPER_ADMIN' && (
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

  const departments = ['Administración', 'Almacén', 'Compras', 'Ventas', 'Sistemas', 'Contabilidad'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Empleados</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona los empleados y sus accesos al sistema
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Empleado
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Buscar empleados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Todos los roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Administrador</option>
                <option value="WAREHOUSE">Almacén</option>
              </select>
            </div>
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Todos los departamentos</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={employees}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No se encontraron empleados"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={employees.length * totalPages}
        />

        {/* Form Modal */}
        <Modal
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedEmployee(null);
          }}
          title={selectedEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
          size="lg"
        >
          <EmployeeForm
            employee={selectedEmployee}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedEmployee(null);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
