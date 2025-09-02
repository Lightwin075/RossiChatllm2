
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid warehouse ID' })
    }

    if (req.method === 'GET') {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
        include: {
          batches: {
            include: {
              product: true
            },
            where: { currentQuantity: { gt: 0 } },
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          inventoryMovements: {
            include: {
              product: true,
              user: {
                select: { firstName: true, lastName: true }
              },
              employee: {
                select: { firstName: true, lastName: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          _count: {
            select: {
              batches: true,
              inventoryMovements: true
            }
          }
        }
      })

      if (!warehouse) {
        return res.status(404).json({ error: 'Warehouse not found' })
      }

      // Calculate warehouse utilization
      const totalBatchQuantity = warehouse.batches.reduce(
        (sum, batch) => sum + Number(batch.currentQuantity), 0
      )

      const utilizationPercentage = warehouse.capacity 
        ? (totalBatchQuantity / Number(warehouse.capacity)) * 100 
        : null

      return res.status(200).json({
        ...warehouse,
        totalBatchQuantity,
        utilizationPercentage: utilizationPercentage ? Math.round(utilizationPercentage * 100) / 100 : null
      })
    }

    if (req.method === 'PUT') {
      const { name, location, responsible, capacity, isActive } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Warehouse name is required' })
      }

      // Get old values for audit
      const oldWarehouse = await prisma.warehouse.findUnique({
        where: { id }
      })

      if (!oldWarehouse) {
        return res.status(404).json({ error: 'Warehouse not found' })
      }

      // Check for unique name if changed
      if (name !== oldWarehouse.name) {
        const existingWarehouse = await prisma.warehouse.findUnique({
          where: { name }
        })

        if (existingWarehouse) {
          return res.status(400).json({ error: 'Warehouse name already exists' })
        }
      }

      const warehouse = await prisma.warehouse.update({
        where: { id },
        data: {
          name,
          location: location || null,
          responsible: responsible || null,
          capacity: capacity ? parseFloat(capacity) : null,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'UPDATE',
        tableName: 'warehouses',
        recordId: warehouse.id,
        oldValues: oldWarehouse,
        newValues: warehouse,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json(warehouse)
    }

    if (req.method === 'DELETE') {
      // Check if warehouse has batches or inventory movements
      const [batchesCount, movementsCount] = await Promise.all([
        prisma.batch.count({ where: { warehouseId: id } }),
        prisma.inventoryMovement.count({ where: { warehouseId: id } })
      ])

      if (batchesCount > 0 || movementsCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete warehouse with existing batches or inventory movements' 
        })
      }

      const warehouse = await prisma.warehouse.delete({
        where: { id }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'DELETE',
        tableName: 'warehouses',
        recordId: id,
        oldValues: warehouse,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({ message: 'Warehouse deleted successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Warehouse API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
