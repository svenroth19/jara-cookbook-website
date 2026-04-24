'use client'

import Link from 'next/link'
import { useState } from 'react'

const ABOUT_INFO = {
  name: 'Jara Rech',
  about:
    'Ich habe dieses Kochbuch im Rahmen eines Schulprojekts erstellt. Kochen macht mir Spass, und ich probiere gerne neue Rezepte aus. Mit diesem Kochbuch möchte ich einfache und leckere Gerichte zeigen, die jeder nachkochen kann.',
  instagram: '@mycookingbookjararech',
  instagramUrl: 'https://www.instagram.com/mycookingbookjararech/',
  phone: '078 262 70 78',
  email: 'jara.rech@icloud.com',
  ort: 'Toffen, Schweiz',
}

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full bg-[#6b1f2b] backdrop-blur supports-[backdrop-filter]:bg-[#6b1f2b]"
        style={{ borderBottom: '1px solid #ddd0c0' }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="group flex items-center">
            <span className="font-display text-xl font-bold tracking-tight text-[#faf6f0] transition-opacity group-hover:opacity-80">
              Jara&apos;s Kochbuch
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md px-4 py-2 text-sm font-medium text-[#faf6f0] transition-colors hover:text-[#faf6f0]"
              style={{ minHeight: '44px', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Über mich
            </button>
            <Link
              href="/"
              className="rounded-md px-4 py-2 text-sm font-medium text-[#faf6f0] transition-colors hover:text-[#faf6f0]"
              style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
            >
              Rezepte
            </Link>
            <Link
              href="/admin"
              className="rounded-md px-4 py-2 text-sm font-medium text-[#6b1f2b] transition-colors hover:bg-[#4d1520]"
              style={{
                background: '#faf6f0',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Verwalten
            </Link>
          </nav>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-xl p-8"
            style={{ background: '#faf6f0', border: '1px solid #ddd0c0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-xl font-bold transition-opacity hover:opacity-60"
              style={{ color: '#6b1f2b', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
              aria-label="Schließen"
            >
              ×
            </button>

            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: '#6b1f2b' }}>
              Über mich
            </h2>

            <div className="flex flex-col gap-4 text-sm" style={{ color: '#3d2b1f' }}>
              <div>
                <span className="font-semibold block mb-0.5" style={{ color: '#6b1f2b' }}>Name</span>
                <span>{ABOUT_INFO.name}</span>
              </div>
              <div>
                <span className="font-semibold block mb-0.5" style={{ color: '#6b1f2b' }}>Über mich</span>
                <span>{ABOUT_INFO.about}</span>
              </div>
              <div>
                <span className="font-semibold block mb-0.5" style={{ color: '#6b1f2b' }}>Instagram</span>
                <a
                  href={ABOUT_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#6b1f2b', textDecoration: 'underline' }}
                  className="hover:opacity-70 transition-opacity"
                >
                  {ABOUT_INFO.instagram}
                </a>
              </div>
              <div>
                <span className="font-semibold block mb-0.5" style={{ color: '#6b1f2b' }}>Telefonnummer</span>
                <span>{ABOUT_INFO.phone}</span>
              </div>
              <div>
                <span className="font-semibold block mb-0.5" style={{ color: '#6b1f2b' }}>E-Mail-Adresse</span>
                <a
                  href={`mailto:${ABOUT_INFO.email}`}
                  style={{ color: '#6b1f2b', textDecoration: 'underline' }}
                  className="hover:opacity-70 transition-opacity"
                >
                  {ABOUT_INFO.email}
                </a>
              </div>
              <div>
                <span className="font-semibold block mb-0.5" style={{ color: '#6b1f2b' }}>Ort</span>
                <span>{ABOUT_INFO.ort}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
