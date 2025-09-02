
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { SupplierType } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { search, type, page = '1', limit = '10' } = req.query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = {}
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { ruc: { contains: search as string } },
          { email: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      if (type && type !== 'all') {
        where.type = type as SupplierType
      }

      const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            products: {
              include: {
                product: true
              }
            },
            purchaseOrders: {
              select: {
                id: true,
                orderNumber: true,
                status: true,
                total: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.supplier.count({ where })
      ])

      return res.status(200).json({
        suppliers,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    if (req.method === 'POST') {
      const data = req.body
      
      // Validations
      if (!data.name || !data.ruc || !data.email || !data.type) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Check for unique RUC
      const existingSupplier = await prisma.supplier.findUnique({
        where: { ruc: data.ruc }
      })

      if (existingSupplier) {
        return res.status(400).json({ error: 'RUC already exists' })
      }

      // For contract suppliers, generate contract number
      let contractNumber = null
      if (data.type === 'CONTRACT') {
        const lastContract = await prisma.supplier.findFirst({
          where: { type: 'CONTRACT', contractNumber: { not: null } },
          orderBy: { contractNumber: 'desc' }
        })
        contractNumber = (lastContract?.contractNumber || 0) + 1
      }

      const supplier = await prisma.supplier.create({
        data: {
          ...data,
          contractNumber,
          phones: data.phones || [],
          categories: data.categories || [],
          contacts: data.contacts || null
        },
        include: {
          products: {
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
        tableName: 'suppliers',
        recordId: supplier.id,
        newValues: supplier,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json(supplier)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Suppliers API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
