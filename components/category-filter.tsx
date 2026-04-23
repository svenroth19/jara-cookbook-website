'use client'

import { useRouter, useSearchParams } from 'next/navigation'
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

  const baseClass =
    'rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1f2b]'
  const activeClass = 'text-[#faf6f0]'
  const inactiveClass =
    'text-[#8a7060] hover:bg-[#e8ddd0] hover:text-[#1c1410]'

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`${baseClass} ${currentCategory === null ? activeClass : inactiveClass}`}
        style={{
          background: currentCategory === null ? '#6b1f2b' : '#f2ebe1',
          minHeight: '44px',
        }}
        onClick={() => handleCategoryClick(null)}
      >
        Alle
      </button>

      {categoryOrder.map((category) => (
        <button
          key={category}
          className={`${baseClass} ${currentCategory === category ? activeClass : inactiveClass}`}
          style={{
            background: currentCategory === category ? '#6b1f2b' : '#f2ebe1',
            minHeight: '44px',
          }}
          onClick={() => handleCategoryClick(category)}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  )
}
