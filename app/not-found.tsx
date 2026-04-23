import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-4 font-display text-6xl font-bold text-[#ddd0c0]">404</p>
      <h1 className="font-display mb-3 text-3xl font-bold text-[#1c1410]">
        Seite nicht gefunden
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Die gesuchte Seite existiert leider nicht. Vielleicht findest du in
        unserer Rezeptsammlung etwas Leckeres!
      </p>
      <Button asChild>
        <Link href="/">Zurück zur Startseite</Link>
      </Button>
    </div>
  )
}
