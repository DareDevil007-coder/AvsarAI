import crypto from 'crypto';

/**
 * Hashes a password securely using PBKDF2 and a unique salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored hash value with plaintext fallback
 */
export function verifyPassword(password: string, storedValue: string): boolean {
  try {
    if (!storedValue) return false;
    // Check if the stored password is in plaintext
    if (!storedValue.includes(':')) {
      return password === storedValue;
    }
    const [salt, originalHash] = storedValue.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch (e) {
    console.error("Password verification error:", e);
    return false;
  }
}
