
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (session) {
      // User is logged in, redirect to dashboard
      router.replace('/dashboard');
    } else {
      // User is not logged in, redirect to sign in
      router.replace('/auth/signin');
    }
  }, [session, status, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
}
