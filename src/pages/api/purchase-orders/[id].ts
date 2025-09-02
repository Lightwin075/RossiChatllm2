
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { OrderStatus } from '@prisma/client'
import { calculateTax, roundToThreeDecimals } from '@/lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid purchase order ID' })
    }

    if (req.method === 'GET') {
      const order = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          supplier: true,
          items: {
            include: {
              product: {
                include: {
                  productType: true
                }
              }
            }
          },
          payments: {
            include: {
              paymentType: true,
              user: {
                select: { firstName: true, lastName: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!order) {
        return res.status(404).json({ error: 'Purchase order not found' })
      }

      return res.status(200).json(order)
    }

    if (req.method === 'PUT') {
      // Get old values for audit
      const oldOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          items: true
        }
      })

      if (!oldOrder) {
        return res.status(404).json({ error: 'Purchase order not found' })
      }

      // Only allow editing if order is in PRE_ORDER status
      if (oldOrder.status !== 'PRE_ORDER') {
        return res.status(400).json({ error: 'Can only edit pre-orders' })
      }

      const { supplierId, estimatedArrival, paymentDate, items, taxRate = 15 } = req.body
      
      // Validations
      if (!supplierId || !estimatedArrival || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Calculate totals
      let subtotal = 0
      const validatedItems = []

      for (const item of items) {
        if (!item.productId || !item.quantity || !item.unitCost) {
          return res.status(400).json({ error: 'Invalid item data' })
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

      // Update order and items in a transaction
      const updatedOrder = await prisma.$transaction(async (tx) => {
        // Delete old items
        await tx.purchaseOrderItem.deleteMany({
          where: { purchaseOrderId: id }
        })

        // Update order
        const order = await tx.purchaseOrder.update({
          where: { id },
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

        // Create new items
        await tx.purchaseOrderItem.createMany({
          data: validatedItems.map(item => ({
            purchaseOrderId: id,
            ...item
          }))
        })

        return order
      })

      // Get complete updated order
      const completeOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
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
        action: 'UPDATE',
        tableName: 'purchase_orders',
        recordId: id,
        oldValues: oldOrder,
        newValues: completeOrder,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json(completeOrder)
    }

    if (req.method === 'DELETE') {
      const order = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          items: true,
          payments: true
        }
      })

      if (!order) {
        return res.status(404).json({ error: 'Purchase order not found' })
      }

      // Only allow deletion if order is in PRE_ORDER status and has no payments
      if (order.status !== 'PRE_ORDER' || order.payments.length > 0) {
        return res.status(400).json({ error: 'Can only delete pre-orders without payments' })
      }

      // Delete order and items (cascade will handle items)
      await prisma.purchaseOrder.delete({
        where: { id }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'DELETE',
        tableName: 'purchase_orders',
        recordId: id,
        oldValues: order,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({ message: 'Purchase order deleted successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Purchase Order API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
