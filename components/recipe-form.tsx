'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { categoryLabels, categoryOrder, type Recipe } from '@/lib/types'
import { createRecipe, updateRecipe } from '@/app/admin/actions'
import { getImageSrc, parseFocalPoint } from '@/lib/image-utils'
import { Upload, X, Crosshair } from 'lucide-react'

function isHeicFile(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.(heic|heif)$/i.test(file.name)
  )
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  const blob = Array.isArray(result) ? result[0] : result
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
    type: 'image/jpeg',
  })
}

function FocalPointPicker({
  src,
  focalX,
  focalY,
  onChange,
}: {
  src: string
  focalX: number
  focalY: number
  onChange: (x: number, y: number) => void
}) {
  const handlePointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.type === 'pointermove' && e.buttons === 0) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      onChange(x, y)
    },
    [onChange],
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Crosshair className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Bildmittelpunkt wählen – tippen oder ziehen
        </span>
      </div>
      <div
        className="relative aspect-video w-full max-w-sm cursor-crosshair overflow-hidden rounded-lg border select-none touch-none"
        onPointerDown={handlePointer}
        onPointerMove={handlePointer}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Crosshair lines */}
        <div
          className="absolute inset-y-0 w-px bg-white/70 pointer-events-none"
          style={{ left: `${focalX * 100}%` }}
        />
        <div
          className="absolute inset-x-0 h-px bg-white/70 pointer-events-none"
          style={{ top: `${focalY * 100}%` }}
        />

        {/* Focal point dot */}
        <div
          className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-[left,top] duration-75"
          style={{
            left: `${focalX * 100}%`,
            top: `${focalY * 100}%`,
            border: '2.5px solid white',
            boxShadow: '0 0 0 1.5px rgba(0,0,0,0.45), 0 2px 10px rgba(0,0,0,0.35)',
          }}
        />
      </div>

      {/* Crop previews */}
      <div className="flex gap-3">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">4:3 Karte</span>
          <div className="relative overflow-hidden rounded" style={{ width: 80, height: 60 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full pointer-events-none"
              draggable={false}
              style={{
                objectFit: 'cover',
                objectPosition: `${focalX * 100}% ${focalY * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Breit (Hero)</span>
          <div className="relative overflow-hidden rounded" style={{ width: 108, height: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full pointer-events-none"
              draggable={false}
              style={{
                objectFit: 'cover',
                objectPosition: `${focalX * 100}% ${focalY * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">1:1 Thumb</span>
          <div className="relative overflow-hidden rounded" style={{ width: 40, height: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full pointer-events-none"
              draggable={false}
              style={{
                objectFit: 'cover',
                objectPosition: `${focalX * 100}% ${focalY * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface RecipeFormProps {
  recipe?: Recipe
  onSuccess?: () => void
  onCancel?: () => void
}

export function RecipeForm({ recipe, onSuccess, onCancel }: RecipeFormProps) {
  const initialFocal = parseFocalPoint(recipe?.image_url)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // previewSrc is used for <img> display only (blob URL for new files, clean URL for existing)
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    recipe?.image_url ? getImageSrc(recipe.image_url) : null,
  )
  // processedFile holds the file to upload (may have been converted from HEIC)
  const [processedFile, setProcessedFile] = useState<File | null>(null)
  // imageCleared tracks if user explicitly removed the image when editing
  const [imageCleared, setImageCleared] = useState(false)
  const [focalX, setFocalX] = useState(initialFocal.x)
  const [focalY, setFocalY] = useState(initialFocal.y)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    let finalFile = file

    if (isHeicFile(file)) {
      setIsConverting(true)
      try {
        finalFile = await convertHeicToJpeg(file)
      } catch (err) {
        console.error('HEIC conversion failed:', err)
        setError('HEIC-Datei konnte nicht konvertiert werden. Bitte probiere ein anderes Format.')
        setIsConverting(false)
        return
      }
      setIsConverting(false)
    }

    setProcessedFile(finalFile)
    setPreviewSrc(URL.createObjectURL(finalFile))
    setImageCleared(false)
    setFocalX(0.5)
    setFocalY(0.5)
  }

  const clearImage = () => {
    setPreviewSrc(null)
    setProcessedFile(null)
    setImageCleared(true)
    setFocalX(0.5)
    setFocalY(0.5)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Send existing URL only if not cleared (allows focal-point-only update)
    const existingUrl = imageCleared ? '' : (recipe?.image_url || '')
    formData.set('existingImageUrl', existingUrl)
    formData.set('focalX', focalX.toString())
    formData.set('focalY', focalY.toString())

    // Override the file input value with the (possibly HEIC-converted) file
    if (processedFile) {
      formData.set('image', processedFile)
    }

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

  const handleFocalChange = useCallback((x: number, y: number) => {
    setFocalX(x)
    setFocalY(y)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
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
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*,.heic,.heif"
              className="hidden"
              onChange={handleImageChange}
            />

            {isConverting && (
              <div className="flex aspect-video w-full max-w-sm items-center justify-center gap-2 rounded-lg border bg-muted/40">
                <Spinner />
                <span className="text-sm text-muted-foreground">HEIC wird konvertiert…</span>
              </div>
            )}

            {!isConverting && previewSrc ? (
              <div className="space-y-3">
                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Bild wechseln
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    Entfernen
                  </Button>
                </div>

                {/* Focal point picker */}
                <FocalPointPicker
                  src={previewSrc}
                  focalX={focalX}
                  focalY={focalY}
                  onChange={handleFocalChange}
                />
              </div>
            ) : !isConverting ? (
              <div
                className="flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Bild hochladen</span>
                <span className="mt-1 text-xs text-muted-foreground/70">JPG, PNG, WebP, HEIC</span>
              </div>
            ) : null}
          </div>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || isConverting}>
          {isSubmitting && <Spinner className="mr-2" />}
          {recipe ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  )
}
