
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid purchase order ID' })
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    // Get original order with items
    const originalOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        supplier: true
      }
    })

    if (!originalOrder) {
      return res.status(404).json({ error: 'Purchase order not found' })
    }

    try {
      // Clone order in a transaction
      const clonedOrder = await prisma.$transaction(async (tx) => {
        // Create new order (without orderNumber - it will auto-increment)
        const newOrder = await tx.purchaseOrder.create({
          data: {
            supplierId: originalOrder.supplierId,
            estimatedArrival: originalOrder.estimatedArrival,
            paymentDate: originalOrder.paymentDate,
            subtotal: originalOrder.subtotal,
            taxRate: originalOrder.taxRate,
            taxAmount: originalOrder.taxAmount,
            total: originalOrder.total,
            status: 'PRE_ORDER', // Always start as pre-order
            paymentStatus: 'UNPAID' // Always start as unpaid
          }
        })

        // Clone items
        await tx.purchaseOrderItem.createMany({
          data: originalOrder.items.map(item => ({
            purchaseOrderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotal: item.subtotal
          }))
        })

        return newOrder
      })

      // Get complete cloned order with relations
      const completeClonedOrder = await prisma.purchaseOrder.findUnique({
        where: { id: clonedOrder.id },
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
        action: 'CLONE',
        tableName: 'purchase_orders',
        recordId: clonedOrder.id,
        newValues: { 
          clonedFrom: originalOrder.orderNumber,
          originalOrderId: originalOrder.id 
        },
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json({
        clonedOrder: completeClonedOrder,
        message: `Order cloned successfully from order #${originalOrder.orderNumber}`
      })

    } catch (error) {
      console.error('Error cloning order:', error)
      return res.status(500).json({ error: 'Failed to clone order' })
    }
  } catch (error) {
    console.error('Clone Purchase Order API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
