
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { MovementType } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { 
        search, 
        productId, 
        warehouseId,
        type,
        dateFrom,
        dateTo,
        page = '1', 
        limit = '20' 
      } = req.query
      
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = {}
      
      if (search) {
        where.OR = [
          { product: { name: { contains: search as string, mode: 'insensitive' } } },
          { product: { code: { contains: search as string, mode: 'insensitive' } } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      if (productId && productId !== 'all') {
        where.productId = productId as string
      }

      if (warehouseId && warehouseId !== 'all') {
        where.warehouseId = warehouseId as string
      }

      if (type && type !== 'all') {
        where.type = type as MovementType
      }

      if (dateFrom || dateTo) {
        where.movementDate = {}
        if (dateFrom) where.movementDate.gte = new Date(dateFrom as string)
        if (dateTo) where.movementDate.lte = new Date(dateTo as string)
      }

      const [movements, total] = await Promise.all([
        prisma.inventoryMovement.findMany({
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
            batch: true,
            employee: true,
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.inventoryMovement.count({ where })
      ])

      return res.status(200).json({
        movements,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    if (req.method === 'POST') {
      const { 
        type, 
        productId, 
        warehouseId, 
        quantity, 
        description, 
        employeeId,
        batchId,
        expiryDate
      } = req.body
      
      // Validations
      if (!type || !productId || !warehouseId || !quantity) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const quantityNum = parseFloat(quantity)
      if (quantityNum <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than 0' })
      }

      // Validate product and warehouse exist
      const [product, warehouse] = await Promise.all([
        prisma.product.findUnique({ where: { id: productId } }),
        prisma.warehouse.findUnique({ where: { id: warehouseId } })
      ])

      if (!product) {
        return res.status(400).json({ error: 'Product not found' })
      }

      if (!warehouse) {
        return res.status(400).json({ error: 'Warehouse not found' })
      }

      // Handle batch logic for batch-type products
      let finalBatchId = batchId
      let batch = null

      if (product.storageType === 'BATCH') {
        if (type === 'IN') {
          // For IN movements, create new batch if not provided
          if (!batchId) {
            // Get next batch number for this product
            const lastBatch = await prisma.batch.findFirst({
              where: { productId },
              orderBy: { batchNumber: 'desc' }
            })
            
            const nextBatchNumber = (lastBatch?.batchNumber || 0) + 1
            const batchCode = `${product.code}${new Date().toISOString().split('T')[0].replace(/-/g, '')}${nextBatchNumber.toString().padStart(3, '0')}`
            
            // Create new batch
            batch = await prisma.batch.create({
              data: {
                code: batchCode,
                productId,
                warehouseId,
                batchNumber: nextBatchNumber,
                initialQuantity: quantityNum,
                currentQuantity: quantityNum,
                expiryDate: expiryDate ? new Date(expiryDate) : null
              }
            })
            
            finalBatchId = batch.id
          } else {
            // Update existing batch quantity
            batch = await prisma.batch.findUnique({ where: { id: batchId } })
            if (!batch) {
              return res.status(400).json({ error: 'Batch not found' })
            }
            
            await prisma.batch.update({
              where: { id: batchId },
              data: {
                currentQuantity: { increment: quantityNum }
              }
            })
          }
        } else {
          // For OUT movements, validate batch has enough quantity
          if (!batchId) {
            return res.status(400).json({ error: 'Batch ID required for OUT movements on batch products' })
          }
          
          batch = await prisma.batch.findUnique({ where: { id: batchId } })
          if (!batch) {
            return res.status(400).json({ error: 'Batch not found' })
          }
          
          if (Number(batch.currentQuantity) < quantityNum) {
            return res.status(400).json({ error: 'Insufficient batch quantity' })
          }
          
          // Update batch quantity
          await prisma.batch.update({
            where: { id: batchId },
            data: {
              currentQuantity: { decrement: quantityNum }
            }
          })
          
          finalBatchId = batchId
        }
      }

      // Create inventory movement
      const movement = await prisma.inventoryMovement.create({
        data: {
          type: type as MovementType,
          productId,
          warehouseId,
          batchId: finalBatchId,
          quantity: quantityNum,
          description: description || null,
          employeeId: employeeId || null,
          userId: user.id
        },
        include: {
          product: true,
          warehouse: true,
          batch: true,
          employee: true,
          user: {
            select: { firstName: true, lastName: true }
          }
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE',
        tableName: 'inventory_movements',
        recordId: movement.id,
        newValues: movement,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json({
        movement,
        newBatch: batch
      })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Inventory Movements API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
