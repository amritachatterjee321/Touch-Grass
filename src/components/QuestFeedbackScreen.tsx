import { ArrowLeft, Send, Heart, Crown, Sparkles, Users, Star, Clock } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useState } from "react"
import { useFirebase } from "../contexts/FirebaseContext"
import { giveBadge, BADGE_TYPES } from "../firebase/badges"
import { toast } from "sonner"

const badgeTypes = [
  {
    id: 'butterfly',
    name: 'Social Butterfly',
    icon: '🦋',
    description: 'Great fun to hang with',
    color: 'neon-pink',
    subtitle: 'Made the quest amazing!'
  },
  {
    id: 'grass',
    name: 'Seedling',
    icon: '🌱',
    description: 'Kudos on stepping out of your house',
    color: 'neon-green',
    subtitle: 'Welcome to the adventure!'
  },
  {
    id: 'knight',
    name: 'Knight',
    icon: '⚔️',
    description: 'Thanks for saving the day!',
    color: 'neon-cyan',
    subtitle: 'Led the way brilliantly!'
  },
  {
    id: 'heart',
    name: 'Slight Crush',
    icon: '💝',
    description: 'Call me maybe?',
    color: 'neon-orange',
    subtitle: 'Great connection potential!'
  }
]

const mockQuestParticipants = [
  {
    id: 'user_1',
    username: 'AdventureSeeker_Raj',
    fullName: 'Raj Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWluZyUyMDgtYml0fGVufDF8fHx8MTc1NjU0NjIwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    isFirstQuest: false
  },
  {
    id: 'user_2',
    username: 'CoffeeLover_Maya',
    fullName: 'Maya Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxyZXRybyUyMGdhbWluZyUyMDgtYml0fGVufDF8fHx8MTc1NjU0NjIwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    isFirstQuest: true
  },
  {
    id: 'user_3',
    username: 'ExploreBangalore',
    fullName: 'Arjun Singh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxyZXRybyUyMGdhbWluZyUyMDgtYml0fGVufDF8fHx8MTc1NjU0NjIwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    isFirstQuest: false
  }
]

interface QuestFeedbackScreenProps {
  questTitle: string
  questId?: string
  onBack: () => void
  onSubmitFeedback: (feedback: any) => void
}

export function QuestFeedbackScreen({ questTitle, questId, onBack, onSubmitFeedback }: QuestFeedbackScreenProps) {
  const { user } = useFirebase()
  const [selectedBadges, setSelectedBadges] = useState<{[userId: string]: string[]}>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBadgeToggle = (userId: string, badgeId: string) => {
    setSelectedBadges(prev => {
      const userBadges = prev[userId] || []
      const newBadges = userBadges.includes(badgeId) 
        ? userBadges.filter(id => id !== badgeId)
        : [...userBadges, badgeId]
      
      return {
        ...prev,
        [userId]: newBadges
      }
    })
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }

    // Handle case where questId is missing (mock quests)
    const effectiveQuestId = questId || `mock_quest_${Date.now()}`
    
    console.log('🎯 Submitting badges for quest:')
    console.log('   - Quest Title:', questTitle)
    console.log('   - Original questId:', questId)
    console.log('   - Effective questId:', effectiveQuestId)
    console.log('   - Badges to give:', selectedBadges)

    setIsSubmitting(true)
    
    try {
      // Save badges to Firebase
      const badgePromises: Promise<any>[] = []
      
      Object.entries(selectedBadges).forEach(([userId, badgeIds]) => {
        badgeIds.forEach(badgeId => {
          const badgeType = BADGE_TYPES[badgeId as keyof typeof BADGE_TYPES]
          const participant = mockQuestParticipants.find(p => p.id === userId)
          
          if (badgeType && participant) {
            const badgePromise = giveBadge({
              questId: effectiveQuestId,
              giverUid: user.uid,
              giverName: user.displayName || 'Anonymous',
              receiverUid: userId,
              receiverName: participant.fullName,
              badgeType: badgeId as any,
              badgeName: badgeType.name,
              badgeIcon: badgeType.icon,
              badgeDescription: badgeType.description
            })
            badgePromises.push(badgePromise)
          }
        })
      })
      
      await Promise.all(badgePromises)
      
      toast.success('Badges sent successfully! 🎉')
      onSubmitFeedback(selectedBadges)
      setSubmitted(true)
      
    } catch (error: any) {
      console.error('Error saving badges:', error)
      toast.error('Failed to send badges. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTotalBadgesGiven = () => {
    return Object.values(selectedBadges).reduce((total, badges) => total + badges.length, 0)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-6 pb-6">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border-2 border-neon-green/40 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-neon-green" />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-3">Badges Sent! ✨</h1>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your appreciation has been shared with your fellow adventurers. Building connections, one quest at a time!
            </p>
          </div>

          {/* Summary */}
          <div className="gaming-panel p-6 mb-8 border border-neon-green/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green mb-2">{getTotalBadgesGiven()}</div>
              <div className="text-sm font-semibold text-neon-green/80 uppercase tracking-wide mb-4">
                Badges Given
              </div>
              <div className="text-xs text-muted-foreground">
                Your positive vibes are spreading through the community! 🌟
              </div>
            </div>
          </div>

          {/* Return Button */}
          <button
            onClick={onBack}
            className="neon-button w-full py-4 flex items-center justify-center gap-3"
          >
            <Crown className="w-5 h-5" />
            Return to Quests
            <Crown className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full gaming-panel border border-neon-cyan/30 flex items-center justify-center hover:border-neon-cyan transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-neon-cyan" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-foreground">Give Badges</h1>
          <p className="text-xs text-muted-foreground truncate">{questTitle}</p>
        </div>
        <div className="gaming-counter px-3 py-1">
          <span>{getTotalBadgesGiven()}</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* Introduction */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border-2 border-neon-cyan/40 flex items-center justify-center">
            <Heart className="w-8 h-8 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold gradient-text mb-3">Quest Complete! 🎉</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Show appreciation to your fellow adventurers by giving them badges. Spread the good vibes!
          </p>
        </div>

        {/* Participants */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-center">Quest Squad</h3>
          
          {mockQuestParticipants.map((participant) => (
            <div key={participant.id} className="gaming-panel p-6 border border-neon-purple/30">
              {/* Participant Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-neon-cyan/30 overflow-hidden bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10">
                  <ImageWithFallback 
                    src={participant.avatar} 
                    alt={participant.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-foreground">{participant.fullName}</div>
                  <div className="text-sm text-neon-cyan font-semibold">@{participant.username}</div>
                  {participant.isFirstQuest && (
                    <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
                      <span className="text-xs">🌱</span>
                      <span className="text-xs font-semibold text-neon-green">First Quest!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Badge Selection */}
              <div className="grid grid-cols-2 gap-3">
                {badgeTypes.map((badge) => {
                  const isSelected = selectedBadges[participant.id]?.includes(badge.id) || false
                  
                  return (
                    <button
                      key={badge.id}
                      onClick={() => handleBadgeToggle(participant.id, badge.id)}
                      className={`p-4 rounded-xl text-center transition-all duration-300 transform ${
                        isSelected 
                          ? `bg-gradient-to-br from-${badge.color}/20 to-${badge.color}/10 border-2 border-${badge.color}/60 shadow-lg scale-105` 
                          : 'gaming-panel border border-white/60 hover:border-neon-cyan/40 hover:scale-102'
                      }`}
                    >
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <div className={`text-xs font-bold ${isSelected ? `text-${badge.color}` : 'text-muted-foreground'} mb-1`}>
                        {badge.name}
                      </div>
                      <div className={`text-xs ${isSelected ? `text-${badge.color}/80` : 'text-muted-foreground'}`}>
                        {badge.description}
                      </div>
                      
                      {isSelected && (
                        <div className="mt-2">
                          <div className={`w-6 h-6 mx-auto rounded-full bg-${badge.color} flex items-center justify-center`}>
                            <div className="text-white text-xs font-bold">✓</div>
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 space-y-4">
          {getTotalBadgesGiven() > 0 && (
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30">
              <div className="text-sm font-bold text-neon-cyan mb-1">
                Ready to spread the love! ❤️
              </div>
              <div className="text-xs text-muted-foreground">
                You're giving {getTotalBadgesGiven()} badge{getTotalBadgesGiven() !== 1 ? 's' : ''} to your fellow adventurers
              </div>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={getTotalBadgesGiven() === 0 || isSubmitting}
            className={`w-full py-4 flex items-center justify-center gap-3 rounded-lg font-bold uppercase tracking-wide transition-all ${
              getTotalBadgesGiven() > 0 && !isSubmitting
                ? 'neon-button'
                : 'bg-muted/50 text-muted-foreground cursor-not-allowed border border-muted'
            }`}
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'Sending Badges...' : 
             getTotalBadgesGiven() > 0 ? 'Send Badges' : 'Select badges to continue'}
            <Send className="w-5 h-5" />
          </button>
          
          <button
            onClick={onBack}
            className="w-full py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}