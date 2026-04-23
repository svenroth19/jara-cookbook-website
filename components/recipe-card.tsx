import Image from 'next/image'
import Link from 'next/link'
import { Recipe, categoryLabels } from '@/lib/types'
import { getImageSrc, getObjectPosition } from '@/lib/image-utils'

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/rezept/${recipe.slug}`} className="group block">
      <div
        className="overflow-hidden rounded-xl transition-all duration-200 ease-out group-hover:-translate-y-1 shadow-[0_2px_16px_rgba(107,31,43,0.07)] group-hover:shadow-[0_8px_32px_rgba(107,31,43,0.14)]"
        style={{ background: '#f2ebe1' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {recipe.image_url ? (
            <Image
              src={getImageSrc(recipe.image_url)!}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectPosition: getObjectPosition(recipe.image_url) }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: '#e8ddd0' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 opacity-25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b1f2b"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
              </svg>
            </div>
          )}

          {/* Category badge */}
          <div
            className="absolute left-3 top-3 rounded px-2.5 py-1 text-xs font-medium uppercase tracking-wide"
            style={{
              background: 'rgba(250,246,240,0.92)',
              color: '#6b1f2b',
              letterSpacing: '0.06em',
            }}
          >
            {categoryLabels[recipe.category]}
          </div>
        </div>

        {/* Gold accent separator */}
        <div
          className="h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)',
          }}
        />

        {/* Card body */}
        <div className="p-5">
          <h3
            className="font-display text-lg font-semibold leading-snug text-balance transition-colors duration-200 group-hover:text-[#6b1f2b]"
            style={{ color: '#1c1410' }}
          >
            {recipe.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
