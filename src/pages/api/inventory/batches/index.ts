
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { generateBatchQR } from '@/lib/qr'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { 
        search, 
        productId, 
        warehouseId,
        expiringDays,
        lowStock,
        page = '1', 
        limit = '20' 
      } = req.query
      
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = {}
      
      if (search) {
        where.OR = [
          { code: { contains: search as string, mode: 'insensitive' } },
          { product: { name: { contains: search as string, mode: 'insensitive' } } },
          { product: { code: { contains: search as string, mode: 'insensitive' } } }
        ]
      }

      if (productId && productId !== 'all') {
        where.productId = productId as string
      }

      if (warehouseId && warehouseId !== 'all') {
        where.warehouseId = warehouseId as string
      }

      // Filter expiring batches
      if (expiringDays) {
        const daysNum = parseInt(expiringDays as string)
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + daysNum)
        
        where.expiryDate = {
          lte: futureDate,
          gte: new Date()
        }
      }

      // Filter low stock batches
      if (lowStock === 'true') {
        where.currentQuantity = { lt: 10 } // configurable threshold
      }

      const [batches, total] = await Promise.all([
        prisma.batch.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            product: {
              include: {
                productType: true
              }
            },
            warehouse: true,
            inventoryMovements: {
              orderBy: { createdAt: 'desc' },
              take: 5,
              include: {
                user: {
                  select: { firstName: true, lastName: true }
                }
              }
            }
          },
          orderBy: [
            { expiryDate: 'asc' },
            { createdAt: 'desc' }
          ]
        }),
        prisma.batch.count({ where })
      ])

      // Add expiry status to batches
      const batchesWithStatus = batches.map(batch => {
        let expiryStatus = 'good'
        let daysToExpiry: number | null = null

        if (batch.expiryDate) {
          const today = new Date()
          const expiry = new Date(batch.expiryDate)
          const diffTime = expiry.getTime() - today.getTime()
          daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (daysToExpiry < 0) {
            expiryStatus = 'expired'
          } else if (daysToExpiry <= 7) {
            expiryStatus = 'critical'
          } else if (daysToExpiry <= 30) {
            expiryStatus = 'warning'
          }
        }

        return {
          ...batch,
          expiryStatus,
          daysToExpiry
        }
      })

      return res.status(200).json({
        batches: batchesWithStatus,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Batches API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
