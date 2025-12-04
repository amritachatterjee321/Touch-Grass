import { useState } from "react"
import { QuestCard } from "./QuestCard"
import { CitySelector } from "./CitySelector"
import { QuestCreationScreen } from "./QuestCreationScreen"
import { User, Sparkles, Target } from "lucide-react"

// Mock quest data removed - now using Firebase quests only

const categories = ['All', 'Social', 'Adventure', 'Learning', 'Creative', 'Sports', 'Food', 'Music', 'Art', 'Tech', 'Travel', 'Fitness']

interface QuestBoardProps {
  isProfileCompleted?: boolean
  onStartProfileCreation?: () => void
  isLoggedIn?: boolean
  quests?: any[]
  onQuestSaved?: (questData: any) => void
  onGoogleSignIn?: () => void
  onQuestCreationRequest?: () => void
  userUid?: string
  savedQuests?: string[]
  onQuestSaveToggle?: () => void
}

export function QuestBoard({ 
  isProfileCompleted = true, 
  onStartProfileCreation, 
  isLoggedIn = false, 
  quests = [], 
  onQuestSaved, 
  onGoogleSignIn, 
  onQuestCreationRequest,
  userUid,
  savedQuests = [],
  onQuestSaveToggle
}: QuestBoardProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('Bangalore, Karnataka')
  const [isQuestCreationOpen, setIsQuestCreationOpen] = useState(false)

  // Use only Firebase quests (no mock data fallback)
  const allQuests = quests || []

  // Category color mapping for filter buttons
  const getCategoryFilterStyle = (category: string, isActive: boolean) => {
    const categoryStyles = {
      'Social': {
        borderColor: 'var(--neon-pink)',
        color: isActive ? 'var(--background)' : 'var(--neon-pink)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-pink) 0%, rgba(236, 72, 153, 0.8) 100%)'
          : 'rgba(236, 72, 153, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(236, 72, 153, 0.5)' 
          : '0 0 10px rgba(236, 72, 153, 0.2)'
      },
      'Adventure': {
        borderColor: 'var(--neon-green)',
        color: isActive ? 'var(--background)' : 'var(--neon-green)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-green) 0%, rgba(16, 185, 129, 0.8) 100%)'
          : 'rgba(16, 185, 129, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(16, 185, 129, 0.5)' 
          : '0 0 10px rgba(16, 185, 129, 0.2)'
      },
      'Learning': {
        borderColor: 'var(--neon-purple)',
        color: isActive ? 'var(--background)' : 'var(--neon-purple)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-purple) 0%, rgba(168, 85, 247, 0.8) 100%)'
          : 'rgba(168, 85, 247, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(168, 85, 247, 0.5)' 
          : '0 0 10px rgba(168, 85, 247, 0.2)'
      },
      'Creative': {
        borderColor: 'var(--neon-orange)',
        color: isActive ? 'var(--background)' : 'var(--neon-orange)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-orange) 0%, rgba(245, 158, 11, 0.8) 100%)'
          : 'rgba(245, 158, 11, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(245, 158, 11, 0.5)' 
          : '0 0 10px rgba(245, 158, 11, 0.2)'
      },
      'Sports': {
        borderColor: 'var(--neon-green)',
        color: isActive ? 'var(--background)' : 'var(--neon-green)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-green) 0%, rgba(16, 185, 129, 0.8) 100%)'
          : 'rgba(16, 185, 129, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(16, 185, 129, 0.5)' 
          : '0 0 10px rgba(16, 185, 129, 0.2)'
      },
      'Food': {
        borderColor: 'var(--neon-pink)',
        color: isActive ? 'var(--background)' : 'var(--neon-pink)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-pink) 0%, rgba(236, 72, 153, 0.8) 100%)'
          : 'rgba(236, 72, 153, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(236, 72, 153, 0.5)' 
          : '0 0 10px rgba(236, 72, 153, 0.2)'
      },
      'Music': {
        borderColor: 'var(--neon-purple)',
        color: isActive ? 'var(--background)' : 'var(--neon-purple)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-purple) 0%, rgba(168, 85, 247, 0.8) 100%)'
          : 'rgba(168, 85, 247, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(168, 85, 247, 0.5)' 
          : '0 0 10px rgba(168, 85, 247, 0.2)'
      },
      'Art': {
        borderColor: 'var(--neon-orange)',
        color: isActive ? 'var(--background)' : 'var(--neon-orange)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-orange) 0%, rgba(245, 158, 11, 0.8) 100%)'
          : 'rgba(245, 158, 11, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(245, 158, 11, 0.5)' 
          : '0 0 10px rgba(245, 158, 11, 0.2)'
      },
      'Tech': {
        borderColor: 'var(--neon-cyan)',
        color: isActive ? 'var(--background)' : 'var(--neon-cyan)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-cyan) 0%, rgba(0, 245, 255, 0.8) 100%)'
          : 'rgba(0, 245, 255, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(0, 245, 255, 0.5)' 
          : '0 0 10px rgba(0, 245, 255, 0.2)'
      },
      'Travel': {
        borderColor: 'var(--neon-green)',
        color: isActive ? 'var(--background)' : 'var(--neon-green)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-green) 0%, rgba(16, 185, 129, 0.8) 100%)'
          : 'rgba(16, 185, 129, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(16, 185, 129, 0.5)' 
          : '0 0 10px rgba(16, 185, 129, 0.2)'
      },
      'Fitness': {
        borderColor: 'var(--neon-pink)',
        color: isActive ? 'var(--background)' : 'var(--neon-pink)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-pink) 0%, rgba(236, 72, 153, 0.8) 100%)'
          : 'rgba(236, 72, 153, 0.1)',
        boxShadow: isActive 
          ? '0 0 20px rgba(236, 72, 153, 0.5)' 
          : '0 0 10px rgba(236, 72, 153, 0.2)'
      },
      'All': {
        borderColor: 'var(--neon-cyan)',
        color: isActive ? 'var(--background)' : 'var(--neon-cyan)',
        background: isActive 
          ? 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)'
          : 'var(--hud-bg)',
        boxShadow: isActive 
          ? '0 0 20px rgba(0, 245, 255, 0.5)' 
          : '0 0 10px rgba(0, 245, 255, 0.2)'
      }
    }
    
    return categoryStyles[category as keyof typeof categoryStyles] || categoryStyles['All']
  }

  const filteredQuests = allQuests.filter(quest => {
    const matchesCategory = selectedCategory === 'All' || quest.category === selectedCategory
    
    // Filter by city - extract city name from "City, State" format
    // selectedLocation is in format: "Bangalore, Karnataka"
    // quest.city might be just "Bangalore" or "Bangalore, Karnataka"
    const selectedCityName = selectedLocation.split(',')[0].trim()
    const questCityName = quest.city ? quest.city.split(',')[0].trim() : null
    
    // Match if:
    // 1. Quest has no city (legacy quests)
    // 2. Quest city matches selected city
    const matchesCity = !questCityName || questCityName === selectedCityName
    
    // Debug logging for filtered out quests
    if (!matchesCategory || !matchesCity) {
      console.log('🔍 Quest filtered out:', {
        title: quest.title,
        questCity: questCityName,
        selectedCity: selectedCityName,
        matchesCity: matchesCity,
        questCategory: quest.category,
        selectedCategory: selectedCategory,
        matchesCategory: matchesCategory
      })
    }
    
    return matchesCategory && matchesCity
  })
  
  console.log('📊 QuestBoard: Total quests:', allQuests.length, 'Filtered quests:', filteredQuests.length)

  return (
    <div className="min-h-screen bg-background">


      {/* Profile Completion Banner - Only show for logged in users with incomplete profiles */}
      {isLoggedIn && !isProfileCompleted && (
        <div className="px-4 pt-6 pb-4">
          <div className="gaming-panel p-4 border-2 border-neon-cyan/50 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-pink/5 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 opacity-50 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Complete your profile</h3>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ready to find your squad? Complete your profile with your interests, personality, and bio to start connecting with fellow quest seekers in your area! ⚡
                </p>
              </div>
              
              <button
                onClick={onStartProfileCreation}
                className="neon-button px-6 py-3 w-full flex items-center justify-center gap-2 touch-manipulation"
                style={{ minHeight: '48px' }}
              >
                <Sparkles className="w-4 h-4" />
                Complete Profile
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
            
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neon-cyan/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-neon-purple/20 to-transparent" />
          </div>
        </div>
      )}

      {/* Mobile Location Picker */}
      <div className="px-4 pt-2 pb-1">
        <CitySelector 
          selectedCity={selectedLocation}
          onCityChange={setSelectedLocation}
        />
      </div>

      {/* Mobile-Optimized Filters Panel */}
      <div className="gaming-panel p-4 mx-4 mb-0">
        {/* Category Filters */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-3 px-1 scroll-smooth snap-x snap-mandatory mobile-scroll" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            {categories.map(category => {
              const isActive = selectedCategory === category
              const filterStyle = getCategoryFilterStyle(category, isActive)
              
              return (
                <button
                  key={category}
                  className="px-5 py-3 cursor-pointer whitespace-nowrap text-sm transition-all snap-start flex-shrink-0 border rounded-full backdrop-blur-sm font-bold uppercase tracking-wider touch-manipulation active:scale-95"
                  style={{
                    background: filterStyle.background,
                    borderColor: filterStyle.borderColor,
                    color: filterStyle.color,
                    boxShadow: filterStyle.boxShadow,
                    minHeight: '44px'
                  }}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              )
            })}
          </div>
          
          {/* Enhanced scroll fade indicators */}
          <div className="absolute top-0 right-0 bottom-3 w-8 pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent"></div>
          <div className="absolute top-0 left-0 bottom-3 w-8 pointer-events-none bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        </div>
      </div>

      <div className="pt-2 space-y-4">

        {/* All Quests */}
        {filteredQuests.length > 0 && (
          <div className="space-y-0">
            {filteredQuests.map(quest => (
              <QuestCard 
                key={quest.id} 
                quest={quest} 
                isProfileCompleted={isProfileCompleted}
                onStartProfileCreation={onStartProfileCreation}
                isLoggedIn={isLoggedIn}
                onGoogleSignIn={onGoogleSignIn}
                userUid={userUid}
                savedQuests={savedQuests}
                onQuestSaveToggle={onQuestSaveToggle}
              />
            ))}
          </div>
        )}

        {/* Enhanced No Results with Gaming Style */}
        {filteredQuests.length === 0 && (
          <div className="gaming-panel mx-4 p-8 border border-neon-purple/30">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-neon-purple" />
              </div>
              <h3 className="font-bold mb-3 text-foreground uppercase tracking-wider">New Territory Unlocked!</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                No quests in this category yet! Be the pioneer and create your own adventure.
              </p>
              <div className="space-y-3">
                <button 
                  className="neon-button px-8 py-4 w-full touch-manipulation flex items-center justify-center"
                  style={{ minHeight: '48px' }}
                  onClick={() => {
                    // Check if user is logged in before allowing quest creation
                    if (!isLoggedIn) {
                      onQuestCreationRequest?.()
                    } else {
                      setIsQuestCreationOpen(true)
                    }
                  }}
                >
                  CREATE QUEST
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
      
      {/* Quest Creation Modal */}
      {isQuestCreationOpen && (
        <QuestCreationScreen 
          onClose={() => setIsQuestCreationOpen(false)}
          onQuestSaved={onQuestSaved}
        />
      )}
    </div>
  )
}