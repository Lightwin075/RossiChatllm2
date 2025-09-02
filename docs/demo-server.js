const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3001;

// Páginas de demostración del sistema
const pages = {
  '/': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistema de Inventario Rossi - Demo</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen">
            <!-- Header -->
            <header class="bg-blue-600 text-white shadow-lg">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-boxes text-2xl"></i>
                            <h1 class="text-2xl font-bold">Sistema de Inventario Rossi</h1>
                        </div>
                        <div class="text-sm">
                            <span class="bg-blue-500 px-3 py-1 rounded-full">Demo Preview</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <div class="container mx-auto px-4 py-8">
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <h2 class="text-3xl font-bold text-gray-800 mb-6">Bienvenido al Sistema de Inventario Rossi</h2>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                            <h3 class="text-xl font-semibold mb-3">Estado del Sistema</h3>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <i class="fas fa-check-circle mr-2"></i>
                                    <span>Sistema completamente desarrollado</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check-circle mr-2"></i>
                                    <span>95% de completitud funcional</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check-circle mr-2"></i>
                                    <span>NextJS 14 + TypeScript + PostgreSQL</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                            <h3 class="text-xl font-semibold mb-3">Credenciales de Acceso</h3>
                            <div class="space-y-2 text-sm">
                                <div>
                                    <strong>Super Admin:</strong><br>
                                    admin@rossi.com / admin123
                                </div>
                                <div>
                                    <strong>Warehouse:</strong><br>
                                    almacen@rossi.com / admin123
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation Menu -->
                    <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        <a href="/login" class="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-sign-in-alt text-2xl text-blue-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Login</div>
                        </a>
                        <a href="/dashboard" class="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-tachometer-alt text-2xl text-green-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Dashboard</div>
                        </a>
                        <a href="/suppliers" class="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-truck text-2xl text-purple-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Proveedores</div>
                        </a>
                        <a href="/products" class="bg-orange-100 hover:bg-orange-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-box text-2xl text-orange-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Productos</div>
                        </a>
                        <a href="/purchase-orders" class="bg-red-100 hover:bg-red-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-shopping-cart text-2xl text-red-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Órdenes</div>
                        </a>
                        <a href="/inventory" class="bg-indigo-100 hover:bg-indigo-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-warehouse text-2xl text-indigo-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Inventario</div>
                        </a>
                        <a href="/warehouses" class="bg-teal-100 hover:bg-teal-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-building text-2xl text-teal-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Almacenes</div>
                        </a>
                        <a href="/employees" class="bg-pink-100 hover:bg-pink-200 p-4 rounded-lg text-center transition-colors">
                            <i class="fas fa-users text-2xl text-pink-600 mb-2"></i>
                            <div class="font-semibold text-gray-800">Empleados</div>
                        </a>
                    </div>

                    <!-- Features Overview -->
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="text-xl font-semibold mb-4">Funcionalidades Implementadas</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <ul class="space-y-2">
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Sistema de autenticación con roles</li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Dashboard con métricas y alertas</li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Gestión completa de proveedores</li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Control de productos y tipos</li>
                            </ul>
                            <ul class="space-y-2">
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Flujo completo de órdenes de compra</li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Control de inventario por lotes</li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Generación de PDFs y códigos QR</li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Gestión de almacenes y empleados</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `,
  
  '/login': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <div class="text-center mb-8">
                <i class="fas fa-boxes text-4xl text-blue-600 mb-4"></i>
                <h1 class="text-2xl font-bold text-gray-800">Sistema Rossi</h1>
                <p class="text-gray-600">Iniciar Sesión</p>
            </div>
            
            <form class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value="admin@rossi.com" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                    <input type="password" value="admin123" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <button type="button" onclick="window.location.href='/dashboard'" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    Iniciar Sesión
                </button>
            </form>
            
            <div class="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 class="font-semibold text-sm text-gray-700 mb-2">Credenciales de Demo:</h3>
                <div class="text-xs text-gray-600 space-y-1">
                    <div><strong>Super Admin:</strong> admin@rossi.com / admin123</div>
                    <div><strong>Warehouse:</strong> almacen@rossi.com / admin123</div>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <a href="/" class="text-blue-600 hover:text-blue-800 text-sm">← Volver al inicio</a>
            </div>
        </div>
    </body>
    </html>
  `,
  
  '/dashboard': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-boxes text-xl"></i>
                        <span class="font-bold text-lg">Sistema Rossi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">admin@rossi.com</span>
                        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
                            <i class="fas fa-sign-out-alt mr-1"></i>Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-lg min-h-screen">
                <div class="p-4">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/suppliers" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-truck"></i>
                            <span>Proveedores</span>
                        </a>
                        <a href="/products" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-box"></i>
                            <span>Productos</span>
                        </a>
                        <a href="/purchase-orders" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Órdenes de Compra</span>
                        </a>
                        <a href="/inventory" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-warehouse"></i>
                            <span>Inventario</span>
                        </a>
                        <a href="/warehouses" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-building"></i>
                            <span>Almacenes</span>
                        </a>
                        <a href="/employees" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-users"></i>
                            <span>Empleados</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-gray-800">Dashboard Principal</h1>
                    <p class="text-gray-600">Resumen general del sistema de inventario</p>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Proveedores</p>
                                <p class="text-3xl font-bold text-blue-600">24</p>
                            </div>
                            <div class="bg-blue-100 p-3 rounded-full">
                                <i class="fas fa-truck text-blue-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-green-500 text-sm font-medium">+12% este mes</span>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Productos</p>
                                <p class="text-3xl font-bold text-green-600">1,247</p>
                            </div>
                            <div class="bg-green-100 p-3 rounded-full">
                                <i class="fas fa-box text-green-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-green-500 text-sm font-medium">+8% este mes</span>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Órdenes Activas</p>
                                <p class="text-3xl font-bold text-orange-600">18</p>
                            </div>
                            <div class="bg-orange-100 p-3 rounded-full">
                                <i class="fas fa-shopping-cart text-orange-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-red-500 text-sm font-medium">-3% este mes</span>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Almacenes</p>
                                <p class="text-3xl font-bold text-purple-600">5</p>
                            </div>
                            <div class="bg-purple-100 p-3 rounded-full">
                                <i class="fas fa-building text-purple-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-gray-500 text-sm font-medium">Sin cambios</span>
                        </div>
                    </div>
                </div>

                <!-- Alerts Section -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                        Alertas de Stock Bajo
                    </h2>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                            <div>
                                <p class="font-medium text-red-800">Tornillos M8x20</p>
                                <p class="text-sm text-red-600">Stock actual: 15 unidades (Mínimo: 50)</p>
                            </div>
                            <button class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                                Reabastecer
                            </button>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                            <div>
                                <p class="font-medium text-yellow-800">Cables de Red Cat6</p>
                                <p class="text-sm text-yellow-600">Stock actual: 28 unidades (Mínimo: 25)</p>
                            </div>
                            <button class="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                                Revisar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Movimientos de Inventario</h3>
                        <canvas id="inventoryChart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h3>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div class="bg-green-100 p-2 rounded-full">
                                    <i class="fas fa-plus text-green-600"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-800">Nueva orden de compra creada</p>
                                    <p class="text-sm text-gray-600">Proveedor: TechSupply - hace 2 horas</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div class="bg-blue-100 p-2 rounded-full">
                                    <i class="fas fa-edit text-blue-600"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-800">Producto actualizado</p>
                                    <p class="text-sm text-gray-600">Cables HDMI - hace 4 horas</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div class="bg-purple-100 p-2 rounded-full">
                                    <i class="fas fa-truck text-purple-600"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-800">Nuevo proveedor registrado</p>
                                    <p class="text-sm text-gray-600">ElectroMax S.A. - hace 1 día</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <script>
            // Chart initialization
            const ctx = document.getElementById('inventoryChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Entradas',
                        data: [120, 190, 300, 500, 200, 300],
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.1
                    }, {
                        label: 'Salidas',
                        data: [80, 150, 250, 400, 180, 280],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        </script>
    </body>
    </html>
  `,
  
  '/suppliers': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proveedores - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-boxes text-xl"></i>
                        <span class="font-bold text-lg">Sistema Rossi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">admin@rossi.com</span>
                        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
                            <i class="fas fa-sign-out-alt mr-1"></i>Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-lg min-h-screen">
                <div class="p-4">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/suppliers" class="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <i class="fas fa-truck"></i>
                            <span>Proveedores</span>
                        </a>
                        <a href="/products" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-box"></i>
                            <span>Productos</span>
                        </a>
                        <a href="/purchase-orders" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Órdenes de Compra</span>
                        </a>
                        <a href="/inventory" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-warehouse"></i>
                            <span>Inventario</span>
                        </a>
                        <a href="/warehouses" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-building"></i>
                            <span>Almacenes</span>
                        </a>
                        <a href="/employees" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-users"></i>
                            <span>Empleados</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
                            <p class="text-gray-600">Administra todos los proveedores del sistema</p>
                        </div>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                            <i class="fas fa-plus"></i>
                            <span>Nuevo Proveedor</span>
                        </button>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div class="grid md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                            <div class="relative">
                                <input type="text" placeholder="Nombre o RUC..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>Todos</option>
                                <option>Activo</option>
                                <option>Inactivo</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>Todas</option>
                                <option>Electrónicos</option>
                                <option>Ferretería</option>
                                <option>Oficina</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                                <i class="fas fa-filter mr-2"></i>Filtrar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Suppliers Table -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Lista de Proveedores (24)</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUC</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-blue-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-truck text-blue-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">TechSupply S.A.C.</div>
                                                <div class="text-sm text-gray-500">Equipos tecnológicos</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20123456789</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">Juan Pérez</div>
                                        <div class="text-sm text-gray-500">juan@techsupply.com</div>
                                        <div class="text-sm text-gray-500">+51 999 123 456</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Electrónicos</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-green-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-tools text-green-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">Ferretería Central</div>
                                                <div class="text-sm text-gray-500">Herramientas y materiales</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20987654321</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">María García</div>
                                        <div class="text-sm text-gray-500">maria@ferreteria.com</div>
                                        <div class="text-sm text-gray-500">+51 999 654 321</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Ferretería</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-purple-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-clipboard text-purple-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">OfficeMax Perú</div>
                                                <div class="text-sm text-gray-500">Suministros de oficina</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20456789123</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">Carlos López</div>
                                        <div class="text-sm text-gray-500">carlos@officemax.pe</div>
                                        <div class="text-sm text-gray-500">+51 999 789 123</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Oficina</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactivo</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div class="text-sm text-gray-700">
                            Mostrando 1-3 de 24 proveedores
                        </div>
                        <div class="flex space-x-2">
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Anterior</button>
                            <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Siguiente</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
  `,
  
  '/products': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Productos - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-boxes text-xl"></i>
                        <span class="font-bold text-lg">Sistema Rossi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">admin@rossi.com</span>
                        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
                            <i class="fas fa-sign-out-alt mr-1"></i>Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-lg min-h-screen">
                <div class="p-4">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/suppliers" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-truck"></i>
                            <span>Proveedores</span>
                        </a>
                        <a href="/products" class="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <i class="fas fa-box"></i>
                            <span>Productos</span>
                        </a>
                        <a href="/purchase-orders" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Órdenes de Compra</span>
                        </a>
                        <a href="/inventory" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-warehouse"></i>
                            <span>Inventario</span>
                        </a>
                        <a href="/warehouses" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-building"></i>
                            <span>Almacenes</span>
                        </a>
                        <a href="/employees" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-users"></i>
                            <span>Empleados</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
                            <p class="text-gray-600">Administra el catálogo completo de productos</p>
                        </div>
                        <div class="flex space-x-3">
                            <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                                <i class="fas fa-qrcode"></i>
                                <span>Generar QR</span>
                            </button>
                            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                <i class="fas fa-plus"></i>
                                <span>Nuevo Producto</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Total Productos</p>
                                <p class="text-2xl font-bold text-blue-600">1,247</p>
                            </div>
                            <i class="fas fa-box text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Categorías</p>
                                <p class="text-2xl font-bold text-green-600">12</p>
                            </div>
                            <i class="fas fa-tags text-green-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Stock Bajo</p>
                                <p class="text-2xl font-bold text-red-600">23</p>
                            </div>
                            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Valor Total</p>
                                <p class="text-2xl font-bold text-purple-600">S/ 2.4M</p>
                            </div>
                            <i class="fas fa-dollar-sign text-purple-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div class="grid md:grid-cols-5 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                            <div class="relative">
                                <input type="text" placeholder="Código o nombre..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>Todas</option>
                                <option>Electrónicos</option>
                                <option>Ferretería</option>
                                <option>Oficina</option>
                                <option>Cables</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Estado Stock</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>Todos</option>
                                <option>En Stock</option>
                                <option>Stock Bajo</option>
                                <option>Sin Stock</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>Todos</option>
                                <option>TechSupply</option>
                                <option>Ferretería Central</option>
                                <option>OfficeMax</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                                <i class="fas fa-filter mr-2"></i>Filtrar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-800">Catálogo de Productos (1,247)</h3>
                        <div class="flex space-x-2">
                            <button class="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                                <i class="fas fa-th mr-1"></i>Grid
                            </button>
                            <button class="px-3 py-1 text-gray-600 rounded text-sm hover:bg-gray-100">
                                <i class="fas fa-list mr-1"></i>Lista
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <!-- Product Card 1 -->
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">ELEC-001</span>
                                    <div class="flex space-x-1">
                                        <button class="text-gray-400 hover:text-blue-600"><i class="fas fa-qrcode"></i></button>
                                        <button class="text-gray-400 hover:text-green-600"><i class="fas fa-edit"></i></button>
                                    </div>
                                </div>
                                <div class="bg-gray-100 rounded-lg p-4 mb-3 text-center">
                                    <i class="fas fa-microchip text-4xl text-gray-400"></i>
                                </div>
                                <h4 class="font-semibold text-gray-800 mb-2">Cables HDMI 2.0</h4>
                                <p class="text-sm text-gray-600 mb-3">Cable de alta velocidad 4K</p>
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-lg font-bold text-green-600">S/ 45.00</span>
                                    <span class="text-sm text-gray-500">Stock: 156</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">En Stock</span>
                                    <span class="text-xs text-gray-500">TechSupply</span>
                                </div>
                            </div>

                            <!-- Product Card 2 -->
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">FERR-002</span>
                                    <div class="flex space-x-1">
                                        <button class="text-gray-400 hover:text-blue-600"><i class="fas fa-qrcode"></i></button>
                                        <button class="text-gray-400 hover:text-green-600"><i class="fas fa-edit"></i></button>
                                    </div>
                                </div>
                                <div class="bg-gray-100 rounded-lg p-4 mb-3 text-center">
                                    <i class="fas fa-tools text-4xl text-gray-400"></i>
                                </div>
                                <h4 class="font-semibold text-gray-800 mb-2">Tornillos M8x20</h4>
                                <p class="text-sm text-gray-600 mb-3">Tornillos de acero inoxidable</p>
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-lg font-bold text-green-600">S/ 0.50</span>
                                    <span class="text-sm text-red-500">Stock: 15</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Stock Bajo</span>
                                    <span class="text-xs text-gray-500">Ferretería</span>
                                </div>
                            </div>

                            <!-- Product Card 3 -->
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">OFIC-003</span>
                                    <div class="flex space-x-1">
                                        <button class="text-gray-400 hover:text-blue-600"><i class="fas fa-qrcode"></i></button>
                                        <button class="text-gray-400 hover:text-green-600"><i class="fas fa-edit"></i></button>
                                    </div>
                                </div>
                                <div class="bg-gray-100 rounded-lg p-4 mb-3 text-center">
                                    <i class="fas fa-clipboard text-4xl text-gray-400"></i>
                                </div>
                                <h4 class="font-semibold text-gray-800 mb-2">Papel Bond A4</h4>
                                <p class="text-sm text-gray-600 mb-3">Resma 500 hojas 75g</p>
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-lg font-bold text-green-600">S/ 12.50</span>
                                    <span class="text-sm text-gray-500">Stock: 89</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">En Stock</span>
                                    <span class="text-xs text-gray-500">OfficeMax</span>
                                </div>
                            </div>

                            <!-- Product Card 4 -->
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">ELEC-004</span>
                                    <div class="flex space-x-1">
                                        <button class="text-gray-400 hover:text-blue-600"><i class="fas fa-qrcode"></i></button>
                                        <button class="text-gray-400 hover:text-green-600"><i class="fas fa-edit"></i></button>
                                    </div>
                                </div>
                                <div class="bg-gray-100 rounded-lg p-4 mb-3 text-center">
                                    <i class="fas fa-ethernet text-4xl text-gray-400"></i>
                                </div>
                                <h4 class="font-semibold text-gray-800 mb-2">Cable Red Cat6</h4>
                                <p class="text-sm text-gray-600 mb-3">Cable UTP 305m</p>
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-lg font-bold text-green-600">S/ 280.00</span>
                                    <span class="text-sm text-yellow-500">Stock: 28</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Stock Medio</span>
                                    <span class="text-xs text-gray-500">TechSupply</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div class="text-sm text-gray-700">
                            Mostrando 1-4 de 1,247 productos
                        </div>
                        <div class="flex space-x-2">
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Anterior</button>
                            <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Siguiente</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
  `,
  
  '/purchase-orders': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Órdenes de Compra - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-boxes text-xl"></i>
                        <span class="font-bold text-lg">Sistema Rossi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">admin@rossi.com</span>
                        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
                            <i class="fas fa-sign-out-alt mr-1"></i>Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-lg min-h-screen">
                <div class="p-4">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/suppliers" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-truck"></i>
                            <span>Proveedores</span>
                        </a>
                        <a href="/products" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-box"></i>
                            <span>Productos</span>
                        </a>
                        <a href="/purchase-orders" class="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Órdenes de Compra</span>
                        </a>
                        <a href="/inventory" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-warehouse"></i>
                            <span>Inventario</span>
                        </a>
                        <a href="/warehouses" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-building"></i>
                            <span>Almacenes</span>
                        </a>
                        <a href="/employees" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-users"></i>
                            <span>Empleados</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Órdenes de Compra</h1>
                            <p class="text-gray-600">Gestiona todas las órdenes de compra del sistema</p>
                        </div>
                        <div class="flex space-x-3">
                            <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                                <i class="fas fa-file-pdf"></i>
                                <span>Generar PDF</span>
                            </button>
                            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                <i class="fas fa-plus"></i>
                                <span>Nueva Orden</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Órdenes Activas</p>
                                <p class="text-2xl font-bold text-orange-600">18</p>
                            </div>
                            <i class="fas fa-shopping-cart text-orange-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Pendientes</p>
                                <p class="text-2xl font-bold text-yellow-600">7</p>
                            </div>
                            <i class="fas fa-clock text-yellow-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Completadas</p>
                                <p class="text-2xl font-bold text-green-600">156</p>
                            </div>
                            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Valor Total</p>
                                <p class="text-2xl font-bold text-blue-600">S/ 89.5K</p>
                            </div>
                            <i class="fas fa-dollar-sign text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <!-- Orders Table -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Lista de Órdenes de Compra</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-blue-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-file-alt text-blue-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">PO-2024-001</div>
                                                <div class="text-sm text-gray-500">5 productos</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">TechSupply S.A.C.</div>
                                        <div class="text-sm text-gray-500">juan@techsupply.com</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">02/09/2024</div>
                                        <div class="text-sm text-gray-500">hace 2 horas</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">S/ 2,450.00</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-file-pdf"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-green-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-file-alt text-green-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">PO-2024-002</div>
                                                <div class="text-sm text-gray-500">12 productos</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">Ferretería Central</div>
                                        <div class="text-sm text-gray-500">maria@ferreteria.com</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">01/09/2024</div>
                                        <div class="text-sm text-gray-500">hace 1 día</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">S/ 1,890.50</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completada</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-file-pdf"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-orange-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-file-alt text-orange-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">PO-2024-003</div>
                                                <div class="text-sm text-gray-500">8 productos</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">OfficeMax Perú</div>
                                        <div class="text-sm text-gray-500">carlos@officemax.pe</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">31/08/2024</div>
                                        <div class="text-sm text-gray-500">hace 2 días</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">S/ 756.25</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">En Proceso</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-file-pdf"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
  `,
  
  '/inventory': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inventario - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-boxes text-xl"></i>
                        <span class="font-bold text-lg">Sistema Rossi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">admin@rossi.com</span>
                        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
                            <i class="fas fa-sign-out-alt mr-1"></i>Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-lg min-h-screen">
                <div class="p-4">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/suppliers" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-truck"></i>
                            <span>Proveedores</span>
                        </a>
                        <a href="/products" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-box"></i>
                            <span>Productos</span>
                        </a>
                        <a href="/purchase-orders" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Órdenes de Compra</span>
                        </a>
                        <a href="/inventory" class="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <i class="fas fa-warehouse"></i>
                            <span>Inventario</span>
                        </a>
                        <a href="/warehouses" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-building"></i>
                            <span>Almacenes</span>
                        </a>
                        <a href="/employees" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-users"></i>
                            <span>Empleados</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Control de Inventario</h1>
                            <p class="text-gray-600">Gestiona movimientos y control de stock por lotes</p>
                        </div>
                        <div class="flex space-x-3">
                            <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                                <i class="fas fa-plus"></i>
                                <span>Entrada</span>
                            </button>
                            <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
                                <i class="fas fa-minus"></i>
                                <span>Salida</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Inventory Summary -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Productos en Stock</p>
                                <p class="text-2xl font-bold text-green-600">1,189</p>
                            </div>
                            <i class="fas fa-boxes text-green-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Stock Bajo</p>
                                <p class="text-2xl font-bold text-red-600">23</p>
                            </div>
                            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Lotes Activos</p>
                                <p class="text-2xl font-bold text-blue-600">456</p>
                            </div>
                            <i class="fas fa-layer-group text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Valor Total</p>
                                <p class="text-2xl font-bold text-purple-600">S/ 2.4M</p>
                            </div>
                            <i class="fas fa-dollar-sign text-purple-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <!-- Recent Movements -->
                <div class="bg-white rounded-lg shadow-lg mb-6">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Movimientos Recientes</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div class="flex items-center space-x-4">
                                    <div class="bg-green-100 p-2 rounded-full">
                                        <i class="fas fa-arrow-up text-green-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">Entrada - Cables HDMI 2.0</p>
                                        <p class="text-sm text-gray-600">Lote: LT-2024-089 | Cantidad: +50 unidades</p>
                                        <p class="text-xs text-gray-500">hace 2 horas - Almacén Principal</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-medium text-green-600">+S/ 2,250.00</p>
                                    <p class="text-xs text-gray-500">Stock actual: 156</p>
                                </div>
                            </div>

                            <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div class="flex items-center space-x-4">
                                    <div class="bg-red-100 p-2 rounded-full">
                                        <i class="fas fa-arrow-down text-red-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">Salida - Tornillos M8x20</p>
                                        <p class="text-sm text-gray-600">Lote: LT-2024-045 | Cantidad: -35 unidades</p>
                                        <p class="text-xs text-gray-500">hace 4 horas - Almacén Norte</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-medium text-red-600">-S/ 17.50</p>
                                    <p class="text-xs text-gray-500">Stock actual: 15</p>
                                </div>
                            </div>

                            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <div class="flex items-center space-x-4">
                                    <div class="bg-blue-100 p-2 rounded-full">
                                        <i class="fas fa-exchange-alt text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">Transferencia - Cable Red Cat6</p>
                                        <p class="text-sm text-gray-600">De: Almacén Principal → Almacén Sur</p>
                                        <p class="text-xs text-gray-500">hace 6 horas - Cantidad: 10 unidades</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-medium text-blue-600">Transferencia</p>
                                    <p class="text-xs text-gray-500">Stock total: 28</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Batch Control -->
                <div class="bg-white rounded-lg shadow-lg">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Control de Lotes</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almacén</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">LT-2024-089</div>
                                        <div class="text-sm text-gray-500">Lote reciente</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">Cables HDMI 2.0</div>
                                        <div class="text-sm text-gray-500">ELEC-001</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Almacén Principal</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">50 unidades</div>
                                        <div class="text-sm text-gray-500">Disponible: 50</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">02/09/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">LT-2024-045</div>
                                        <div class="text-sm text-gray-500">Stock bajo</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">Tornillos M8x20</div>
                                        <div class="text-sm text-gray-500">FERR-002</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Almacén Norte</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-red-600">15 unidades</div>
                                        <div class="text-sm text-gray-500">Disponible: 15</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">25/08/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Stock Bajo</span>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">LT-2024-067</div>
                                        <div class="text-sm text-gray-500">Lote estándar</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">Cable Red Cat6</div>
                                        <div class="text-sm text-gray-500">ELEC-004</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Almacén Sur</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-yellow-600">28 unidades</div>
                                        <div class="text-sm text-gray-500">Disponible: 28</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30/08/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Stock Medio</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
  `,
  
  '/warehouses': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Almacenes - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-boxes text-xl"></i>
                        <span class="font-bold text-lg">Sistema Rossi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">admin@rossi.com</span>
                        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
                            <i class="fas fa-sign-out-alt mr-1"></i>Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-lg min-h-screen">
                <div class="p-4">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/suppliers" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-truck"></i>
                            <span>Proveedores</span>
                        </a>
                        <a href="/products" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-box"></i>
                            <span>Productos</span>
                        </a>
                        <a href="/purchase-orders" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Órdenes de Compra</span>
                        </a>
                        <a href="/inventory" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-warehouse"></i>
                            <span>Inventario</span>
                        </a>
                        <a href="/warehouses" class="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <i class="fas fa-building"></i>
                            <span>Almacenes</span>
                        </a>
                        <a href="/employees" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-users"></i>
                            <span>Empleados</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Gestión de Almacenes</h1>
                            <p class="text-gray-600">Administra todos los almacenes y sus ubicaciones</p>
                        </div>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                            <i class="fas fa-plus"></i>
                            <span>Nuevo Almacén</span>
                        </button>
                    </div>
                </div>

                <!-- Warehouses Grid -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <!-- Warehouse 1 -->
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="bg-blue-600 text-white p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold">Almacén Principal</h3>
                                    <p class="text-blue-100 text-sm">ALM-001</p>
                                </div>
                                <i class="fas fa-building text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Ubicación:</span>
                                    <span class="text-sm font-medium">Lima Centro</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Capacidad:</span>
                                    <span class="text-sm font-medium">10,000 m²</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Productos:</span>
                                    <span class="text-sm font-medium">456 items</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Ocupación:</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: 75%"></div>
                                        </div>
                                        <span class="text-sm font-medium">75%</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Estado:</span>
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Activo</span>
                                </div>
                            </div>
                            <div class="mt-4 flex space-x-2">
                                <button class="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                                    <i class="fas fa-eye mr-1"></i>Ver Detalles
                                </button>
                                <button class="bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-300">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Warehouse 2 -->
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="bg-green-600 text-white p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold">Almacén Norte</h3>
                                    <p class="text-green-100 text-sm">ALM-002</p>
                                </div>
                                <i class="fas fa-building text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Ubicación:</span>
                                    <span class="text-sm font-medium">Los Olivos</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Capacidad:</span>
                                    <span class="text-sm font-medium">5,000 m²</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Productos:</span>
                                    <span class="text-sm font-medium">234 items</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Ocupación:</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-yellow-500 h-2 rounded-full" style="width: 45%"></div>
                                        </div>
                                        <span class="text-sm font-medium">45%</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Estado:</span>
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Activo</span>
                                </div>
                            </div>
                            <div class="mt-4 flex space-x-2">
                                <button class="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700">
                                    <i class="fas fa-eye mr-1"></i>Ver Detalles
                                </button>
                                <button class="bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-300">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Warehouse 3 -->
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="bg-purple-600 text-white p-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold">Almacén Sur</h3>
                                    <p class="text-purple-100 text-sm">ALM-003</p>
                                </div>
                                <i class="fas fa-building text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Ubicación:</span>
                                    <span class="text-sm font-medium">Villa El Salvador</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Capacidad:</span>
                                    <span class="text-sm font-medium">7,500 m²</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Productos:</span>
                                    <span class="text-sm font-medium">312 items</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Ocupación:</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-16 bg-gray-200 rounded-full h-2">
                                            <div class="bg-blue-600 h-2 rounded-full" style="width: 60%"></div>
                                        </div>
                                        <span class="text-sm font-medium">60%</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Estado:</span>
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Activo</span>
                                </div>
                            </div>
                            <div class="mt-4 flex space-x-2">
                                <button class="flex-1 bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700">
                                    <i class="fas fa-eye mr-1"></i>Ver Detalles
                                </button>
                                <button class="bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-300">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Warehouse Statistics -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Estadísticas de Almacenes</h3>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div class="text-center">
                            <div class="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                <i class="fas fa-building text-blue-600 text-2xl"></i>
                            </div>
                            <p class="text-2xl font-bold text-blue-600">5</p>
                            <p class="text-sm text-gray-600">Total Almacenes</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                <i class="fas fa-chart-area text-green-600 text-2xl"></i>
                            </div>
                            <p class="text-2xl font-bold text-green-600">22,500</p>
                            <p class="text-sm text-gray-600">Capacidad Total (m²)</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                <i class="fas fa-boxes text-purple-600 text-2xl"></i>
                            </div>
                            <p class="text-2xl font-bold text-purple-600">1,002</p>
                            <p class="text-sm text-gray-600">Productos Almacenados</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                <i class="fas fa-percentage text-orange-600 text-2xl"></i>
                            </div>
                            <p class="text-2xl font-bold text-orange-600">60%</p>
                            <p class="text-sm text-gray-600">Ocupación Promedio</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
  `,
  
  '/employees': `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Empleados - Sistema Rossi</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-boxes text-xl"></i>
                        <span class="font-bold text-lg">Sistema Rossi</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm">admin@rossi.com</span>
                        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400">
                            <i class="fas fa-sign-out-alt mr-1"></i>Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white shadow-lg min-h-screen">
                <div class="p-4">
                    <nav class="space-y-2">
                        <a href="/dashboard" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/suppliers" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-truck"></i>
                            <span>Proveedores</span>
                        </a>
                        <a href="/products" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-box"></i>
                            <span>Productos</span>
                        </a>
                        <a href="/purchase-orders" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Órdenes de Compra</span>
                        </a>
                        <a href="/inventory" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-warehouse"></i>
                            <span>Inventario</span>
                        </a>
                        <a href="/warehouses" class="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 p-3 rounded-lg">
                            <i class="fas fa-building"></i>
                            <span>Almacenes</span>
                        </a>
                        <a href="/employees" class="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <i class="fas fa-users"></i>
                            <span>Empleados</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-6">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Gestión de Empleados</h1>
                            <p class="text-gray-600">Administra el personal y control de acceso</p>
                        </div>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                            <i class="fas fa-plus"></i>
                            <span>Nuevo Empleado</span>
                        </button>
                    </div>
                </div>

                <!-- Employee Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Total Empleados</p>
                                <p class="text-2xl font-bold text-blue-600">24</p>
                            </div>
                            <i class="fas fa-users text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Super Admins</p>
                                <p class="text-2xl font-bold text-red-600">2</p>
                            </div>
                            <i class="fas fa-user-shield text-red-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Administradores</p>
                                <p class="text-2xl font-bold text-orange-600">5</p>
                            </div>
                            <i class="fas fa-user-cog text-orange-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600">Almaceneros</p>
                                <p class="text-2xl font-bold text-green-600">17</p>
                            </div>
                            <i class="fas fa-warehouse text-green-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <!-- Employees Table -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">Lista de Empleados</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almacén</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-red-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-user-shield text-red-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">Carlos Rossi</div>
                                                <div class="text-sm text-gray-500">Gerente General</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">admin@rossi.com</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Super Admin</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Todos</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-orange-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-user-cog text-orange-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">Ana García</div>
                                                <div class="text-sm text-gray-500">Jefa de Inventario</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ana.garcia@rossi.com</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Admin</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Principal</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-green-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-warehouse text-green-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">Luis Mendoza</div>
                                                <div class="text-sm text-gray-500">Almacenero</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">almacen@rossi.com</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Warehouse</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Norte</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="bg-green-100 p-2 rounded-full mr-3">
                                                <i class="fas fa-warehouse text-green-600"></i>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">María Fernández</div>
                                                <div class="text-sm text-gray-500">Almacenera</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">maria.fernandez@rossi.com</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Warehouse</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sur</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Inactivo</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button class="text-blue-600 hover:text-blue-900"><i class="fas fa-eye"></i></button>
                                        <button class="text-green-600 hover:text-green-900"><i class="fas fa-edit"></i></button>
                                        <button class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div class="text-sm text-gray-700">
                            Mostrando 1-4 de 24 empleados
                        </div>
                        <div class="flex space-x-2">
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Anterior</button>
                            <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                            <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Siguiente</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
  `
};

const server = http.createServer((req, res) => {
  const url = req.url;
  
  if (pages[url]) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(pages[url]);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Página no encontrada</h1><a href="/">Volver al inicio</a>');
  }
});

server.listen(port, () => {
  console.log(`Servidor de demostración corriendo en http://localhost:${port}`);
});
