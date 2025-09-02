
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method === 'GET') {
      const { search, position, page = '1', limit = '10' } = req.query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where: any = { isActive: true }
      
      if (search) {
        where.OR = [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { position: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      if (position && position !== 'all') {
        where.position = { contains: position as string, mode: 'insensitive' }
      }

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: {
            _count: {
              select: {
                inventoryMovements: true,
                productionOrders: true
              }
            }
          },
          orderBy: [
            { firstName: 'asc' },
            { lastName: 'asc' }
          ]
        }),
        prisma.employee.count({ where })
      ])

      return res.status(200).json({
        employees,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      })
    }

    if (req.method === 'POST') {
      const { firstName, lastName, position, email, phone } = req.body
      
      if (!firstName || !lastName || !position) {
        return res.status(400).json({ error: 'First name, last name, and position are required' })
      }

      // Check for unique email if provided
      if (email) {
        const existingEmployee = await prisma.employee.findFirst({
          where: { email }
        })

        if (existingEmployee) {
          return res.status(400).json({ error: 'Email already exists' })
        }
      }

      const employee = await prisma.employee.create({
        data: {
          firstName,
          lastName,
          position,
          email: email || null,
          phone: phone || null
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE',
        tableName: 'employees',
        recordId: employee.id,
        newValues: employee,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(201).json(employee)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Employees API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
