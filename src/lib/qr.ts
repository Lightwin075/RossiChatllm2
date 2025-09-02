
import QRCode from 'qrcode'

export interface QRCodeData {
  code: string
  productName: string
  batchNumber: string
  description?: string
  expiryDate?: string
  quantity?: number
}

export async function generateBatchQR(data: QRCodeData): Promise<string> {
  const qrContent = {
    type: 'BATCH',
    code: data.code,
    product: data.productName,
    batch: data.batchNumber,
    description: data.description,
    expiry: data.expiryDate,
    quantity: data.quantity,
    company: process.env.COMPANY_NAME || 'Rossi',
    generated: new Date().toISOString()
  }

  try {
    // Generate QR code as base64 string
    const qrString = await QRCode.toDataURL(JSON.stringify(qrContent), {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return qrString
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateProductionQR(data: {
  productId: string
  productName: string
  batchCode: string
  productionDate: Date
  quantity: number
  expiryDate?: Date
}): Promise<string> {
  const qrContent = {
    type: 'PRODUCTION',
    productId: data.productId,
    product: data.productName,
    batch: data.batchCode,
    produced: data.productionDate.toISOString().split('T')[0],
    quantity: data.quantity,
    expiry: data.expiryDate?.toISOString().split('T')[0],
    company: process.env.COMPANY_NAME || 'Rossi'
  }

  try {
    return await QRCode.toDataURL(JSON.stringify(qrContent), {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Error generating production QR code:', error)
    throw new Error('Failed to generate production QR code')
  }
}

export function parseQRCode(qrContent: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrContent)
    
    if (data.type === 'BATCH') {
      return {
        code: data.code,
        productName: data.product,
        batchNumber: data.batch,
        description: data.description,
        expiryDate: data.expiry,
        quantity: data.quantity
      }
    }
    
    return null
  } catch {
    return null
  }
}
