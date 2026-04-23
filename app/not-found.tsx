import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-8xl mb-6">🍽️</span>
      <h1 className="text-3xl font-bold mb-3">Seite nicht gefunden</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Die gesuchte Seite existiert leider nicht. Vielleicht findest du in unserer Rezeptsammlung etwas Leckeres!
      </p>
      <Button asChild>
        <Link href="/">Zurück zur Startseite</Link>
      </Button>
    </div>
  )
}
