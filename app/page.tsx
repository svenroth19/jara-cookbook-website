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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
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
    <>
      {/* Hero */}
      <section
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center"
        style={{ background: '#faf6f0' }}
      >
        <h1
          className="hero-title font-display font-bold leading-[1.1] tracking-tight text-[#6b1f2b]"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          Jara&apos;s Kochbuch
        </h1>

        <p
          className="hero-tagline mt-5 font-display italic text-[#8a7060]"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
        >
          Köstliche Rezepte für jeden Anlass
        </p>

        {/* Decorative ornamental rule */}
        <div className="hero-rule mt-8 flex items-center justify-center gap-3">
          <div className="h-px w-20" style={{ background: '#c9a96e' }} />
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: '#c9a96e' }}
          />
          <div className="h-px w-6" style={{ background: '#c9a96e' }} />
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: '#c9a96e' }}
          />
          <div className="h-px w-20" style={{ background: '#c9a96e' }} />
        </div>
      </section>

      {/* Recipe section */}
      <div className="container mx-auto px-4 pb-16 pt-10">
        <div className="mb-8">
          <Suspense fallback={<div className="h-11" />}>
            <CategoryFilter />
          </Suspense>
        </div>

        <Suspense fallback={<RecipeListSkeleton />}>
          <RecipeList category={category} />
        </Suspense>
      </div>
    </>
  )
}
