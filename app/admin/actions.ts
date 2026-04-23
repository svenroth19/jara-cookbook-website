'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { put, del } from '@vercel/blob'

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
  const imageFile = formData.get('image') as File | null
  
  if (!title || !description || !category) {
    return { error: 'Bitte fülle alle Pflichtfelder aus.' }
  }
  
  let image_url: string | null = null
  
  // Handle image upload
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(`recipes/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
      })
      image_url = blob.url
    } catch (error) {
      console.error('Error uploading image:', error)
      return { error: 'Fehler beim Hochladen des Bildes.' }
    }
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
  const imageFile = formData.get('image') as File | null
  const existingImageUrl = formData.get('existingImageUrl') as string | null
  
  if (!title || !description || !category) {
    return { error: 'Bitte fülle alle Pflichtfelder aus.' }
  }
  
  let image_url: string | null = existingImageUrl
  
  // Handle new image upload
  if (imageFile && imageFile.size > 0) {
    try {
      // Delete old image if it's a blob URL
      if (existingImageUrl?.includes('blob.vercel-storage.com')) {
        await del(existingImageUrl)
      }
      
      const blob = await put(`recipes/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
      })
      image_url = blob.url
    } catch (error) {
      console.error('Error uploading image:', error)
      return { error: 'Fehler beim Hochladen des Bildes.' }
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
  
  // Delete the image from blob storage if it exists
  if (imageUrl?.includes('blob.vercel-storage.com')) {
    try {
      await del(imageUrl)
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
