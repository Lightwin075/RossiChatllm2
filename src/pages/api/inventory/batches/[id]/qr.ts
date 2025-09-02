
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

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        product: true
      }
    })

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' })
    }

    try {
      // Generate or get existing QR code
      let qrCode = batch.qrCode

      if (!qrCode) {
        // Generate new QR code
        qrCode = await generateBatchQR({
          code: batch.code,
          productName: batch.product.name,
          batchNumber: batch.batchNumber.toString(),
          description: batch.description || undefined,
          expiryDate: batch.expiryDate ? batch.expiryDate.toISOString().split('T')[0] : undefined,
          quantity: Number(batch.currentQuantity)
        })

        // Save QR code to batch
        await prisma.batch.update({
          where: { id },
          data: { qrCode }
        })
      }

      return res.status(200).json({
        qrCode,
        batch: {
          id: batch.id,
          code: batch.code,
          productName: batch.product.name,
          batchNumber: batch.batchNumber,
          currentQuantity: batch.currentQuantity,
          expiryDate: batch.expiryDate,
          description: batch.description
        }
      })

    } catch (error) {
      console.error('Error generating QR code:', error)
      return res.status(500).json({ error: 'Failed to generate QR code' })
    }
  } catch (error) {
    console.error('Batch QR API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
