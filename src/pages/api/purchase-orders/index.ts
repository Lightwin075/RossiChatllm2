
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { calculateTax, roundToThreeDecimals } from '@/lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { 
        search, 
        supplierId, 
        status, 
        paymentStatus,
        dateFrom,
        dateTo,
        page = '1', 
        limit = '10' 
      } = req.query
      
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = {}
      
      if (search) {
        where.OR = [
          { orderNumber: parseInt(search as string) || 0 },
          { supplier: { name: { contains: search as string, mode: 'insensitive' } } },
          { supplier: { ruc: { contains: search as string } } }
        ]
      }

      if (supplierId && supplierId !== 'all') {
        where.supplierId = supplierId as string
      }

      if (status && status !== 'all') {
        where.status = status as OrderStatus
      }

      if (paymentStatus && paymentStatus !== 'all') {
        where.paymentStatus = paymentStatus as PaymentStatus
      }

      if (dateFrom || dateTo) {
        where.creationDate = {}
        if (dateFrom) where.creationDate.gte = new Date(dateFrom as string)
        if (dateTo) where.creationDate.lte = new Date(dateTo as string)
      }

      const [orders, total] = await Promise.all([
        prisma.purchaseOrder.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            supplier: true,
            items: {
              include: {
                product: true
              }
            },
            payments: true,
            _count: {
              select: {
                items: true,
                payments: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.purchaseOrder.count({ where })
      ])

      return res.status(200).json({
        orders,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    if (req.method === 'POST') {
      const { supplierId, estimatedArrival, paymentDate, items, taxRate = 15 } = req.body
      
      // Validations
      if (!supplierId || !estimatedArrival || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Validate supplier exists
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId }
      })

      if (!supplier) {
        return res.status(400).json({ error: 'Supplier not found' })
      }

      // Calculate totals
      let subtotal = 0
      const validatedItems = []

      for (const item of items) {
        if (!item.productId || !item.quantity || !item.unitCost) {
          return res.status(400).json({ error: 'Invalid item data' })
        }

        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) {
          return res.status(400).json({ error: `Product not found: ${item.productId}` })
        }

        const quantity = parseFloat(item.quantity)
        const unitCost = parseFloat(item.unitCost)
        const itemSubtotal = roundToThreeDecimals(quantity * unitCost)
        
        subtotal += itemSubtotal

        validatedItems.push({
          productId: item.productId,
          quantity,
          unitCost,
          subtotal: itemSubtotal
        })
      }

      subtotal = roundToThreeDecimals(subtotal)
      const taxAmount = roundToThreeDecimals(calculateTax(subtotal, taxRate))
      const total = roundToThreeDecimals(subtotal + taxAmount)

      // Create purchase order with items in a transaction
      const purchaseOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.purchaseOrder.create({
          data: {
            supplierId,
            estimatedArrival: new Date(estimatedArrival),
            paymentDate: paymentDate ? new Date(paymentDate) : null,
            subtotal,
            taxRate,
            taxAmount,
            total
          }
        })

        // Create items
        await tx.purchaseOrderItem.createMany({
          data: validatedItems.map(item => ({
            purchaseOrderId: order.id,
            ...item
          }))
        })

        return order
      })

      // Get complete order with relations
      const completeOrder = await prisma.purchaseOrder.findUnique({
        where: { id: purchaseOrder.id },
        include: {
          supplier: true,
          items: {
            include: {
              product: true
            }
          }
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE',
        tableName: 'purchase_orders',
        recordId: purchaseOrder.id,
        newValues: completeOrder,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json(completeOrder)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Purchase Orders API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
