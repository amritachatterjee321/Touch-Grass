import { useState } from "react"
import { ArrowLeft, MapPin, Calendar, Clock, Users, MessageCircle, Star, Check, X, Sparkles, Trophy, Heart, Zap } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { toast } from "sonner@2.0.3"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface JoinRequest {
  id: string
  userId: string
  username: string
  age: number
  gender: string
  city: string
  profileImage: string | null
  interests: string[]
  bio: string
  personalityType: string
  personalMessage: string
  requestedAt: string
  questId: string
  questTitle: string
  questDate: string
  questTime: string
  questLocation: string
}

interface QuestApprovalScreenProps {
  joinRequest: JoinRequest
  onBack: () => void
  onApprove: (requestId: string) => void
  onReject: (requestId: string) => void
}

const personalityIcons = {
  introvert: "🧠",
  extrovert: "🎭",
  mysterious: "🌙"
}

const personalityColors = {
  introvert: "neon-purple",
  extrovert: "neon-orange", 
  mysterious: "neon-cyan"
}

const categoryEmojis: { [key: string]: string } = {
  "Board Games": "🎲",
  "Video Games": "🎮", 
  "Sports": "⚽",
  "Outdoor Adventures": "🏔️",
  "Food & Drinks": "🍕",
  "Arts & Crafts": "🎨",
  "Music & Concerts": "🎵",
  "Movies & TV": "🎬",
  "Books & Reading": "📚",
  "Tech & Coding": "💻",
  "Fitness & Wellness": "💪",
  "Travel & Exploration": "✈️",
  "Photography": "📸",
  "Dancing": "💃",
  "Comedy & Entertainment": "😂"
}

// Mock data for demo
const mockJoinRequest: JoinRequest = {
  id: "req_001",
  userId: "user_123",
  username: "AdventureSeeker_Raj",
  age: 26,
  gender: "Male",
  city: "Bangalore",
  profileImage: null,
  interests: ["Outdoor Adventures", "Photography", "Food & Drinks"],
  bio: "Love exploring hidden gems around the city! Always up for trying new cuisines and capturing perfect sunset shots. Looking for fellow adventure enthusiasts to share epic experiences with! 📸🌅",
  personalityType: "extrovert",
  personalMessage: "Hey! Your coffee exploration quest sounds amazing! I've been hunting for the best specialty coffee spots in Bangalore for months. I know a few hidden roasters in Koramangala that serve incredible single origins. Would love to join and share my local finds with the squad! ☕✨",
  requestedAt: "2024-01-15T10:30:00Z",
  questId: "quest_456",
  questTitle: "Hidden Coffee Gems Discovery Mission ☕",
  questDate: "2024-01-20",
  questTime: "10:00",
  questLocation: "Koramangala 5th Block, Near Sony Signal"
}

export function QuestApprovalScreen({ 
  joinRequest = mockJoinRequest, 
  onBack, 
  onApprove, 
  onReject 
}: QuestApprovalScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Quest Member Approved! 🎉", {
        description: `${joinRequest.username} has been added to your squad!`
      })
      onApprove(joinRequest.id)
    } catch (error) {
      toast.error("Failed to approve request")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Request declined", {
        description: "The user has been notified respectfully"
      })
      onReject(joinRequest.id)
    } catch (error) {
      toast.error("Failed to reject request")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr || typeof dateStr !== 'string') {
      return 'TBD'
    }
    
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr // Return as-is if invalid date
    }
    
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr || typeof timeStr !== 'string') {
      return 'TBD'
    }
    
    const timeParts = timeStr.split(':')
    if (timeParts.length !== 2) {
      return timeStr // Return as-is if not in expected format
    }
    
    const [hours, minutes] = timeParts
    const hour = parseInt(hours)
    if (isNaN(hour)) {
      return timeStr // Return as-is if hour is not a number
    }
    
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Quest Context */}
      <div className="hud-card m-4 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 via-neon-cyan/10 to-neon-purple/10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-input-background border border-border hover:border-neon-cyan transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-neon-cyan transition-colors" />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-neon-orange" />
                <h1 className="text-lg font-bold text-foreground">QUEST JOIN REQUEST</h1>
              </div>
              <p className="text-sm text-muted-foreground">Review squad member application</p>
            </div>
          </div>

          {/* Quest Details */}
          <div className="bg-input-background rounded-lg p-3 border border-border">
            <p className="font-bold text-foreground mb-1">{joinRequest.questTitle || 'Quest'}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(joinRequest.questDate)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(joinRequest.questTime)}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {joinRequest.questLocation || joinRequest.city || 'TBD'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-32">
        {/* User Profile Snapshot */}
        <div className="hud-card p-6 space-y-4">

          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-neon-cyan bg-input-background flex items-center justify-center overflow-hidden">
                {joinRequest.profileImage ? (
                  <ImageWithFallback 
                    src={joinRequest.profileImage} 
                    alt={joinRequest.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-8 h-8 text-neon-cyan" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1">{joinRequest.username}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <span>{joinRequest.age} years old</span>
                <span>•</span>
                <span>{joinRequest.gender}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {joinRequest.city}
                </div>
              </div>

              {/* Personality Type */}
              <div className="flex items-center gap-2">
                <div className="text-lg">
                  {personalityIcons[joinRequest.personalityType as keyof typeof personalityIcons]}
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-${personalityColors[joinRequest.personalityType as keyof typeof personalityColors]} text-${personalityColors[joinRequest.personalityType as keyof typeof personalityColors]} capitalize`}
                >
                  {joinRequest.personalityType}
                </Badge>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <p className="text-sm font-bold text-foreground mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {joinRequest.interests.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20 text-sm"
                >
                  <span>{categoryEmojis[interest] || "🎯"}</span>
                  <span className="text-foreground font-medium">{interest}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio Preview */}
          <div>
            <div className="bg-input-background rounded-lg p-3 border border-border">
              <p className="text-sm text-foreground leading-relaxed">
                {joinRequest.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div className="hud-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-neon-pink" />
            <h2 className="text-lg font-bold text-foreground">PERSONAL MESSAGE</h2>
          </div>

          <div className="bg-gradient-to-r from-neon-pink/5 to-neon-purple/5 rounded-lg p-4 border border-neon-pink/20 relative">
            <p className="text-foreground leading-relaxed">
              "{joinRequest.personalMessage}"
            </p>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neon-pink/20">
              <p className="text-xs text-muted-foreground">
                Sent {new Date(joinRequest.requestedAt).toLocaleDateString('en-IN')}
              </p>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-neon-pink" />
                <span className="text-xs text-neon-pink font-medium">Authentic Request</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="gaming-counter p-4 text-center">
            <div className="text-2xl font-bold mb-1">4.8</div>
            <div className="text-xs uppercase tracking-wide">Rating</div>
          </div>
          <div className="gaming-counter p-4 text-center border-neon-green text-neon-green">
            <div className="text-2xl font-bold mb-1">12</div>
            <div className="text-xs uppercase tracking-wide">Completed</div>
          </div>
          <div className="gaming-counter p-4 text-center border-neon-purple text-neon-purple">
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="text-xs uppercase tracking-wide">Organized</div>
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isProcessing}
            className="py-4 border-destructive text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2 font-bold"
          >
            DECLINE
          </Button>
          
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="neon-button py-4 flex items-center justify-center gap-2 font-bold"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                PROCESSING...
              </>
            ) : (
              "APPROVE"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}