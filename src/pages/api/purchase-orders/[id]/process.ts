
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { generatePurchaseOrderPDF } from '@/lib/pdf'
import { sendPurchaseOrderEmail } from '@/lib/email'

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

    // Get order with all required data
    const order = await prisma.purchaseOrder.findUnique({
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

    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' })
    }

    // Only process orders in PRE_ORDER status
    if (order.status !== 'PRE_ORDER') {
      return res.status(400).json({ error: 'Order is already processed' })
    }

    try {
      // Generate PDF
      const pdfBuffer = await generatePurchaseOrderPDF({
        orderNumber: order.orderNumber,
        supplier: {
          name: order.supplier.name,
          ruc: order.supplier.ruc,
          address: order.supplier.address,
          email: order.supplier.email,
          phone: order.supplier.phones[0] || undefined
        },
        creationDate: order.creationDate,
        estimatedArrival: order.estimatedArrival,
        items: order.items.map(item => ({
          productName: item.product.name,
          quantity: Number(item.quantity),
          unit: item.product.unit,
          unitCost: Number(item.unitCost),
          subtotal: Number(item.subtotal)
        })),
        subtotal: Number(order.subtotal),
        taxRate: Number(order.taxRate),
        taxAmount: Number(order.taxAmount),
        total: Number(order.total)
      })

      // Update order status
      const updatedOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: 'ISSUED'
        },
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
        action: 'PROCESS',
        tableName: 'purchase_orders',
        recordId: id,
        oldValues: { status: 'PRE_ORDER' },
        newValues: { status: 'ISSUED' },
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({
        order: updatedOrder,
        pdf: pdfBuffer.toString('base64'),
        message: 'Order processed successfully'
      })

    } catch (error) {
      console.error('Error processing order:', error)
      return res.status(500).json({ error: 'Failed to process order' })
    }
  } catch (error) {
    console.error('Process Purchase Order API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
