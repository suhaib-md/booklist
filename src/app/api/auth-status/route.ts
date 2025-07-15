import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'earthy-reads-auth';

export async function GET() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get(COOKIE_NAME)?.value === 'true';
  return NextResponse.json({ isAuthenticated });
}
