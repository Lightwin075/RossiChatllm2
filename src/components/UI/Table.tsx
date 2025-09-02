
'use client';

import { ReactNode } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => ReactNode;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  emptyMessage?: string;
}

export default function Table({
  columns,
  data,
  loading = false,
  sortField,
  sortDirection,
  onSort,
  emptyMessage = 'No hay datos disponibles',
}: TableProps) {
  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="animate-pulse">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex space-x-4">
              {columns.map((_, i) => (
                <div key={i} className="flex-1 h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex space-x-4">
                  {columns.map((_, j) => (
                    <div key={j} className="flex-1 h-4 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.sortable && 'cursor-pointer hover:bg-gray-100',
                  column.className
                )}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <ChevronUpDownIcon
                      className={clsx(
                        'h-4 w-4',
                        sortField === column.key
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      )}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={clsx(
                      'px-6 py-4 whitespace-nowrap text-sm',
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
