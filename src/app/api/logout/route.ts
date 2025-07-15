import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'earthy-reads-auth';

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
  }
}
