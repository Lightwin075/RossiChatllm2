
'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatsCards from '@/components/Dashboard/StatsCards';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import LowStockAlerts from '@/components/Dashboard/LowStockAlerts';
import QuickActions from '@/components/Dashboard/QuickActions';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Bienvenido al Sistema de Inventario Rossi
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <LowStockAlerts />
      </div>
    </DashboardLayout>
  );
}
