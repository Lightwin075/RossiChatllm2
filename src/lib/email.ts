
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

export async function sendPurchaseOrderEmail(
  supplierEmail: string,
  orderNumber: number,
  pdfBuffer: Buffer
): Promise<boolean> {
  const subject = `Pre-orden Nro. ${orderNumber} - ${process.env.COMPANY_NAME}`
  const html = `
    <h2>Nueva Orden de Compra</h2>
    <p>Estimado proveedor,</p>
    <p>Le enviamos adjunta la orden de compra número <strong>${orderNumber}</strong>.</p>
    <p>Por favor, confirme la recepción de esta orden y la disponibilidad de los productos solicitados.</p>
    <br>
    <p>Saludos cordiales,</p>
    <p><strong>${process.env.COMPANY_NAME}</strong></p>
  `

  return sendEmail({
    to: supplierEmail,
    subject,
    html,
    attachments: [{
      filename: `orden-compra-${orderNumber}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }]
  })
}

export async function sendLowStockAlert(
  userEmail: string,
  products: Array<{ name: string; currentStock: number; minStock: number }>
): Promise<boolean> {
  const subject = 'Alerta: Productos con Bajo Stock'
  
  let productList = products.map(p => 
    `<li><strong>${p.name}</strong>: Stock actual ${p.currentStock}, Mínimo recomendado ${p.minStock}</li>`
  ).join('')

  const html = `
    <h2>Alerta de Bajo Stock</h2>
    <p>Los siguientes productos tienen stock por debajo del mínimo recomendado:</p>
    <ul>
      ${productList}
    </ul>
    <p>Se recomienda generar órdenes de compra para reponer el stock.</p>
  `

  return sendEmail({
    to: userEmail,
    subject,
    html
  })
}

export async function sendExpiryAlert(
  userEmail: string,
  batches: Array<{ productName: string; batchCode: string; expiryDate: Date; daysToExpiry: number }>
): Promise<boolean> {
  const subject = 'Alerta: Productos Próximos a Vencer'
  
  let batchList = batches.map(b => 
    `<li><strong>${b.productName}</strong> (Lote: ${b.batchCode}): Vence el ${b.expiryDate.toLocaleDateString()} (${b.daysToExpiry} días)</li>`
  ).join('')

  const html = `
    <h2>Alerta de Vencimientos</h2>
    <p>Los siguientes lotes están próximos a vencer:</p>
    <ul>
      ${batchList}
    </ul>
    <p>Se recomienda revisar y gestionar estos productos antes de su vencimiento.</p>
  `

  return sendEmail({
    to: userEmail,
    subject,
    html
  })
}
