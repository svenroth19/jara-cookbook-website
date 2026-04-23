'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Rezepte verwalten</h1>
          <p className="text-muted-foreground">{recipes.length} Rezepte</p>
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
              <DialogTitle>Neues Rezept erstellen</DialogTitle>
            </DialogHeader>
            <RecipeForm
              onSuccess={() => setIsCreateOpen(false)}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {recipes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-6xl mb-4">📖</span>
            <h3 className="text-xl font-semibold mb-2">Noch keine Rezepte</h3>
            <p className="text-muted-foreground mb-4">
              Erstelle dein erstes Rezept, um loszulegen.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Rezept erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    {recipe.image_url ? (
                      <Image
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{recipe.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[recipe.category]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
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
                          <DialogTitle>Rezept bearbeiten</DialogTitle>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog
        open={deletingRecipe !== null}
        onOpenChange={(open) => !open && setDeletingRecipe(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rezept löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du &quot;{deletingRecipe?.title}&quot; wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
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
