
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { StorageType } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid product ID' })
    }

    if (req.method === 'GET') {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          productType: true,
          suppliers: {
            include: {
              supplier: true
            }
          },
          batches: {
            include: {
              warehouse: true,
              inventoryMovements: {
                orderBy: { createdAt: 'desc' },
                take: 5
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          inventoryMovements: {
            include: {
              user: {
                select: { firstName: true, lastName: true }
              },
              employee: {
                select: { firstName: true, lastName: true }
              },
              warehouse: true,
              batch: true
            },
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          purchaseOrderItems: {
            include: {
              purchaseOrder: {
                include: {
                  supplier: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      // Calculate current stock
      let currentStock = 0
      if (product.storageType === 'BATCH') {
        currentStock = product.batches.reduce((sum, batch) => sum + Number(batch.currentQuantity), 0)
      } else {
        // Calculate from movements (IN - OUT)
        const inMovements = product.inventoryMovements.filter(m => m.type === 'IN')
        const outMovements = product.inventoryMovements.filter(m => m.type === 'OUT')
        
        const totalIn = inMovements.reduce((sum, m) => sum + Number(m.quantity), 0)
        const totalOut = outMovements.reduce((sum, m) => sum + Number(m.quantity), 0)
        
        currentStock = totalIn - totalOut
      }

      return res.status(200).json({
        ...product,
        currentStock
      })
    }

    if (req.method === 'PUT') {
      const data = req.body

      // Get old values for audit
      const oldProduct = await prisma.product.findUnique({
        where: { id }
      })

      if (!oldProduct) {
        return res.status(404).json({ error: 'Product not found' })
      }

      // Check for unique code if changed
      if (data.code && data.code !== oldProduct.code) {
        const existingProduct = await prisma.product.findUnique({
          where: { code: data.code }
        })

        if (existingProduct) {
          return res.status(400).json({ error: 'Product code already exists' })
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          code: data.code,
          productTypeId: data.productTypeId,
          unit: data.unit,
          storageType: data.storageType as StorageType,
          requiresExpiry: data.requiresExpiry,
          minStock: data.minStock ? parseFloat(data.minStock) : null,
          description: data.description,
          isActive: data.isActive
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
        action: 'UPDATE',
        tableName: 'products',
        recordId: product.id,
        oldValues: oldProduct,
        newValues: product,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json(product)
    }

    if (req.method === 'DELETE') {
      // Check if product has inventory movements or is in purchase orders
      const [movementsCount, purchaseItemsCount, batchesCount] = await Promise.all([
        prisma.inventoryMovement.count({ where: { productId: id } }),
        prisma.purchaseOrderItem.count({ where: { productId: id } }),
        prisma.batch.count({ where: { productId: id } })
      ])

      if (movementsCount > 0 || purchaseItemsCount > 0 || batchesCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete product with existing movements, orders, or batches' 
        })
      }

      const product = await prisma.product.delete({
        where: { id }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'DELETE',
        tableName: 'products',
        recordId: id,
        oldValues: product,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({ message: 'Product deleted successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Product API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
