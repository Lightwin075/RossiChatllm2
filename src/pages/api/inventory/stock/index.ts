
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAuth()

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const { warehouseId, lowStock } = req.query

    // Get all products with their current stock
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        productType: true,
        batches: warehouseId ? {
          where: { warehouseId: warehouseId as string }
        } : true,
        inventoryMovements: warehouseId ? {
          where: { warehouseId: warehouseId as string }
        } : true
      }
    })

    // Calculate stock for each product
    const stockData = await Promise.all(
      products.map(async (product) => {
        let currentStock = 0
        let stockByWarehouse: Record<string, number> = {}

        if (product.storageType === 'BATCH') {
          // Sum all batch quantities
          currentStock = product.batches.reduce((sum, batch) => sum + Number(batch.currentQuantity), 0)
          
          // Group by warehouse if needed
          if (!warehouseId) {
            const batchesByWarehouse = await prisma.batch.groupBy({
              by: ['warehouseId'],
              where: { productId: product.id },
              _sum: { currentQuantity: true }
            })

            for (const group of batchesByWarehouse) {
              const warehouse = await prisma.warehouse.findUnique({
                where: { id: group.warehouseId },
                select: { name: true }
              })
              stockByWarehouse[warehouse?.name || 'Unknown'] = Number(group._sum.currentQuantity) || 0
            }
          }
        } else {
          // For bulk products, calculate from movements
          const inMovements = product.inventoryMovements.filter(m => m.type === 'IN')
          const outMovements = product.inventoryMovements.filter(m => m.type === 'OUT')
          
          const totalIn = inMovements.reduce((sum, m) => sum + Number(m.quantity), 0)
          const totalOut = outMovements.reduce((sum, m) => sum + Number(m.quantity), 0)
          
          currentStock = totalIn - totalOut
        }

        // Check if it's low stock
        const isLowStock = product.minStock ? currentStock <= Number(product.minStock) : false

        return {
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          productType: product.productType.name,
          unit: product.unit,
          storageType: product.storageType,
          currentStock,
          minStock: Number(product.minStock) || 0,
          isLowStock,
          stockByWarehouse: Object.keys(stockByWarehouse).length > 0 ? stockByWarehouse : null
        }
      })
    )

    // Filter by low stock if requested
    const filteredStock = lowStock === 'true' 
      ? stockData.filter(item => item.isLowStock)
      : stockData

    // Sort by stock level (lowest first)
    filteredStock.sort((a, b) => a.currentStock - b.currentStock)

    return res.status(200).json({
      stock: filteredStock,
      summary: {
        totalProducts: stockData.length,
        lowStockProducts: stockData.filter(item => item.isLowStock).length,
        outOfStockProducts: stockData.filter(item => item.currentStock <= 0).length
      }
    })
  } catch (error) {
    console.error('Stock API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
