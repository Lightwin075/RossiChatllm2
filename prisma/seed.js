const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear roles primero
  const adminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      type: 'SUPER_ADMIN',
      permissions: {
        "dashboard": true,
        "suppliers": true,
        "products": true,
        "inventory": true,
        "orders": true,
        "warehouses": true,
        "employees": true,
        "reports": true
      },
      isActive: true,
    },
  });

  const warehouseRole = await prisma.role.upsert({
    where: { name: 'WAREHOUSE' },
    update: {},
    create: {
      name: 'WAREHOUSE',
      type: 'WAREHOUSE',
      permissions: {
        "dashboard": true,
        "inventory": true,
        "products": true,
        "orders": false,
        "warehouses": true,
        "reports": false
      },
      isActive: true,
    },
  });

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@rossi.com' },
    update: {},
    create: {
      email: 'admin@rossi.com',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  const warehouseUser = await prisma.user.upsert({
    where: { email: 'almacen@rossi.com' },
    update: {},
    create: {
      email: 'almacen@rossi.com',
      firstName: 'Usuario',
      lastName: 'Almacén',
      password: hashedPassword,
      roleId: warehouseRole.id,
      isActive: true,
    },
  });

  // Crear almacén principal
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { name: 'Almacén Principal' },
    update: {},
    create: {
      name: 'Almacén Principal',
      location: 'Quito, Ecuador',
      responsible: 'Juan Pérez',
      capacity: 1000.0,
      isActive: true,
    },
  });

  // Crear proveedores
  const supplier1 = await prisma.supplier.upsert({
    where: { ruc: '1234567890001' },
    update: {},
    create: {
      type: 'RECURRING',
      name: 'Proveedor Tecnología S.A.',
      ruc: '1234567890001',
      email: 'contacto@provtech.com',
      phones: ['+593-2-2345678'],
      address: 'Av. Amazonas 123, Quito',
      contacts: [
        {
          name: 'Juan Pérez',
          position: 'Gerente Ventas',
          phone: '+593-2-2345678',
          email: 'juan@provtech.com'
        }
      ],
      categories: [],
      isActive: true,
    },
  });

  const supplier2 = await prisma.supplier.upsert({
    where: { ruc: '0987654321001' },
    update: {},
    create: {
      type: 'CONTRACT',
      name: 'Distribuidora Nacional',
      ruc: '0987654321001',
      email: 'ventas@distnacional.com',
      phones: ['+593-4-2876543'],
      address: 'Malecón 456, Guayaquil',
      contacts: [
        {
          name: 'María González',
          position: 'Coordinadora',
          phone: '+593-4-2876543',
          email: 'maria@distnacional.com'
        }
      ],
      categories: [],
      contractNumber: 2024001,
      contractStart: new Date('2024-01-01'),
      deliveryFreq: 'monthly',
      isActive: true,
    },
  });

  // Crear tipos de productos
  const productType1 = await prisma.productType.upsert({
    where: { name: 'Electrónicos' },
    update: {},
    create: {
      name: 'Electrónicos',
      description: 'Productos electrónicos y tecnológicos',
      isActive: true,
    },
  });

  const productType2 = await prisma.productType.upsert({
    where: { name: 'Oficina' },
    update: {},
    create: {
      name: 'Oficina',
      description: 'Suministros de oficina',
      isActive: true,
    },
  });

  // Crear productos
  const product1 = await prisma.product.upsert({
    where: { code: 'PROD-001' },
    update: {},
    create: {
      code: 'PROD-001',
      name: 'Laptop Dell Inspiron 15',
      description: 'Laptop Dell Inspiron 15 con procesador Intel i5',
      productTypeId: productType1.id,
      unit: 'unidad',
      storageType: 'BATCH',
      requiresExpiry: false,
      minStock: 5.0,
      isActive: true,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { code: 'PROD-002' },
    update: {},
    create: {
      code: 'PROD-002',
      name: 'Mouse Inalámbrico Logitech',
      description: 'Mouse inalámbrico Logitech MX Master 3',
      productTypeId: productType1.id,
      unit: 'unidad',
      storageType: 'BATCH',
      requiresExpiry: false,
      minStock: 10.0,
      isActive: true,
    },
  });

  console.log('✅ Seed completado exitosamente');
  console.log(`👤 Usuarios creados: ${adminUser.firstName} ${adminUser.lastName}, ${warehouseUser.firstName} ${warehouseUser.lastName}`);
  console.log(`🏢 Proveedores creados: ${supplier1.name}, ${supplier2.name}`);
  console.log(`📦 Productos creados: ${product1.name}, ${product2.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
