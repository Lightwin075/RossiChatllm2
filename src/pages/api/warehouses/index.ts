
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { search, page = '1', limit = '10' } = req.query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = { isActive: true }
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { location: { contains: search as string, mode: 'insensitive' } },
          { responsible: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      const [warehouses, total] = await Promise.all([
        prisma.warehouse.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            _count: {
              select: {
                batches: true,
                inventoryMovements: true
              }
            }
          },
          orderBy: { name: 'asc' }
        }),
        prisma.warehouse.count({ where })
      ])

      // Calculate total stock value per warehouse
      const warehousesWithStats = await Promise.all(
        warehouses.map(async (warehouse) => {
          const batchesValue = await prisma.batch.aggregate({
            where: { warehouseId: warehouse.id },
            _sum: { currentQuantity: true }
          })

          return {
            ...warehouse,
            totalBatchQuantity: Number(batchesValue._sum.currentQuantity) || 0
          }
        })
      )

      return res.status(200).json({
        warehouses: warehousesWithStats,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    if (req.method === 'POST') {
      const { name, location, responsible, capacity } = req.body
      
      if (!name) {
        return res.status(400).json({ error: 'Warehouse name is required' })
      }

      // Check for unique name
      const existingWarehouse = await prisma.warehouse.findUnique({
        where: { name }
      })

      if (existingWarehouse) {
        return res.status(400).json({ error: 'Warehouse name already exists' })
      }

      const warehouse = await prisma.warehouse.create({
        data: {
          name,
          location: location || null,
          responsible: responsible || null,
          capacity: capacity ? parseFloat(capacity) : null
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE',
        tableName: 'warehouses',
        recordId: warehouse.id,
        newValues: warehouse,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json(warehouse)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Warehouses API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
