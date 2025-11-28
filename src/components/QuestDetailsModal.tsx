import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { MapPin, Coins, Star, Calendar, Target } from "lucide-react"
import { ImageWithFallback } from './figma/ImageWithFallback'

interface QuestDetailsModalProps {
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
    equipment?: string
    tags?: string[]
  }
  onClose: () => void
  onJoin: () => void
}

export function QuestDetailsModal({ quest, onClose, onJoin }: QuestDetailsModalProps) {
  const difficultyColors = {
    'Beginner': 'bg-green-500',
    'Intermediate': 'bg-yellow-500', 
    'Expert': 'bg-red-500'
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl mt-8 mb-8">
        <CardHeader className="p-0 relative">
          {/* Image Section - Only render if image exists */}
          {quest.image ? (
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
              <ImageWithFallback 
                src={quest.image} 
                alt={quest.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
              >
                ×
              </button>

              {/* Epic Badge */}
              {quest.isEpic && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 font-bold transform -rotate-12">
                  EPIC QUEST!
                </div>
              )}

              {/* Quest Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl font-bold text-white mb-2">{quest.title}</h1>
                <div className="flex gap-2">
                  <Badge className={`${difficultyColors[quest.difficulty]} text-white border-0`}>
                    {quest.difficulty}
                  </Badge>
                  <div 
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm"
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
              </div>
            </div>
          ) : (
            /* Header Section - Only render if no image */
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">{quest.title}</h1>
                  <div className="flex gap-2">
                    <Badge className={`${difficultyColors[quest.difficulty]}`}>
                      {quest.difficulty}
                    </Badge>
                    <div 
                      className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm"
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
                </div>
                
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="w-8 h-8 bg-muted text-foreground rounded-full flex items-center justify-center hover:bg-muted/80"
                >
                  ×
                </button>
              </div>
              
              {/* Epic Badge */}
              {quest.isEpic && (
                <div className="inline-block bg-yellow-400 text-black px-3 py-1 font-bold transform -rotate-12 mb-4">
                  EPIC QUEST!
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className={`space-y-6 ${quest.image ? 'p-6' : 'px-6 pb-6'}`}>
          {/* Quest Master Info */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-500 text-white">
                {quest.organizer.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Quest Master</div>
              <div className="text-blue-600">{quest.organizer}</div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm">4.8</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold mb-2">Quest Description</h3>
            <p className="text-muted-foreground">{quest.description}</p>
          </div>

          {/* Quest Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-medium">{quest.date}</div>
                  <div className="text-sm text-muted-foreground">{quest.time}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">{quest.location}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {quest.cost && (
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <div>
                    <div className="font-medium">Cost</div>
                    <div className="text-sm text-muted-foreground">{quest.cost}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Equipment/Requirements */}
          {quest.equipment && (
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                What to Bring
              </h3>
              <p className="text-muted-foreground">{quest.equipment}</p>
            </div>
          )}

          {/* Tags */}
          {quest.tags && quest.tags.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Quest Tags</h3>
              <div className="flex flex-wrap gap-2">
                {quest.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Application Form */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <h3 className="font-bold">Join This Quest</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Why do you want to join this quest?</label>
                <Textarea 
                  placeholder="Tell the Quest Master why you're the perfect adventurer for this quest..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={onJoin}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 border-b-4 border-green-800 hover:border-green-900 transform active:scale-95 transition-transform"
                >
                  Apply to Join Quest
                </Button>
                <Button variant="outline" size="sm" className="px-6">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>


        </CardContent>
      </Card>
    </div>
  )
}