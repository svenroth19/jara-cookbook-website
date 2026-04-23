'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { del } from '@vercel/blob'
import { buildImageUrl, getImageSrc } from '@/lib/image-utils'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createRecipe(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const uploadedImageUrl = formData.get('imageUrl') as string | null
  const focalX = parseFloat((formData.get('focalX') as string) || '0.5')
  const focalY = parseFloat((formData.get('focalY') as string) || '0.5')

  if (!title || !description || !category) {
    return { error: 'Bitte fülle alle Pflichtfelder aus.' }
  }

  let image_url: string | null = null

  if (uploadedImageUrl) {
    image_url = buildImageUrl(uploadedImageUrl, focalX, focalY)
  }

  const slug = generateSlug(title)

  const { error } = await supabase.from('recipes').insert({
    title,
    description,
    category,
    image_url,
    slug,
  })

  if (error) {
    console.error('Error creating recipe:', error)
    if (error.code === '23505') {
      return { error: 'Ein Rezept mit diesem Titel existiert bereits.' }
    }
    return { error: 'Fehler beim Erstellen des Rezepts.' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function updateRecipe(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const uploadedImageUrl = formData.get('imageUrl') as string | null
  const existingImageUrl = formData.get('existingImageUrl') as string | null
  const focalX = parseFloat((formData.get('focalX') as string) || '0.5')
  const focalY = parseFloat((formData.get('focalY') as string) || '0.5')

  if (!title || !description || !category) {
    return { error: 'Bitte fülle alle Pflichtfelder aus.' }
  }

  let image_url: string | null = null

  if (uploadedImageUrl) {
    // Delete old image from blob storage before replacing
    const oldBlobUrl = getImageSrc(existingImageUrl)
    if (oldBlobUrl?.includes('blob.vercel-storage.com')) {
      try {
        await del(oldBlobUrl)
      } catch (error) {
        console.error('Error deleting old image:', error)
      }
    }
    image_url = buildImageUrl(uploadedImageUrl, focalX, focalY)
  } else if (existingImageUrl) {
    // No new file — keep existing image but update focal point
    const baseUrl = getImageSrc(existingImageUrl)
    if (baseUrl) {
      image_url = buildImageUrl(baseUrl, focalX, focalY)
    }
  }

  const slug = generateSlug(title)

  const { error } = await supabase
    .from('recipes')
    .update({
      title,
      description,
      category,
      image_url,
      slug,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating recipe:', error)
    if (error.code === '23505') {
      return { error: 'Ein Rezept mit diesem Titel existiert bereits.' }
    }
    return { error: 'Fehler beim Aktualisieren des Rezepts.' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/rezept/${slug}`)
  return { success: true }
}

export async function deleteRecipe(id: string, imageUrl: string | null) {
  const supabase = await createClient()

  const cleanUrl = getImageSrc(imageUrl)
  if (cleanUrl?.includes('blob.vercel-storage.com')) {
    try {
      await del(cleanUrl)
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const { error } = await supabase.from('recipes').delete().eq('id', id)

  if (error) {
    console.error('Error deleting recipe:', error)
    return { error: 'Fehler beim Löschen des Rezepts.' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}
