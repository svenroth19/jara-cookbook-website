import { RecipeCard } from '@/components/recipe-card'
import { Recipe } from '@/lib/types'

interface RecipeGridProps {
  recipes: Recipe[]
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-6xl mb-4">📖</span>
        <h3 className="text-xl font-semibold mb-2">Keine Rezepte gefunden</h3>
        <p className="text-muted-foreground">
          Versuche eine andere Kategorie oder füge neue Rezepte hinzu.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
