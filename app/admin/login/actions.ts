'use server'

import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function verifyPasscode(passcode: string): Promise<{ error: string } | { success: true }> {
  const expected = process.env.ADMIN_PASSCODE

  if (!expected || passcode !== expected) {
    return { error: 'Falscher Zugangscode. Bitte versuche es erneut.' }
  }

  const sessionToken = crypto
    .createHash('sha256')
    .update(`admin:${expected}`)
    .digest('hex')

  const cookieStore = await cookies()
  cookieStore.set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return { success: true }
}
