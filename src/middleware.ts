import { NextResponse, type NextRequest } from 'next/server';

import { auth } from '@/lib/auth';

export default async function middleware(request: NextRequest) {
  const session = await auth();
  if (session && session.user) {
    return NextResponse.redirect(new URL('/repositories', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
  runtime: 'nodejs',
};
