
import { type ClassValue, clsx } from 'clsx'
// import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  // return twMerge(clsx(inputs))
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function generateCode(prefix: string, number: number): string {
  return `${prefix}-${number.toString().padStart(6, '0')}`
}

export function generateBatchCode(productCode: string, date: Date, batchNumber: number): string {
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
  const batchStr = batchNumber.toString().padStart(3, '0')
  return `${productCode}${dateStr}${batchStr}`
}

export function calculateTax(subtotal: number, taxRate: number = 15): number {
  return (subtotal * taxRate) / 100
}

export function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidRUC(ruc: string): boolean {
  // Basic RUC validation for Ecuador (13 digits)
  return /^\d{13}$/.test(ruc)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim() // Trim - from start and end
}
