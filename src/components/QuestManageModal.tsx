import React, { useState } from "react"
import { Save, Trash2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { toast } from "sonner"

interface Quest {
  id: string
  title: string
  date: string
  time: string
  location: string
  category: string
  description?: string
}

interface QuestManageModalProps {
  isOpen: boolean
  onClose: () => void
  quest: Quest
  onSave: (updatedQuest: Quest) => void
  onDelete: (questId: string) => void
}

const categories = ['Social', 'Adventure', 'Learning', 'Creative']

export function QuestManageModal({ isOpen, onClose, quest, onSave, onDelete }: QuestManageModalProps) {
  const [editedQuest, setEditedQuest] = useState<Quest>(quest)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Reset form when quest changes
  React.useEffect(() => {
    if (quest) {
      setEditedQuest(quest)
    }
  }, [quest])

  const handleSave = async () => {
    if (!editedQuest.title.trim()) {
      toast.error("Quest title is required!")
      return
    }
    
    if (!editedQuest.location.trim()) {
      toast.error("Location is required!")
      return
    }

    if (!editedQuest.date) {
      toast.error("Date is required!")
      return
    }

    if (!editedQuest.time) {
      toast.error("Time is required!")
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSave(editedQuest)
    toast.success("Quest updated successfully! 🎉")
    setIsLoading(false)
    onClose()
  }

  const handleDelete = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onDelete(quest.id)
    toast.success("Quest deleted successfully")
    setIsLoading(false)
    setShowDeleteDialog(false)
    onClose()
  }

  const getCategoryStyle = (category: string) => {
    // Normalize category to match the keys (capitalize first letter)
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    
    const categoryStyles = {
      'Social': {
        background: 'rgba(236, 72, 153, 0.1)',
        borderColor: 'var(--neon-pink)',
        color: 'var(--neon-pink)'
      },
      'Adventure': {
        background: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'var(--neon-green)',
        color: 'var(--neon-green)'
      },
      'Learning': {
        background: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'var(--neon-purple)',
        color: 'var(--neon-purple)'
      },
      'Creative': {
        background: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'var(--neon-orange)',
        color: 'var(--neon-orange)'
      },
      'Sports': {
        background: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgb(34, 197, 94)',
        color: 'rgb(34, 197, 94)'
      },
      'Food': {
        background: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgb(239, 68, 68)',
        color: 'rgb(239, 68, 68)'
      },
      'Music': {
        background: 'rgba(147, 51, 234, 0.1)',
        borderColor: 'rgb(147, 51, 234)',
        color: 'rgb(147, 51, 234)'
      },
      'Art': {
        background: 'rgba(251, 146, 60, 0.1)',
        borderColor: 'rgb(251, 146, 60)',
        color: 'rgb(251, 146, 60)'
      },
      'Tech': {
        background: 'rgba(0, 245, 255, 0.1)',
        borderColor: 'var(--neon-cyan)',
        color: 'var(--neon-cyan)'
      },
      'Travel': {
        background: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        color: 'rgb(59, 130, 246)'
      },
      'Fitness': {
        background: 'rgba(220, 38, 127, 0.1)',
        borderColor: 'rgb(220, 38, 127)',
        color: 'rgb(220, 38, 127)'
      }
    }
    
    return categoryStyles[normalizedCategory as keyof typeof categoryStyles] || {
      background: 'rgba(0, 245, 255, 0.1)',
      borderColor: 'var(--neon-cyan)',
      color: 'var(--neon-cyan)'
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-md w-[95vw] mx-auto gaming-panel border-0 p-0 overflow-hidden !z-[80]"
          style={{
            position: 'fixed',
            top: '5vh',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 80,
            maxHeight: 'calc(100vh - 160px)', // Account for header + bottom nav + padding
            height: 'auto',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-bold uppercase tracking-wider text-foreground">
              ⚙️ MANAGE QUEST
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Edit your quest details or delete the quest permanently.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6 pb-8">
            {/* Quest Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                Quest Title
              </label>
              <Input
                value={editedQuest.title}
                onChange={(e) => setEditedQuest(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quest title..."
                className="gaming-filter border-muted-foreground/20 focus:border-neon-cyan"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                Description (Optional)
              </label>
              <Textarea
                value={editedQuest.description || ''}
                onChange={(e) => setEditedQuest(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your quest..."
                rows={3}
                className="gaming-filter border-muted-foreground/20 focus:border-neon-cyan resize-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const isSelected = editedQuest.category === category
                  const categoryStyle = getCategoryStyle(category)
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setEditedQuest(prev => ({ ...prev, category }))}
                      className="p-4 rounded-lg border-2 font-bold text-sm uppercase tracking-wider transition-all touch-manipulation active:scale-95 flex items-center justify-center"
                      style={{
                        background: isSelected ? categoryStyle.background : 'transparent',
                        borderColor: isSelected ? categoryStyle.borderColor : 'var(--muted-foreground)',
                        color: isSelected ? categoryStyle.color : 'var(--muted-foreground)',
                        minHeight: '48px'
                      }}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                Location
              </label>
              <Input
                value={editedQuest.location}
                onChange={(e) => setEditedQuest(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Where will this happen?"
                className="gaming-filter border-muted-foreground/20 focus:border-neon-cyan"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Date
                </label>
                <Input
                  type="date"
                  value={editedQuest.date}
                  onChange={(e) => setEditedQuest(prev => ({ ...prev, date: e.target.value }))}
                  className="gaming-filter border-muted-foreground/20 focus:border-neon-cyan"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Time
                </label>
                <Input
                  type="time"
                  value={editedQuest.time}
                  onChange={(e) => setEditedQuest(prev => ({ ...prev, time: e.target.value }))}
                  className="gaming-filter border-muted-foreground/20 focus:border-neon-cyan"
                />
              </div>
            </div>

            {/* Mobile-Optimized Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border mt-6 -mx-6 px-6 py-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="neon-button flex-1 py-4 px-4 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
                style={{ minHeight: '52px' }}
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? 'SAVING...' : 'SAVE QUEST'}
              </button>
              
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
                className="gaming-filter py-4 px-4 font-bold uppercase tracking-wider active:border-neon-red active:text-neon-red transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
                style={{ minHeight: '52px' }}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                DELETE QUEST
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent 
          className="gaming-panel border-0 max-w-sm w-[90vw] mx-auto !z-[90]"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 90,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-center gap-2 text-neon-red">
              <AlertTriangle className="w-5 h-5" />
              Delete Quest?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. Your quest "{quest.title}" will be permanently deleted and all applications will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 flex-col sm:flex-row">
            <AlertDialogCancel className="gaming-filter py-3 touch-manipulation" style={{ minHeight: '48px' }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-neon-red hover:bg-neon-red/90 text-white font-bold uppercase tracking-wider disabled:opacity-50 py-3 touch-manipulation"
              style={{ minHeight: '48px' }}
            >
              {isLoading ? 'Deleting...' : 'Delete Quest'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}