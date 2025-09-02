
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { StorageType } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { search, productTypeId, storageType, page = '1', limit = '10' } = req.query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = { isActive: true }
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { code: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      if (productTypeId && productTypeId !== 'all') {
        where.productTypeId = productTypeId as string
      }

      if (storageType && storageType !== 'all') {
        where.storageType = storageType as StorageType
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            productType: true,
            suppliers: {
              include: {
                supplier: true
              }
            },
            batches: {
              where: { currentQuantity: { gt: 0 } },
              select: {
                id: true,
                code: true,
                currentQuantity: true,
                expiryDate: true,
                warehouse: {
                  select: { name: true }
                }
              }
            },
            _count: {
              select: {
                inventoryMovements: true,
                purchaseOrderItems: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.count({ where })
      ])

      // Calculate current stock for each product
      const productsWithStock = await Promise.all(
        products.map(async (product) => {
          let currentStock = 0
          
          if (product.storageType === 'BATCH') {
            // Sum all batch quantities
            currentStock = product.batches.reduce((sum, batch) => sum + Number(batch.currentQuantity), 0)
          } else {
            // For bulk products, calculate from inventory movements
            const movements = await prisma.inventoryMovement.aggregate({
              where: { productId: product.id },
              _sum: {
                quantity: true
              }
            })
            // Note: This is simplified - in reality you'd need to handle IN/OUT movements separately
            currentStock = Number(movements._sum.quantity) || 0
          }

          return {
            ...product,
            currentStock
          }
        })
      )

      return res.status(200).json({
        products: productsWithStock,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    if (req.method === 'POST') {
      const data = req.body
      
      // Validations
      if (!data.name || !data.code || !data.productTypeId || !data.unit || !data.storageType) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Check for unique code
      const existingProduct = await prisma.product.findUnique({
        where: { code: data.code }
      })

      if (existingProduct) {
        return res.status(400).json({ error: 'Product code already exists' })
      }

      const product = await prisma.product.create({
        data: {
          name: data.name,
          code: data.code,
          productTypeId: data.productTypeId,
          unit: data.unit,
          storageType: data.storageType as StorageType,
          requiresExpiry: data.requiresExpiry || false,
          minStock: data.minStock ? parseFloat(data.minStock) : null,
          description: data.description || null
        },
        include: {
          productType: true,
          suppliers: {
            include: {
              supplier: true
            }
          }
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE',
        tableName: 'products',
        recordId: product.id,
        newValues: product,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json(product)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Products API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
