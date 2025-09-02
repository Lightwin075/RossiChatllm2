"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PERMISSIONS = void 0;
exports.hasPermission = hasPermission;
exports.canAccessModule = canAccessModule;
exports.canModifyModule = canModifyModule;
// Default permissions for each role
exports.DEFAULT_PERMISSIONS = {
    SUPER_ADMIN: [
        // Full access to everything
        { module: '*', action: 'admin' }
    ],
    ADMIN: [
        // All operational modules
        { module: 'suppliers', action: 'admin' },
        { module: 'products', action: 'admin' },
        { module: 'warehouses', action: 'admin' },
        { module: 'employees', action: 'admin' },
        { module: 'purchase_orders', action: 'admin' },
        { module: 'inventory', action: 'admin' },
        { module: 'payments', action: 'admin' },
        { module: 'production', action: 'admin' },
        { module: 'notifications', action: 'admin' },
        // Read-only for users and audit
        { module: 'users', action: 'read' },
        { module: 'audit', action: 'read' }
    ],
    WAREHOUSE: [
        // Inventory and warehouse operations
        { module: 'inventory', action: 'admin' },
        { module: 'warehouses', action: 'read' },
        { module: 'products', action: 'read' },
        { module: 'suppliers', action: 'read' },
        { module: 'purchase_orders', action: 'read' },
        { module: 'notifications', action: 'read' }
    ],
    PRODUCTION: [
        // Production operations
        { module: 'production', action: 'admin' },
        { module: 'inventory', action: 'read' },
        { module: 'products', action: 'read' },
        { module: 'warehouses', action: 'read' },
        { module: 'notifications', action: 'read' }
    ],
    CUSTOM: [
    // Custom permissions defined per user
    ]
};
function hasPermission(userPermissions, module, action) {
    // Super admin has access to everything
    if (userPermissions.some(function (p) { return p.module === '*' && p.action === 'admin'; })) {
        return true;
    }
    return userPermissions.some(function (p) {
        // Exact match
        if (p.module === module) {
            // Admin action allows all
            if (p.action === 'admin')
                return true;
            // Exact action match
            if (p.action === action)
                return true;
            // Update permission includes create and read
            if (p.action === 'update' && ['create', 'read'].includes(action))
                return true;
            // Delete permission includes all other actions
            if (p.action === 'delete')
                return true;
        }
        return false;
    });
}
function canAccessModule(userPermissions, module) {
    return hasPermission(userPermissions, module, 'read');
}
function canModifyModule(userPermissions, module) {
    return hasPermission(userPermissions, module, 'update');
}
