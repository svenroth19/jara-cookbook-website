import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AdminContent } from './admin-content'
import { Skeleton } from '@/components/ui/skeleton'
import type { Recipe } from '@/lib/types'

async function RecipeData() {
  const supabase = await createClient()
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching recipes:', error)
    return (
      <div className="text-center py-8 text-destructive">
        Fehler beim Laden der Rezepte. Bitte versuche es erneut.
      </div>
    )
  }
  
  return <AdminContent recipes={(recipes as Recipe[]) || []} />
}

function AdminSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<AdminSkeleton />}>
        <RecipeData />
      </Suspense>
    </div>
  )
}
