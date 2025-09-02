"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const permissions_1 = require("../src/lib/permissions");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    // Clean existing data (in development)
    console.log('🧹 Cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.inventoryMovement.deleteMany();
    await prisma.batch.deleteMany();
    await prisma.purchaseOrderItem.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.supplierProduct.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.productType.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.paymentType.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    // Create Roles
    console.log('👥 Creating roles...');
    const superAdminRole = await prisma.role.create({
        data: {
            name: 'Super Administrador',
            type: client_1.RoleType.SUPER_ADMIN,
            permissions: permissions_1.DEFAULT_PERMISSIONS.SUPER_ADMIN
        }
    });
    const adminRole = await prisma.role.create({
        data: {
            name: 'Administrador',
            type: client_1.RoleType.ADMIN,
            permissions: permissions_1.DEFAULT_PERMISSIONS.ADMIN
        }
    });
    const warehouseRole = await prisma.role.create({
        data: {
            name: 'Almacén',
            type: client_1.RoleType.WAREHOUSE,
            permissions: permissions_1.DEFAULT_PERMISSIONS.WAREHOUSE
        }
    });
    // Create Users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    const superAdmin = await prisma.user.create({
        data: {
            email: 'admin@rossi.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'Sistema',
            roleId: superAdminRole.id
        }
    });
    const warehouseUser = await prisma.user.create({
        data: {
            email: 'almacen@rossi.com',
            password: hashedPassword,
            firstName: 'Usuario',
            lastName: 'Almacén',
            phone: '+593987654321',
            roleId: warehouseRole.id
        }
    });
    // Create Product Types
    console.log('📦 Creating product types...');
    const dairyType = await prisma.productType.create({
        data: {
            name: 'Lácteos',
            description: 'Productos lácteos y derivados'
        }
    });
    const packagingType = await prisma.productType.create({
        data: {
            name: 'Envases y Empaques',
            description: 'Envases, etiquetas y material de empaque'
        }
    });
    const chemicalType = await prisma.productType.create({
        data: {
            name: 'Químicos y Aditivos',
            description: 'Conservantes, colorantes y aditivos alimentarios'
        }
    });
    // Create Warehouses
    console.log('🏪 Creating warehouses...');
    const mainWarehouse = await prisma.warehouse.create({
        data: {
            name: 'Almacén Principal',
            location: 'Quito, Ecuador',
            responsible: 'Juan Pérez',
            capacity: 1000
        }
    });
    const coldWarehouse = await prisma.warehouse.create({
        data: {
            name: 'Almacén Refrigerado',
            location: 'Quito, Ecuador',
            responsible: 'María González',
            capacity: 500
        }
    });
    // Create Employees
    console.log('👷 Creating employees...');
    const employee1 = await prisma.employee.create({
        data: {
            firstName: 'Carlos',
            lastName: 'Rodríguez',
            position: 'Operador de Almacén',
            email: 'carlos@rossi.com',
            phone: '+593987123456'
        }
    });
    const employee2 = await prisma.employee.create({
        data: {
            firstName: 'Ana',
            lastName: 'López',
            position: 'Supervisor de Producción',
            email: 'ana@rossi.com',
            phone: '+593987654123'
        }
    });
    // Create Payment Types
    console.log('💳 Creating payment types...');
    const creditType = await prisma.paymentType.create({
        data: {
            name: 'Crédito',
            description: 'Pago a crédito con términos acordados'
        }
    });
    const cashType = await prisma.paymentType.create({
        data: {
            name: 'Contado',
            description: 'Pago inmediato en efectivo'
        }
    });
    const transferType = await prisma.paymentType.create({
        data: {
            name: 'Transferencia Bancaria',
            description: 'Pago por transferencia bancaria'
        }
    });
    // Create Suppliers
    console.log('🏢 Creating suppliers...');
    const supplier1 = await prisma.supplier.create({
        data: {
            type: client_1.SupplierType.CONTRACT,
            name: 'Lácteos del Valle S.A.',
            ruc: '1791234567001',
            address: 'Av. Principal 123, Quito',
            email: 'compras@lacteosdelvalle.com',
            phones: ['+593234567890', '+593987123456'],
            contacts: [
                {
                    name: 'Roberto Silva',
                    position: 'Gerente de Ventas',
                    phone: '+593987123456',
                    email: 'roberto@lacteosdelvalle.com'
                }
            ],
            categories: ['dairy', 'organic'],
            contractStart: new Date('2024-01-01'),
            deliveryFreq: 'weekly'
        }
    });
    const supplier2 = await prisma.supplier.create({
        data: {
            type: client_1.SupplierType.RECURRING,
            name: 'Envases Plásticos Quito Ltda.',
            ruc: '1792345678001',
            address: 'Zona Industrial Norte, Quito',
            email: 'ventas@envasesquito.com',
            phones: ['+593234567891'],
            contacts: [
                {
                    name: 'Laura Mendoza',
                    position: 'Ejecutiva de Ventas',
                    phone: '+593987234567',
                    email: 'laura@envasesquito.com'
                }
            ],
            categories: ['packaging']
        }
    });
    const supplier3 = await prisma.supplier.create({
        data: {
            type: client_1.SupplierType.CONTRACT,
            name: 'QuimiCorp Ecuador',
            ruc: '1793456789001',
            address: 'Parque Industrial, Guayaquil',
            email: 'info@quimicorp.ec',
            phones: ['+593234567892'],
            contacts: [
                {
                    name: 'Dr. Fernando Castro',
                    position: 'Director Técnico',
                    phone: '+593987345678',
                    email: 'fernando@quimicorp.ec'
                }
            ],
            categories: ['chemicals', 'additives'],
            contractStart: new Date('2024-01-15'),
            deliveryFreq: 'monthly'
        }
    });
    // Create Products
    console.log('🥛 Creating products...');
    const milkProduct = await prisma.product.create({
        data: {
            name: 'Leche Entera',
            code: 'MILK-001',
            productTypeId: dairyType.id,
            unit: 'litros',
            storageType: client_1.StorageType.BATCH,
            requiresExpiry: true,
            minStock: 100,
            description: 'Leche entera fresca para procesamiento'
        }
    });
    const bottlesProduct = await prisma.product.create({
        data: {
            name: 'Botellas PET 1L',
            code: 'BOT-001',
            productTypeId: packagingType.id,
            unit: 'unidades',
            storageType: client_1.StorageType.BULK,
            requiresExpiry: false,
            minStock: 500,
            description: 'Botellas PET de 1 litro para envasado'
        }
    });
    const preservativeProduct = await prisma.product.create({
        data: {
            name: 'Conservante Lácteo E202',
            code: 'CONS-001',
            productTypeId: chemicalType.id,
            unit: 'gramos',
            storageType: client_1.StorageType.BATCH,
            requiresExpiry: true,
            minStock: 50,
            description: 'Conservante alimentario E202 para productos lácteos'
        }
    });
    const yogurtProduct = await prisma.product.create({
        data: {
            name: 'Yogurt Natural',
            code: 'YOG-001',
            productTypeId: dairyType.id,
            unit: 'unidades',
            storageType: client_1.StorageType.BATCH,
            requiresExpiry: true,
            minStock: 20,
            description: 'Yogurt natural procesado listo para venta'
        }
    });
    // Create Supplier-Product relationships
    console.log('🔗 Creating supplier-product relationships...');
    await prisma.supplierProduct.createMany({
        data: [
            { supplierId: supplier1.id, productId: milkProduct.id },
            { supplierId: supplier2.id, productId: bottlesProduct.id },
            { supplierId: supplier3.id, productId: preservativeProduct.id }
        ]
    });
    // Create Purchase Orders
    console.log('📋 Creating purchase orders...');
    const order1 = await prisma.purchaseOrder.create({
        data: {
            supplierId: supplier1.id,
            status: 'ISSUED',
            paymentStatus: 'UNPAID',
            estimatedArrival: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            paymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            subtotal: 800,
            taxRate: 15,
            taxAmount: 120,
            total: 920,
            emailSent: true
        }
    });
    await prisma.purchaseOrderItem.create({
        data: {
            purchaseOrderId: order1.id,
            productId: milkProduct.id,
            quantity: 200,
            unitCost: 4.00,
            subtotal: 800
        }
    });
    const order2 = await prisma.purchaseOrder.create({
        data: {
            supplierId: supplier2.id,
            status: 'PRE_ORDER',
            paymentStatus: 'UNPAID',
            estimatedArrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            paymentDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
            subtotal: 250,
            taxRate: 15,
            taxAmount: 37.5,
            total: 287.5
        }
    });
    await prisma.purchaseOrderItem.create({
        data: {
            purchaseOrderId: order2.id,
            productId: bottlesProduct.id,
            quantity: 1000,
            unitCost: 0.25,
            subtotal: 250
        }
    });
    // Create Batches and Inventory Movements
    console.log('📦 Creating batches and inventory movements...');
    // Milk batch
    const milkBatch = await prisma.batch.create({
        data: {
            code: 'MILK001202501070001',
            productId: milkProduct.id,
            warehouseId: coldWarehouse.id,
            batchNumber: 1,
            initialQuantity: 150,
            currentQuantity: 120,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
    });
    await prisma.inventoryMovement.create({
        data: {
            type: 'IN',
            productId: milkProduct.id,
            warehouseId: coldWarehouse.id,
            batchId: milkBatch.id,
            quantity: 150,
            description: 'Ingreso inicial de leche fresca',
            employeeId: employee1.id,
            userId: superAdmin.id
        }
    });
    await prisma.inventoryMovement.create({
        data: {
            type: 'OUT',
            productId: milkProduct.id,
            warehouseId: coldWarehouse.id,
            batchId: milkBatch.id,
            quantity: 30,
            description: 'Uso para producción de yogurt',
            employeeId: employee2.id,
            userId: superAdmin.id
        }
    });
    // Preservative batch
    const preservativeBatch = await prisma.batch.create({
        data: {
            code: 'CONS001202501070001',
            productId: preservativeProduct.id,
            warehouseId: mainWarehouse.id,
            batchNumber: 1,
            initialQuantity: 1000,
            currentQuantity: 950,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        }
    });
    await prisma.inventoryMovement.create({
        data: {
            type: 'IN',
            productId: preservativeProduct.id,
            warehouseId: mainWarehouse.id,
            batchId: preservativeBatch.id,
            quantity: 1000,
            description: 'Stock inicial de conservante',
            employeeId: employee1.id,
            userId: superAdmin.id
        }
    });
    // Bulk product movements (bottles)
    await prisma.inventoryMovement.create({
        data: {
            type: 'IN',
            productId: bottlesProduct.id,
            warehouseId: mainWarehouse.id,
            quantity: 2000,
            description: 'Ingreso inicial de botellas PET',
            employeeId: employee1.id,
            userId: superAdmin.id
        }
    });
    await prisma.inventoryMovement.create({
        data: {
            type: 'OUT',
            productId: bottlesProduct.id,
            warehouseId: mainWarehouse.id,
            quantity: 100,
            description: 'Uso para envasado de yogurt',
            employeeId: employee2.id,
            userId: superAdmin.id
        }
    });
    // Yogurt batch (finished product)
    const yogurtBatch = await prisma.batch.create({
        data: {
            code: 'YOG001202501070001',
            productId: yogurtProduct.id,
            warehouseId: coldWarehouse.id,
            batchNumber: 1,
            initialQuantity: 50,
            currentQuantity: 35,
            expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        }
    });
    await prisma.inventoryMovement.create({
        data: {
            type: 'IN',
            productId: yogurtProduct.id,
            warehouseId: coldWarehouse.id,
            batchId: yogurtBatch.id,
            quantity: 50,
            description: 'Producción de yogurt natural - lote 001',
            employeeId: employee2.id,
            userId: superAdmin.id
        }
    });
    await prisma.inventoryMovement.create({
        data: {
            type: 'OUT',
            productId: yogurtProduct.id,
            warehouseId: coldWarehouse.id,
            batchId: yogurtBatch.id,
            quantity: 15,
            description: 'Venta a cliente mayorista',
            employeeId: employee1.id,
            userId: superAdmin.id
        }
    });
    // Create some notifications
    console.log('🔔 Creating notifications...');
    await prisma.notification.create({
        data: {
            type: 'LOW_STOCK',
            title: 'Stock bajo detectado',
            message: 'El producto Yogurt Natural tiene stock por debajo del mínimo recomendado',
            userId: superAdmin.id,
            relatedId: yogurtProduct.id,
            relatedType: 'product'
        }
    });
    await prisma.notification.create({
        data: {
            type: 'EXPIRING',
            title: 'Producto próximo a vencer',
            message: 'El lote MILK001202501070001 vence en 7 días',
            userId: superAdmin.id,
            relatedId: milkBatch.id,
            relatedType: 'batch'
        }
    });
    console.log('✅ Seed completed successfully!');
    console.log('👤 Super Admin: admin@rossi.com / admin123');
    console.log('👤 Warehouse User: almacen@rossi.com / admin123');
}
main()
    .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
