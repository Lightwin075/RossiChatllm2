
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { search, page = '1', limit = '10' } = req.query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = { isActive: true }
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      const [paymentTypes, total] = await Promise.all([
        prisma.paymentType.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            _count: {
              select: {
                payments: true
              }
            }
          },
          orderBy: { name: 'asc' }
        }),
        prisma.paymentType.count({ where })
      ])

      return res.status(200).json({
        paymentTypes,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    if (req.method === 'POST') {
      const { name, description } = req.body
      
      if (!name) {
        return res.status(400).json({ error: 'Payment type name is required' })
      }

      // Check for unique name
      const existingType = await prisma.paymentType.findUnique({
        where: { name }
      })

      if (existingType) {
        return res.status(400).json({ error: 'Payment type name already exists' })
      }

      const paymentType = await prisma.paymentType.create({
        data: {
          name,
          description: description || null
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE',
        tableName: 'payment_types',
        recordId: paymentType.id,
        newValues: paymentType,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json(paymentType)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Payment Types API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
