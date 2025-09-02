
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuditLogData {
  userId: string
  action: string
  tableName: string
  recordId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        tableName: data.tableName,
        recordId: data.recordId,
        oldValues: data.oldValues,
        newValues: data.newValues,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

export function withAudit<T extends Record<string, any>>(
  operation: (data: T) => Promise<any>,
  tableName: string,
  action: string
) {
  return async (data: T, userId: string, req?: any) => {
    const result = await operation(data)
    
    await createAuditLog({
      userId,
      action,
      tableName,
      recordId: result?.id,
      newValues: data,
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent']
    })

    return result
  }
}
