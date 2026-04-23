import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { categoryLabels, type Recipe } from '@/lib/types'
import { getImageSrc, getObjectPosition } from '@/lib/image-utils'
import { ArrowLeft } from 'lucide-react'

interface RecipePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: recipe } = await supabase
    .from('recipes')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!recipe) {
    return { title: 'Rezept nicht gefunden' }
  }

  return {
    title: `${recipe.title} | Jara's Kochbuch`,
    description: recipe.description.slice(0, 160),
  }
}

function parseRecipeContent(description: string) {
  const sections: { type: 'ingredients' | 'instructions' | 'text'; content: string }[] = []

  const lines = description.split('\n')
  let currentSection: 'ingredients' | 'instructions' | 'text' = 'text'
  let currentContent: string[] = []

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim()

    if (lowerLine.startsWith('zutaten:') || lowerLine === 'zutaten') {
      if (currentContent.length > 0) {
        sections.push({ type: currentSection, content: currentContent.join('\n') })
        currentContent = []
      }
      currentSection = 'ingredients'
      const afterColon = line.split(':')[1]?.trim()
      if (afterColon) currentContent.push(afterColon)
    } else if (lowerLine.startsWith('zubereitung:') || lowerLine === 'zubereitung') {
      if (currentContent.length > 0) {
        sections.push({ type: currentSection, content: currentContent.join('\n') })
        currentContent = []
      }
      currentSection = 'instructions'
      const afterColon = line.split(':')[1]?.trim()
      if (afterColon) currentContent.push(afterColon)
    } else if (lowerLine.startsWith('topping:') || lowerLine.startsWith('alternative:')) {
      currentContent.push(line)
    } else {
      currentContent.push(line)
    }
  }

  if (currentContent.length > 0) {
    sections.push({ type: currentSection, content: currentContent.join('\n') })
  }

  return sections
}

function SectionDivider() {
  return (
    <div className="my-10 flex items-center gap-4">
      <div className="h-px flex-1" style={{ background: '#ddd0c0' }} />
      <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#c9a96e' }} />
      <div className="h-px flex-1" style={{ background: '#ddd0c0' }} />
    </div>
  )
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !recipe) {
    notFound()
  }

  const typedRecipe = recipe as Recipe
  const sections = parseRecipeContent(typedRecipe.description)

  return (
    <div>
      {/* Back link */}
      <div className="container mx-auto max-w-[760px] px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#8a7060] transition-colors hover:text-[#6b1f2b]"
        >
          <ArrowLeft className="h-4 w-4" />
          Alle Rezepte
        </Link>
      </div>

      {/* Hero image — full width */}
      <div
        className="relative mt-6 w-full overflow-hidden"
        style={{ height: '50vh', minHeight: '300px' }}
      >
        {typedRecipe.image_url ? (
          <Image
            src={getImageSrc(typedRecipe.image_url)!}
            alt={typedRecipe.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            style={{ objectPosition: getObjectPosition(typedRecipe.image_url) }}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: '#e8ddd0' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 opacity-20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b1f2b"
              strokeWidth="0.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </div>
        )}
        {/* Burgundy gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(107,31,43,0.28) 0%, transparent 55%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[760px] px-4 py-12">
        {/* Category label */}
        <div className="mb-5 text-center">
          <span
            className="inline-block rounded px-3 py-1 text-xs font-medium uppercase"
            style={{
              background: '#f2ebe1',
              color: '#8a7060',
              letterSpacing: '0.1em',
            }}
          >
            {categoryLabels[typedRecipe.category]}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display text-center font-bold leading-tight text-[#6b1f2b]"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          {typedRecipe.title}
        </h1>

        {/* Ornamental divider */}
        <div className="mt-8 mb-12 flex items-center justify-center gap-3">
          <div className="h-px w-24" style={{ background: '#ddd0c0' }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#c9a96e' }} />
          <div className="h-px w-6" style={{ background: '#c9a96e' }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#c9a96e' }} />
          <div className="h-px w-24" style={{ background: '#ddd0c0' }} />
        </div>

        {/* Recipe sections */}
        {sections.map((section, index) => (
          <div key={index}>
            {section.type === 'ingredients' && (
              <div>
                <h2
                  className="font-display mb-6 text-2xl font-semibold"
                  style={{ color: '#1c1410' }}
                >
                  Zutaten
                </h2>
                <ul className="space-y-3">
                  {section.content
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span
                          className="mt-[0.55em] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ background: '#c9a96e' }}
                        />
                        <span style={{ color: '#8a7060', fontSize: '18px', lineHeight: '1.8' }}>
                          {line.replace(/^[-•*]\s*/, '').trim()}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {section.type === 'instructions' && (
              <div>
                <h2
                  className="font-display mb-6 text-2xl font-semibold"
                  style={{ color: '#1c1410' }}
                >
                  Zubereitung
                </h2>
                <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#8a7060' }}>
                  {section.content
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((paragraph, i) => (
                      <p key={i} className="mb-5 last:mb-0">
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {section.type === 'text' && section.content.trim() && (
              <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#8a7060' }}>
                {section.content
                  .split('\n')
                  .filter((line) => line.trim())
                  .map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
            )}

            {index < sections.length - 1 && <SectionDivider />}
          </div>
        ))}
      </div>
    </div>
  )
}
