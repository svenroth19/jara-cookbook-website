import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { categoryLabels, type Recipe } from '@/lib/types'
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
  
  // Split by common section headers
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
      // If there's content after "Zutaten:", include it
      const afterColon = line.split(':')[1]?.trim()
      if (afterColon) currentContent.push(afterColon)
    } else if (lowerLine.startsWith('zubereitung:') || lowerLine === 'zubereitung') {
      if (currentContent.length > 0) {
        sections.push({ type: currentSection, content: currentContent.join('\n') })
        currentContent = []
      }
      currentSection = 'instructions'
      // If there's content after "Zubereitung:", include it
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
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zu allen Rezepten
        </Link>
      </Button>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          {typedRecipe.image_url ? (
            <Image
              src={typedRecipe.image_url}
              alt={typedRecipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted rounded-xl">
              <span className="text-8xl">🍽️</span>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div>
          <div className="mb-4">
            <Badge variant="secondary" className="mb-3">
              {categoryLabels[typedRecipe.category]}
            </Badge>
            <h1 className="text-3xl font-bold mb-4 text-balance">{typedRecipe.title}</h1>
          </div>
          
          {sections.map((section, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="p-6">
                {section.type === 'ingredients' && (
                  <>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="text-xl">🥗</span> Zutaten
                    </h2>
                    <ul className="space-y-1">
                      {section.content.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{line.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {section.type === 'instructions' && (
                  <>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="text-xl">👨‍🍳</span> Zubereitung
                    </h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {section.content.split('\n').filter(line => line.trim()).map((paragraph, i) => (
                        <p key={i} className="mb-3 last:mb-0">{paragraph.trim()}</p>
                      ))}
                    </div>
                  </>
                )}
                
                {section.type === 'text' && section.content.trim() && (
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {section.content.split('\n').filter(line => line.trim()).map((paragraph, i) => (
                      <p key={i} className="mb-2 last:mb-0">{paragraph.trim()}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
