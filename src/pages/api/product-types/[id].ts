
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid product type ID' })
    }

    if (req.method === 'GET') {
      const productType = await prisma.productType.findUnique({
        where: { id },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true
            }
          },
          _count: {
            select: {
              products: true
            }
          }
        }
      })

      if (!productType) {
        return res.status(404).json({ error: 'Product type not found' })
      }

      return res.status(200).json(productType)
    }

    if (req.method === 'PUT') {
      const { name, description, isActive } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Name is required' })
      }

      // Get old values for audit
      const oldProductType = await prisma.productType.findUnique({
        where: { id }
      })

      if (!oldProductType) {
        return res.status(404).json({ error: 'Product type not found' })
      }

      // Check for unique name if changed
      if (name !== oldProductType.name) {
        const existingType = await prisma.productType.findUnique({
          where: { name }
        })

        if (existingType) {
          return res.status(400).json({ error: 'Product type name already exists' })
        }
      }

      const productType = await prisma.productType.update({
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
        tableName: 'product_types',
        recordId: productType.id,
        oldValues: oldProductType,
        newValues: productType,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json(productType)
    }

    if (req.method === 'DELETE') {
      // Check if product type has products
      const productsCount = await prisma.product.count({
        where: { productTypeId: id }
      })

      if (productsCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete product type with existing products' 
        })
      }

      const productType = await prisma.productType.delete({
        where: { id }
      })

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'DELETE',
        tableName: 'product_types',
        recordId: id,
        oldValues: productType,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      })

      return res.status(200).json({ message: 'Product type deleted successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Product Type API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
