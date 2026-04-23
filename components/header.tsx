import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="font-bold text-xl">Jara&apos;s Kochbuch</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Rezepte</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">Verwalten</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
