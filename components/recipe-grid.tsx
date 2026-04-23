import { RecipeCard } from '@/components/recipe-card'
import { Recipe } from '@/lib/types'

interface RecipeGridProps {
  recipes: Recipe[]
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: '#f2ebe1' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 opacity-50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b1f2b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold mb-2 text-[#1c1410]">
          Keine Rezepte gefunden
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Versuche eine andere Kategorie oder füge neue Rezepte hinzu.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
