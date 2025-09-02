
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

    // Only send email for issued orders
    if (order.status !== 'ISSUED') {
      return res.status(400).json({ error: 'Order must be processed first' })
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

      // Send email
      const emailSent = await sendPurchaseOrderEmail(
        order.supplier.email,
        order.orderNumber,
        pdfBuffer
      )

      if (emailSent) {
        // Update email sent status
        await prisma.purchaseOrder.update({
          where: { id },
          data: { emailSent: true }
        })

        // Create audit log
        await createAuditLog({
          userId: user.id,
          action: 'EMAIL_SENT',
          tableName: 'purchase_orders',
          recordId: id,
          newValues: { emailSent: true, recipientEmail: order.supplier.email },
          ipAddress: req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        })

        return res.status(200).json({ message: 'Email sent successfully' })
      } else {
        return res.status(500).json({ error: 'Failed to send email' })
      }

    } catch (error) {
      console.error('Error sending email:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }
  } catch (error) {
    console.error('Send Email API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
