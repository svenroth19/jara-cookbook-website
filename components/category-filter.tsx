'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { categoryLabels, categoryOrder, type Recipe } from '@/lib/types'

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleCategoryClick = (category: Recipe['category'] | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === null) {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={currentCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleCategoryClick(null)}
      >
        Alle
      </Button>
      {categoryOrder.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick(category)}
        >
          {categoryLabels[category]}
        </Button>
      ))}
    </div>
  )
}
