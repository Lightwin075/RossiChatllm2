
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid payment type ID' })
    }

    if (req.method === 'GET') {
      const paymentType = await prisma.paymentType.findUnique({
        where: { id },
        include: {
          payments: {
            include: {
              purchaseOrder: {
                include: {
                  supplier: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          _count: {
            select: {
              payments: true
            }
          }
        }
      })

      if (!paymentType) {
        return res.status(404).json({ error: 'Payment type not found' })
      }

      return res.status(200).json(paymentType)
    }

    if (req.method === 'PUT') {
      const { name, description, isActive } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Payment type name is required' })
      }

      // Get old values for audit
      const oldPaymentType = await prisma.paymentType.findUnique({
        where: { id }
      })

      if (!oldPaymentType) {
        return res.status(404).json({ error: 'Payment type not found' })
      }

      // Check for unique name if changed
      if (name !== oldPaymentType.name) {
        const existingType = await prisma.paymentType.findUnique({
          where: { name }
        })

        if (existingType) {
          return res.status(400).json({ error: 'Payment type name already exists' })
        }
      }

      const paymentType = await prisma.paymentType.update({
        where: { id },
        data: {
          name,
          description: description || null,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'UPDATE',
        tableName: 'payment_types',
        recordId: paymentType.id,
        oldValues: oldPaymentType,
        newValues: paymentType,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json(paymentType)
    }

    if (req.method === 'DELETE') {
      // Check if payment type has payments
      const paymentsCount = await prisma.payment.count({
        where: { paymentTypeId: id }
      })

      if (paymentsCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete payment type with existing payments' 
        })
      }

      const paymentType = await prisma.paymentType.delete({
        where: { id }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'DELETE',
        tableName: 'payment_types',
        recordId: id,
        oldValues: paymentType,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({ message: 'Payment type deleted successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Payment Type API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
