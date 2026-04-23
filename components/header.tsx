import Link from 'next/link'

export function Header() {
  return (
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
  )
}
