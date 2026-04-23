'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { categoryLabels, categoryOrder, type Recipe } from '@/lib/types'
import { createRecipe, updateRecipe } from '@/app/admin/actions'
import { Upload, X } from 'lucide-react'

interface RecipeFormProps {
  recipe?: Recipe
  onSuccess?: () => void
  onCancel?: () => void
}

export function RecipeForm({ recipe, onSuccess, onCancel }: RecipeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(recipe?.image_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }
  
  const clearImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.set('existingImageUrl', recipe?.image_url || '')
    
    try {
      const result = recipe
        ? await updateRecipe(recipe.id, formData)
        : await createRecipe(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Titel *</FieldLabel>
          <Input
            id="title"
            name="title"
            defaultValue={recipe?.title}
            placeholder="z.B. Tomatensuppe"
            required
          />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="category">Kategorie *</FieldLabel>
          <Select name="category" defaultValue={recipe?.category || 'main'}>
            <SelectTrigger>
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              {categoryOrder.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        
        <Field>
          <FieldLabel htmlFor="description">Rezept (Zutaten & Zubereitung) *</FieldLabel>
          <Textarea
            id="description"
            name="description"
            defaultValue={recipe?.description}
            placeholder={`Zutaten:\n- 500g Tomaten\n- 1 Zwiebel\n...\n\nZubereitung:\nTomaten waschen und vierteln...`}
            rows={12}
            required
          />
        </Field>
        
        <Field>
          <FieldLabel>Bild</FieldLabel>
          <div className="space-y-3">
            {previewUrl ? (
              <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                <Image
                  src={previewUrl}
                  alt="Vorschau"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Bild hochladen</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </Field>
      </FieldGroup>
      
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="mr-2" />}
          {recipe ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  )
}
