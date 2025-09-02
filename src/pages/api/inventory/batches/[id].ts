
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { generateBatchQR } from '@/lib/qr'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid batch ID' })
    }

    if (req.method === 'GET') {
      const batch = await prisma.batch.findUnique({
        where: { id },
        include: {
          product: {
            include: {
              productType: true
            }
          },
          warehouse: true,
          inventoryMovements: {
            include: {
              user: {
                select: { firstName: true, lastName: true }
              },
              employee: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!batch) {
        return res.status(404).json({ error: 'Batch not found' })
      }

      // Calculate expiry status
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

      return res.status(200).json({
        ...batch,
        expiryStatus,
        daysToExpiry
      })
    }

    if (req.method === 'PUT') {
      const { description, expiryDate } = req.body

      const batch = await prisma.batch.update({
        where: { id },
        data: {
          description: description || null,
          expiryDate: expiryDate ? new Date(expiryDate) : null
        },
        include: {
          product: true,
          warehouse: true
        }
      })

      return res.status(200).json(batch)
    }

    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Batch API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
