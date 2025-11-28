import { ImageWithFallback } from './figma/ImageWithFallback'
import { MapPin, Clock, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { JoinQuestModal } from "./JoinQuestModal"
import { GoogleLoginModal } from "./GoogleLoginModal"
import { saveQuest, unsaveQuest } from "../firebase/quests"
import { toast } from "sonner"

interface QuestCardProps {
  quest: {
    id: string
    title: string
    description: string
    category: string
    location: string
    date: string
    time: string
    cost: string
    difficulty: 'Beginner' | 'Intermediate' | 'Expert'
    organizer: string
    isEpic?: boolean
    image?: string
  }
  isProfileCompleted?: boolean
  onStartProfileCreation?: () => void
  isLoggedIn?: boolean
  onGoogleSignIn?: () => void
  userUid?: string
  savedQuests?: string[]
  onQuestSaveToggle?: () => void
}

export function QuestCard({ quest, isProfileCompleted = true, onStartProfileCreation, isLoggedIn = false, onGoogleSignIn, userUid, savedQuests = [], onQuestSaveToggle }: QuestCardProps) {
  const [isSaved, setIsSaved] = useState(savedQuests.includes(quest.id))
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginActionType, setLoginActionType] = useState<'join' | 'save'>('join')

  // Update isSaved when savedQuests prop changes
  useEffect(() => {
    setIsSaved(savedQuests.includes(quest.id))
  }, [savedQuests, quest.id])

  // Mock user profile - in real app this would come from auth/user context
  const mockUserProfile = {
    name: "Alex Chen",
    bio: "Coffee enthusiast and weekend adventurer. Love exploring hidden spots in the city!",
    interests: ["Coffee", "Photography", "Hiking", "Board Games", "Travel"],
    age: 28,
    location: "Bangalore"
  }

  const handleSaveQuest = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent any parent click handlers
    
    if (!isLoggedIn) {
      setLoginActionType('save')
      setIsLoginModalOpen(true)
      return
    }

    if (!userUid) {
      toast.error('Please log in to save quests')
      return
    }
    
    try {
      if (isSaved) {
        await unsaveQuest(userUid, quest.id)
        toast.success('Quest removed from saved list')
      } else {
        await saveQuest(userUid, quest.id)
        toast.success('Quest saved! 💾')
      }
      setIsSaved(!isSaved)
      // Refresh the user profile to update savedQuests
      if (onQuestSaveToggle) {
        onQuestSaveToggle()
      }
    } catch (error: any) {
      console.error('Error saving/unsaving quest:', error)
      toast.error(error.message || 'Failed to save quest')
    }
  }

  const handleJoinQuest = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent any parent click handlers
    
    if (!isLoggedIn) {
      setLoginActionType('join')
      setIsLoginModalOpen(true)
      return
    }
    
    if (!isProfileCompleted && onStartProfileCreation) {
      onStartProfileCreation()
    } else {
      setIsJoinModalOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
    // Use Firebase login handler if provided
    if (onGoogleSignIn) {
      onGoogleSignIn()
    } else if (onStartProfileCreation) {
      // Fallback to profile creation flow
      onStartProfileCreation()
    }
  }

  // Category color mapping - matches QuestBoard's comprehensive palette
  const getCategoryStyle = (category: string) => {
    // Normalize category to match the keys (capitalize first letter)
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    
    const categoryStyles = {
      'Social': {
        background: 'rgba(236, 72, 153, 0.85)', // neon-pink
        borderColor: 'var(--neon-pink)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(236, 72, 153, 0.8)'
      },
      'Adventure': {
        background: 'rgba(16, 185, 129, 0.85)', // neon-green
        borderColor: 'var(--neon-green)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
      },
      'Learning': {
        background: 'rgba(168, 85, 247, 0.85)', // neon-purple
        borderColor: 'var(--neon-purple)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(168, 85, 247, 0.8)'
      },
      'Creative': {
        background: 'rgba(245, 158, 11, 0.85)', // neon-orange
        borderColor: 'var(--neon-orange)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(245, 158, 11, 0.8)'
      },
      'Sports': {
        background: 'rgba(34, 197, 94, 0.85)', // emerald-green
        borderColor: 'rgb(34, 197, 94)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(34, 197, 94, 0.8)'
      },
      'Food': {
        background: 'rgba(239, 68, 68, 0.85)', // red
        borderColor: 'rgb(239, 68, 68)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(239, 68, 68, 0.8)'
      },
      'Music': {
        background: 'rgba(147, 51, 234, 0.85)', // violet
        borderColor: 'rgb(147, 51, 234)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(147, 51, 234, 0.8)'
      },
      'Art': {
        background: 'rgba(251, 146, 60, 0.85)', // amber
        borderColor: 'rgb(251, 146, 60)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(251, 146, 60, 0.8)'
      },
      'Tech': {
        background: 'rgba(0, 245, 255, 0.85)', // neon-cyan
        borderColor: 'var(--neon-cyan)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(0, 245, 255, 0.8)'
      },
      'Travel': {
        background: 'rgba(59, 130, 246, 0.85)', // blue
        borderColor: 'rgb(59, 130, 246)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(59, 130, 246, 0.8)'
      },
      'Fitness': {
        background: 'rgba(220, 38, 127, 0.85)', // rose
        borderColor: 'rgb(220, 38, 127)',
        color: 'var(--background)',
        textShadow: '0 0 8px rgba(220, 38, 127, 0.8)'
      }
    }
    
    return categoryStyles[normalizedCategory as keyof typeof categoryStyles] || {
      background: 'rgba(0, 245, 255, 0.85)', // neon-cyan default with higher opacity
      borderColor: 'var(--neon-cyan)',
      color: 'var(--background)',
      textShadow: '0 0 8px rgba(0, 245, 255, 0.8)'
    }
  }

  const categoryStyle = getCategoryStyle(quest.category)

  return (
    <div className={`hud-card relative overflow-hidden group mx-4 mb-4 ${quest.isEpic ? 'ring-2 ring-neon-cyan' : ''}`}>
      {quest.isEpic && (
        <div className="absolute -top-2 -right-2 px-3 py-1 text-xs font-bold transform rotate-12 z-10 rounded-md border border-neon-cyan" style={{
          background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)',
          color: 'var(--background)',
          textShadow: '0 0 10px rgba(0, 245, 255, 0.8)',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)'
        }}>
          💝 FEATURED
        </div>
      )}
      
      {/* Image Section - Only render if image exists */}
      {quest.image && (
        <div className="p-0 relative">
          <div className="h-36 relative overflow-hidden rounded-t-lg" style={{
            background: `linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)`
          }}>
            <ImageWithFallback 
              src={quest.image} 
              alt={quest.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <div 
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm transition-all"
                style={{
                  background: categoryStyle.background,
                  borderColor: categoryStyle.borderColor,
                  color: categoryStyle.color,
                  textShadow: categoryStyle.textShadow,
                  boxShadow: `0 0 15px ${categoryStyle.borderColor}30`
                }}
              >
                {quest.category}
              </div>
            </div>

            {/* Save Quest Heart Button - Mobile Optimized */}
            <button
              onClick={handleSaveQuest}
              className={`absolute top-3 right-3 p-3 rounded-full border backdrop-blur-sm transition-all duration-300 group/heart active:scale-90 z-20 touch-manipulation flex items-center justify-center ${
                isSaved 
                  ? 'bg-gradient-to-r from-neon-pink to-neon-red border-neon-pink' 
                  : 'bg-black/60 border-white/60 active:border-neon-pink active:bg-black/80'
              }`}
              style={{
                boxShadow: isSaved 
                  ? '0 0 20px rgba(236, 72, 153, 0.5), 0 0 15px rgba(220, 38, 38, 0.3)' 
                  : '0 0 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                minWidth: '44px',
                minHeight: '44px'
              }}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isSaved 
                    ? 'text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                    : 'text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] group-active/heart:text-neon-pink group-active/heart:fill-neon-pink/30'
                }`} 
              />
              {isSaved && (
                <div className="absolute inset-0 rounded-full border border-neon-pink animate-ping opacity-75" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Header Section - Only render if no image */}
      {!quest.image && (
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm transition-all"
              style={{
                background: categoryStyle.background,
                borderColor: categoryStyle.borderColor,
                color: categoryStyle.color,
                textShadow: categoryStyle.textShadow,
                boxShadow: `0 0 15px ${categoryStyle.borderColor}30`
              }}
            >
              {quest.category}
            </div>

            {/* Save Quest Heart Button - Mobile Optimized */}
            <button
              onClick={handleSaveQuest}
              className={`p-3 rounded-full border backdrop-blur-sm transition-all duration-300 group/heart active:scale-90 z-20 touch-manipulation flex items-center justify-center ${
                isSaved 
                  ? 'bg-gradient-to-r from-neon-pink to-neon-red border-neon-pink' 
                  : 'bg-muted/60 border-border active:border-neon-pink active:bg-muted/80'
              }`}
              style={{
                boxShadow: isSaved 
                  ? '0 0 20px rgba(236, 72, 153, 0.5), 0 0 15px rgba(220, 38, 38, 0.3)' 
                  : '0 0 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                minWidth: '44px',
                minHeight: '44px'
              }}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isSaved 
                    ? 'text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                    : 'text-foreground drop-shadow-[0_0_4px_rgba(0,0,0,0.3)] group-active/heart:text-neon-pink group-active/heart:fill-neon-pink/30'
                }`} 
              />
              {isSaved && (
                <div className="absolute inset-0 rounded-full border border-neon-pink animate-ping opacity-75" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${quest.image ? 'p-4' : 'px-4 pb-4'}`}>
        <div>
          <h3 className="font-bold text-lg mb-2 text-foreground">
            {quest.title}
          </h3>
          <p className="text-muted-foreground text-sm">{quest.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neon-red" />
            <span className="text-foreground font-medium">{quest.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-purple" />
            <span className="text-foreground font-medium">{quest.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs flex items-center gap-2 text-muted-foreground">
            <span className="text-neon-green">👤 POSTED BY:</span>
            <span className="font-bold text-foreground">{quest.organizer}</span>
          </div>
          {quest.cost && (
            <div className={`inline-block ${
              quest.cost.toLowerCase() === 'free' 
                ? 'border border-neon-green text-neon-green bg-green-500/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold'
                : 'gaming-counter px-3 py-1 text-xs font-bold'
            }`}>
              {quest.cost.toLowerCase() === 'free' ? '🎉 FREE' : `💰 ${quest.cost}`}
            </div>
          )}
        </div>

      </div>

      <div className={`${quest.image ? 'p-4 pt-0' : 'px-4 pb-4'}`}>
        <button 
          onClick={handleJoinQuest}
          className="w-full py-4 text-center font-bold tracking-wider active:scale-[0.95] transition-transform touch-manipulation neon-button"
          style={{ minHeight: '48px' }}
        >
          ⚡ JOIN QUEST
        </button>
      </div>

      {/* Join Quest Modal */}
      <JoinQuestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        quest={{
          id: quest.id,
          title: quest.title,
          organizer: quest.organizer,
          category: quest.category,
          location: quest.location,
          date: quest.date,
          time: quest.time
        }}
        userProfile={mockUserProfile}
      />

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        actionType={loginActionType}
        questTitle={quest.title}
      />
    </div>
  )
}