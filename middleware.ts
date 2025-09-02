
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Public routes that don't require authentication
    if (pathname.startsWith('/auth/') || pathname === '/') {
      return NextResponse.next()
    }

    // Require authentication for all other routes
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Role-based route protection
    const userRole = token.role as string

    // Super admin can access everything
    if (userRole === 'SUPER_ADMIN') {
      return NextResponse.next()
    }

    // Admin restrictions
    if (pathname.startsWith('/admin/users') && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Warehouse user restrictions
    if (userRole === 'WAREHOUSE') {
      const allowedPaths = [
        '/inventory',
        '/warehouses',
        '/products',
        '/suppliers',
        '/purchase-orders'
      ]
      
      const isAllowed = allowedPaths.some(path => pathname.startsWith(path))
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Production user restrictions
    if (userRole === 'PRODUCTION') {
      const allowedPaths = [
        '/production',
        '/inventory',
        '/products',
        '/warehouses'
      ]
      
      const isAllowed = allowedPaths.some(path => pathname.startsWith(path))
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        if (pathname.startsWith('/auth/') || pathname === '/') {
          return true
        }
        
        // Require token for all other routes
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
