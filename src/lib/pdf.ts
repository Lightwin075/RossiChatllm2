
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { formatCurrency, formatDate } from './utils'

export interface PurchaseOrderPDFData {
  orderNumber: number
  supplier: {
    name: string
    ruc: string
    address?: string
    email: string
    phone?: string
  }
  creationDate: Date
  estimatedArrival: Date
  items: Array<{
    productName: string
    quantity: number
    unit: string
    unitCost: number
    subtotal: number
  }>
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
}

export async function generatePurchaseOrderPDF(data: PurchaseOrderPDFData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let yPosition = 800

  // Header - Company info
  page.drawText(`${process.env.COMPANY_NAME || 'Rossi'} - ${process.env.COMPANY_COUNTRY || 'Ecuador'}`, {
    x: 50,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0)
  })
  yPosition -= 30

  // Title
  page.drawText(`ORDEN DE COMPRA #${data.orderNumber}`, {
    x: 50,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0)
  })
  yPosition -= 40

  // Supplier info
  page.drawText('PROVEEDOR:', {
    x: 50,
    y: yPosition,
    size: 12,
    font: boldFont
  })
  yPosition -= 20

  page.drawText(`Razón Social: ${data.supplier.name}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font
  })
  yPosition -= 15

  page.drawText(`RUC: ${data.supplier.ruc}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font
  })
  yPosition -= 15

  if (data.supplier.address) {
    page.drawText(`Dirección: ${data.supplier.address}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font: font
    })
    yPosition -= 15
  }

  page.drawText(`Email: ${data.supplier.email}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font
  })
  yPosition -= 30

  // Dates
  page.drawText(`Fecha de Creación: ${formatDate(data.creationDate)}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font
  })

  page.drawText(`Fecha Estimada de Llegada: ${formatDate(data.estimatedArrival)}`, {
    x: 300,
    y: yPosition,
    size: 10,
    font: font
  })
  yPosition -= 40

  // Items table header
  page.drawText('PRODUCTOS SOLICITADOS:', {
    x: 50,
    y: yPosition,
    size: 12,
    font: boldFont
  })
  yPosition -= 25

  // Table headers
  const headers = ['Producto', 'Cantidad', 'Unidad', 'Precio Unit.', 'Subtotal']
  const columnWidths = [200, 70, 60, 80, 80]
  let xPosition = 50

  headers.forEach((header, index) => {
    page.drawText(header, {
      x: xPosition,
      y: yPosition,
      size: 9,
      font: boldFont
    })
    xPosition += columnWidths[index]
  })
  yPosition -= 20

  // Draw line under headers
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: 540, y: yPosition },
    thickness: 1,
    color: rgb(0, 0, 0)
  })
  yPosition -= 15

  // Items
  data.items.forEach(item => {
    xPosition = 50

    const itemTexts = [
      item.productName.length > 25 ? item.productName.substring(0, 25) + '...' : item.productName,
      item.quantity.toString(),
      item.unit,
      formatCurrency(item.unitCost),
      formatCurrency(item.subtotal)
    ]

    itemTexts.forEach((text, index) => {
      page.drawText(text, {
        x: xPosition,
        y: yPosition,
        size: 9,
        font: font
      })
      xPosition += columnWidths[index]
    })
    yPosition -= 15
  })

  yPosition -= 20

  // Totals
  page.drawText(`Subtotal: ${formatCurrency(data.subtotal)}`, {
    x: 400,
    y: yPosition,
    size: 11,
    font: font
  })
  yPosition -= 15

  page.drawText(`IVA (${data.taxRate}%): ${formatCurrency(data.taxAmount)}`, {
    x: 400,
    y: yPosition,
    size: 11,
    font: font
  })
  yPosition -= 15

  page.drawText(`TOTAL: ${formatCurrency(data.total)}`, {
    x: 400,
    y: yPosition,
    size: 12,
    font: boldFont
  })

  // Footer
  yPosition = 100
  page.drawText('Condiciones:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: boldFont
  })
  yPosition -= 15

  page.drawText('- Los precios incluyen IVA', {
    x: 50,
    y: yPosition,
    size: 9,
    font: font
  })
  yPosition -= 12

  page.drawText('- Favor confirmar recepción de esta orden', {
    x: 50,
    y: yPosition,
    size: 9,
    font: font
  })

  return Buffer.from(await pdfDoc.save())
}

export async function generateBatchLabelPDF(data: {
  batchCode: string
  productName: string
  quantity: number
  unit: string
  expiryDate?: Date
  qrCodeDataUrl: string
}): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([283, 200]) // Label size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Embed QR code
  const qrImage = await pdfDoc.embedPng(data.qrCodeDataUrl)

  let yPosition = 160

  // Product name
  page.drawText(data.productName.length > 20 ? data.productName.substring(0, 20) + '...' : data.productName, {
    x: 10,
    y: yPosition,
    size: 12,
    font: boldFont
  })
  yPosition -= 20

  // Batch code
  page.drawText(`Lote: ${data.batchCode}`, {
    x: 10,
    y: yPosition,
    size: 10,
    font: font
  })
  yPosition -= 15

  // Quantity
  page.drawText(`Cantidad: ${data.quantity} ${data.unit}`, {
    x: 10,
    y: yPosition,
    size: 10,
    font: font
  })
  yPosition -= 15

  // Expiry date
  if (data.expiryDate) {
    page.drawText(`Vencimiento: ${formatDate(data.expiryDate)}`, {
      x: 10,
      y: yPosition,
      size: 10,
      font: font
    })
  }

  // QR Code
  page.drawImage(qrImage, {
    x: 180,
    y: 50,
    width: 80,
    height: 80
  })

  return Buffer.from(await pdfDoc.save())
}
