'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyPasscode } from './actions'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const passcode = formData.get('passcode') as string

    const result = await verifyPasscode(passcode)

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
      style={{ background: '#faf6f0' }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{
          background: '#fff',
          border: '1px solid #ddd0c0',
          boxShadow: '0 4px 24px rgba(107,31,43,0.08)',
        }}
      >
        <h1 className="font-display text-2xl font-bold mb-2" style={{ color: '#6b1f2b' }}>
          Verwalten
        </h1>
        <p className="text-sm mb-6" style={{ color: '#7a6a5a' }}>
          Bitte gib den Zugangscode ein.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            name="passcode"
            placeholder="Zugangscode"
            autoFocus
            autoComplete="current-password"
            required
            className="w-full rounded-lg px-4 py-3 text-sm"
            style={{
              border: '1.5px solid #ddd0c0',
              background: '#faf6f0',
              color: '#3d2b1f',
              outline: 'none',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#6b1f2b')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#ddd0c0')}
          />

          {error && (
            <p className="text-sm" style={{ color: '#c0392b' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity disabled:opacity-60 hover:opacity-90"
            style={{ background: '#6b1f2b', color: '#faf6f0', cursor: loading ? 'default' : 'pointer' }}
          >
            {loading ? 'Prüfe…' : 'Einloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}
