export interface Recipe {
  id: string
  title: string
  description: string
  image_url: string | null
  slug: string
  category: 'starter' | 'main' | 'dessert' | 'breakfast'
  created_at: string
}

export const categoryLabels: Record<Recipe['category'], string> = {
  starter: 'Vorspeisen',
  main: 'Hauptgerichte',
  dessert: 'Desserts',
  breakfast: 'Frühstück',
}

export const categoryOrder: Recipe['category'][] = ['breakfast', 'starter', 'main', 'dessert']
