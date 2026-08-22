import { cookies } from 'next/headers';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  discipline?: string;
  institutionName?: string;
}

// Default session fallback for demo mode
export const DEMO_STUDENT_SESSION: UserSession = {
  id: 'usr-student-001',
  email: 'ananya.sharma@avsar.ai',
  name: 'Dr. Ananya Sharma',
  role: 'STUDENT',
  discipline: 'GENERAL_HEALTHCARE',
  institutionName: 'All India Institute of Medical & Healthcare Sciences'
};

/**
 * Encodes a session payload into a token format
 */
export function createAuthToken(user: UserSession): string {
  const payload = btoa(JSON.stringify({ ...user, iat: Date.now() }));
  return `avsar_jwt_${payload}`;
}

/**
 * Decodes and validates an auth token
 */
export function verifyAuthToken(token: string): UserSession | null {
  try {
    if (!token.startsWith('avsar_jwt_')) return null;
    const raw = token.replace('avsar_jwt_', '');
    const decoded = JSON.parse(atob(raw));
    return decoded as UserSession;
  } catch (err) {
    return null;
  }
}

/**
 * Server-side helper to retrieve current authenticated user session
 */
export async function getAuthenticatedUser(request?: Request): Promise<UserSession> {
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const user = verifyAuthToken(token);
      if (user) return user;
    }
  }

  // Fallback to demo student session for seamless testing
  return DEMO_STUDENT_SESSION;
}
