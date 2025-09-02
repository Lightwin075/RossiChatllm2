
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid employee ID' })
    }

    if (req.method === 'GET') {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          inventoryMovements: {
            include: {
              product: true,
              warehouse: true
            },
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          productionOrders: {
            include: {
              product: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          _count: {
            select: {
              inventoryMovements: true,
              productionOrders: true
            }
          }
        }
      })

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' })
      }

      return res.status(200).json(employee)
    }

    if (req.method === 'PUT') {
      const { firstName, lastName, position, email, phone, isActive } = req.body

      if (!firstName || !lastName || !position) {
        return res.status(400).json({ error: 'First name, last name, and position are required' })
      }

      // Get old values for audit
      const oldEmployee = await prisma.employee.findUnique({
        where: { id }
      })

      if (!oldEmployee) {
        return res.status(404).json({ error: 'Employee not found' })
      }

      // Check for unique email if provided and changed
      if (email && email !== oldEmployee.email) {
        const existingEmployee = await prisma.employee.findFirst({
          where: { email }
        })

        if (existingEmployee) {
          return res.status(400).json({ error: 'Email already exists' })
        }
      }

      const employee = await prisma.employee.update({
        where: { id },
        data: {
          firstName,
          lastName,
          position,
          email: email || null,
          phone: phone || null,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'UPDATE',
        tableName: 'employees',
        recordId: employee.id,
        oldValues: oldEmployee,
        newValues: employee,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json(employee)
    }

    if (req.method === 'DELETE') {
      // Check if employee has inventory movements or production orders
      const [movementsCount, ordersCount] = await Promise.all([
        prisma.inventoryMovement.count({ where: { employeeId: id } }),
        prisma.productionOrder.count({ where: { employeeId: id } })
      ])

      if (movementsCount > 0 || ordersCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete employee with existing movements or production orders' 
        })
      }

      const employee = await prisma.employee.delete({
        where: { id }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'DELETE',
        tableName: 'employees',
        recordId: id,
        oldValues: employee,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({ message: 'Employee deleted successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Employee API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
