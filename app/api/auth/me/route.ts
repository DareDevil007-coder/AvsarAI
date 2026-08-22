import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  return NextResponse.json({ authenticated: true, user });
}
