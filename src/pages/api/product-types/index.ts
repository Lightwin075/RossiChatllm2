
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
        where.name = { contains: search as string, mode: 'insensitive' }
      }

      const [productTypes, total] = await Promise.all([
        prisma.productType.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            _count: {
              select: {
                products: true
              }
            }
          },
          orderBy: { name: 'asc' }
        }),
        prisma.productType.count({ where })
      ])

      return res.status(200).json({
        productTypes,
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
        return res.status(400).json({ error: 'Name is required' })
      }

      // Check for unique name
      const existingType = await prisma.productType.findUnique({
        where: { name }
      })

      if (existingType) {
        return res.status(400).json({ error: 'Product type name already exists' })
      }

      const productType = await prisma.productType.create({
        data: {
          name,
          description: description || null
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE',
        tableName: 'product_types',
        recordId: productType.id,
        newValues: productType,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json(productType)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Product Types API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
