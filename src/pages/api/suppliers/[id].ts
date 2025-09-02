
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid supplier ID' })
    }

    if (req.method === 'GET') {
      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          products: {
            include: {
              product: true
            }
          },
          purchaseOrders: {
            include: {
              items: {
                include: {
                  product: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' })
      }

      return res.status(200).json(supplier)
    }

    if (req.method === 'PUT') {
      const data = req.body

      // Get old values for audit
      const oldSupplier = await prisma.supplier.findUnique({
        where: { id }
      })

      if (!oldSupplier) {
        return res.status(404).json({ error: 'Supplier not found' })
      }

      // Check for unique RUC if changed
      if (data.ruc && data.ruc !== oldSupplier.ruc) {
        const existingSupplier = await prisma.supplier.findUnique({
          where: { ruc: data.ruc }
        })

        if (existingSupplier) {
          return res.status(400).json({ error: 'RUC already exists' })
        }
      }

      const supplier = await prisma.supplier.update({
        where: { id },
        data: {
          ...data,
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
        action: 'UPDATE',
        tableName: 'suppliers',
        recordId: supplier.id,
        oldValues: oldSupplier,
        newValues: supplier,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json(supplier)
    }

    if (req.method === 'DELETE') {
      // Check if supplier has purchase orders
      const purchaseOrdersCount = await prisma.purchaseOrder.count({
        where: { supplierId: id }
      })

      if (purchaseOrdersCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete supplier with existing purchase orders' 
        })
      }

      const supplier = await prisma.supplier.delete({
        where: { id }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'DELETE',
        tableName: 'suppliers',
        recordId: id,
        oldValues: supplier,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({ message: 'Supplier deleted successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Supplier API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
