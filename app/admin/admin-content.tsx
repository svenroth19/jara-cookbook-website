'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RecipeForm } from '@/components/recipe-form'
import { deleteRecipe } from './actions'
import { categoryLabels, type Recipe } from '@/lib/types'
import { getImageSrc, getObjectPosition } from '@/lib/image-utils'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface AdminContentProps {
  recipes: Recipe[]
}

export function AdminContent({ recipes }: AdminContentProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingRecipe) return

    setIsDeleting(true)
    try {
      const result = await deleteRecipe(deletingRecipe.id, deletingRecipe.image_url)
      if (result.error) {
        console.error(result.error)
      }
    } finally {
      setIsDeleting(false)
      setDeletingRecipe(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#6b1f2b]">
            Rezepte verwalten
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {recipes.length} {recipes.length === 1 ? 'Rezept' : 'Rezepte'}
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neues Rezept
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Neues Rezept erstellen
              </DialogTitle>
            </DialogHeader>
            <RecipeForm
              onSuccess={() => setIsCreateOpen(false)}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Recipe list */}
      {recipes.length === 0 ? (
        <div
          className="rounded-xl px-8 py-20 text-center"
          style={{ background: '#f2ebe1', border: '1px solid #ddd0c0' }}
        >
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: '#e8ddd0' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 opacity-40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b1f2b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-semibold mb-2 text-[#1c1410]">
            Noch keine Rezepte
          </h3>
          <p className="text-muted-foreground mb-6">
            Erstelle dein erstes Rezept, um loszulegen.
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Rezept erstellen
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-[#f2ebe1]"
              style={{ border: '1px solid #ddd0c0', background: '#faf6f0' }}
            >
              {/* Thumbnail */}
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                {recipe.image_url ? (
                  <Image
                    src={getImageSrc(recipe.image_url)!}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                    style={{ objectPosition: getObjectPosition(recipe.image_url) }}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: '#e8ddd0' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 opacity-30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b1f2b"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                      <path d="M7 2v20" />
                      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title + category */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-[#1c1410]">{recipe.title}</h3>
                <div className="mt-0.5 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabels[recipe.category]}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-2">
                <Dialog
                  open={editingRecipe?.id === recipe.id}
                  onOpenChange={(open) => !open && setEditingRecipe(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingRecipe(recipe)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display text-xl">
                        Rezept bearbeiten
                      </DialogTitle>
                    </DialogHeader>
                    {editingRecipe && (
                      <RecipeForm
                        recipe={editingRecipe}
                        onSuccess={() => setEditingRecipe(null)}
                        onCancel={() => setEditingRecipe(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeletingRecipe(recipe)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={deletingRecipe !== null}
        onOpenChange={(open) => !open && setDeletingRecipe(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Rezept löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du &quot;{deletingRecipe?.title}&quot; wirklich löschen? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Löschen...' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
