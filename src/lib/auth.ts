
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { RoleType } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: RoleType
  permissions: Record<string, any>
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions)
  return session?.user as AuthUser || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireRole(roles: RoleType | RoleType[]) {
  const user = await requireAuth()
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}
