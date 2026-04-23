import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Recipe, categoryLabels } from '@/lib/types'

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/rezept/${recipe.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          <Badge 
            variant="secondary" 
            className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm"
          >
            {categoryLabels[recipe.category]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-balance leading-tight group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
        </CardContent>
      </Card>
    </Link>
  )
}
