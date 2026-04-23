import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { RecipeGrid } from '@/components/recipe-grid'
import { CategoryFilter } from '@/components/category-filter'
import { Skeleton } from '@/components/ui/skeleton'
import type { Recipe } from '@/lib/types'

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

async function RecipeList({ category }: { category?: string }) {
  const supabase = await createClient()
  
  let query = supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data: recipes, error } = await query
  
  if (error) {
    console.error('Error fetching recipes:', error)
    return (
      <div className="text-center py-8 text-destructive">
        Fehler beim Laden der Rezepte. Bitte versuche es erneut.
      </div>
    )
  }
  
  return <RecipeGrid recipes={(recipes as Recipe[]) || []} />
}

function RecipeListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  )
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const category = params.category
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-balance">Willkommen in Jara&apos;s Kochbuch</h1>
        <p className="text-muted-foreground mb-6">
          Entdecke köstliche Rezepte für jeden Anlass
        </p>
        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter />
        </Suspense>
      </div>
      
      <Suspense fallback={<RecipeListSkeleton />}>
        <RecipeList category={category} />
      </Suspense>
    </div>
  )
}
