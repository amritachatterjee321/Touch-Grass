import { useState } from "react"
import { createPortal } from "react-dom"
import { Send, X } from "lucide-react"
import { toast } from "sonner"

interface JoinQuestModalProps {
  isOpen: boolean
  onClose: () => void
  quest: {
    id: string
    title: string
    organizer: string
    category: string
    location: string
    date: string
    time: string
  }
  userProfile: {
    name: string
    bio: string
    interests: string[]
    age?: number
    location?: string
  }
  onJoinSuccess?: (questId: string) => void
}

export function JoinQuestModal({ isOpen, onClose, quest, userProfile, onJoinSuccess }: JoinQuestModalProps) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      console.log('Joining quest:', {
        questId: quest.id,
        message: message.trim(),
        userProfile
      })
      
      // TODO: Send join request to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Close modal and show success
      onClose()
      setMessage('')
      
      // Call the join success callback to move quest from saved to joined
      if (onJoinSuccess) {
        onJoinSuccess(quest.id)
      }
      
      // Show success notification
      toast.success("Quest join request sent!", {
        description: `Your message has been sent to ${quest.organizer}. They'll get back to you soon! 🚀`
      })
      
    } catch (error) {
      console.error('Failed to send join request:', error)
      toast.error("Failed to send join request", {
        description: "Please try again later."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage('')
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div
        className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-describedby="join-quest-description"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple">
                <Send className="w-5 h-5 text-white" />
              </div>
              <span className="gradient-text font-bold">JOIN QUEST REQUEST</span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p id="join-quest-description" className="text-center text-muted-foreground text-sm">
            Send your profile and a personal message to join this quest
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Personal Message */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-bold text-foreground">
                Personal Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hey! I'd love to join your quest! I'm really into coffee exploration and would love to meet fellow enthusiasts. Looking forward to discovering some hidden gems together! ☕✨"
                className="w-full p-4 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all min-h-[120px] resize-none"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                💡 Tell them why you're excited to join and what you'll bring to the adventure!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-lg border border-border bg-card text-foreground hover:bg-accent/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className={`flex-1 neon-button py-3 font-bold tracking-wider transition-all ${
                  !message.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting ? 'SENDING...' : 'SEND'}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}