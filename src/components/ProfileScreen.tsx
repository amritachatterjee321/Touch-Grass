import { useState, useEffect } from "react"
import { Trophy, Sparkles, Target, Star, Crown } from "lucide-react"
import { useFirebase } from "../contexts/FirebaseContext"
import { getUserProfile } from "../firebase/users"
import { getUserQuests, getUserJoinedQuests } from "../firebase/quests"

const heroLevels = [
  { 
    id: 1, 
    name: 'Novice Grass Toucher', 
    subtitle: 'Just Getting Started',
    icon: '🌱', 
    color: 'neon-green',
    minAdventures: 0, 
    maxAdventures: 10,
    description: 'Taking your first steps into the real world'
  },
  { 
    id: 2, 
    name: 'Intermediate Adventurer', 
    subtitle: 'Making Connections',
    icon: '⚔️', 
    color: 'neon-cyan',
    minAdventures: 11, 
    maxAdventures: 25,
    description: 'Building experiences and meaningful relationships'
  },
  { 
    id: 3, 
    name: 'Legendary Forest Spirit', 
    subtitle: 'Master of Adventures',
    icon: '🌲', 
    color: 'neon-orange',
    minAdventures: 26, 
    maxAdventures: Infinity,
    description: 'Leading others to epic real-world experiences'
  }
]

const getCurrentHeroLevel = (adventuresCompleted: number) => {
  return heroLevels.find(level => 
    adventuresCompleted >= level.minAdventures && 
    adventuresCompleted <= level.maxAdventures
  ) || heroLevels[0]
}

const getProgressToNextLevel = (adventuresCompleted: number, currentLevel: any) => {
  if (currentLevel.id === 3) return 100 // Max level reached
  
  const progressInCurrentLevel = adventuresCompleted - currentLevel.minAdventures
  const totalNeededForCurrentLevel = currentLevel.maxAdventures - currentLevel.minAdventures + 1
  
  return Math.min(100, (progressInCurrentLevel / totalNeededForCurrentLevel) * 100)
}

// Mock profile for reference - will be replaced with real data
const mockProfile = {
  username: 'HeroAlex',
  bio: 'Seasoned grass-toucher and adventure seeker! Spreading the joy of real-world connections one quest at a time.',
  avatar: 'https://images.unsplash.com/photo-1633868060075-d77201a3bbab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWluZyUyMDgtYml0fGVufDF8fHx8MTc1NjU0NjIwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  stats: {
    adventuresCompleted: 0,
    adventuresOrganized: 0,
  },
  recentActivity: [
    'Start your adventure journey!',
    'Join or create your first quest',
    'Connect with fellow adventurers'
  ]
}



interface ProfileScreenProps {
  isProfileCompleted?: boolean
  onStartProfileCreation?: () => void
  onEditProfile?: () => void
}

export function ProfileScreen({ isProfileCompleted = true, onStartProfileCreation }: ProfileScreenProps) {
  const { user } = useFirebase()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [questsJoined, setQuestsJoined] = useState(0)
  const [questsOrganized, setQuestsOrganized] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile and quest data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Fetch user profile
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)

        // Fetch quests organized by user
        const organizedQuests = await getUserQuests(user.uid)
        setQuestsOrganized(organizedQuests.length)

        // Fetch quests joined by user
        const joinedQuests = await getUserJoinedQuests(user.uid)
        setQuestsJoined(joinedQuests.length)

        console.log('📊 Profile Stats:', {
          questsJoined: joinedQuests.length,
          questsOrganized: organizedQuests.length,
          level: profile?.level || 1
        })
      } catch (error) {
        console.error('❌ Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Calculate profile data for display
  const profileData = {
    username: userProfile?.username || userProfile?.displayName || 'Hero',
    bio: userProfile?.bio || 'Welcome to your adventure journey!',
    avatar: userProfile?.photoURL || userProfile?.profileImage || mockProfile.avatar,
    stats: {
      adventuresCompleted: questsJoined,
      adventuresOrganized: questsOrganized,
    },
    recentActivity: mockProfile.recentActivity // This would be fetched from a real activity log
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Adventure Hub for Completed Profiles */}
      {isProfileCompleted && (
        <div className="px-4 pt-2 pb-6">
          {/* Main Hero Section with Enhanced Visuals */}
          <div className="relative overflow-hidden rounded-2xl mb-6">
            {/* Vibrant Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/15 via-neon-purple/20 to-neon-pink/15" />
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-green/10 via-transparent to-neon-orange/10" />
            
            {/* Animated Background Elements */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-neon-cyan/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-neon-purple/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-neon-pink/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Content Layer */}
            <div className="relative z-10 p-6">
              {/* Welcome Header */}
              <div className="text-center mb-8">

                
                {/* Hero Level System - Gaming Card Collection */}
                {(() => {
                  const currentHeroLevel = getCurrentHeroLevel(profileData.stats.adventuresCompleted)
                  const progress = getProgressToNextLevel(profileData.stats.adventuresCompleted, currentHeroLevel)
                  
                  return (
                      <div className="w-full max-w-sm mx-auto">


                        {/* Gaming Card Collection */}
                        <div className="space-y-4">
                          {(() => {
                            // Create ordered array: current level first, then remaining levels in order
                            const currentLevel = heroLevels.find(level => level.id === currentHeroLevel.id)
                            const otherLevels = heroLevels.filter(level => level.id !== currentHeroLevel.id)
                            const orderedLevels = currentLevel ? [currentLevel, ...otherLevels] : heroLevels
                            
                            return orderedLevels.map((level) => {
                            const isActive = level.id === currentHeroLevel.id
                            const isCompleted = level.id < currentHeroLevel.id
                            const isLocked = level.id > currentHeroLevel.id

                            return (
                              <div
                                key={level.id}
                                className={`relative overflow-hidden rounded-2xl transition-all duration-700 transform ${
                                  isActive ? 'scale-105 shadow-2xl' : isCompleted ? 'scale-100 shadow-lg' : 'scale-95 opacity-50'
                                } hover:scale-[1.02] cursor-pointer`}
                              >
                                {/* Card Background with Gaming Pattern */}
                                <div 
                                  className="absolute inset-0 rounded-2xl"
                                  style={{
                                    background: isLocked 
                                      ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                                      : `linear-gradient(135deg, var(--${level.color})/25 0%, var(--${level.color})/5 50%, var(--${level.color})/15 100%)`
                                  }}
                                />

                                {/* Holographic card effect */}
                                {!isLocked && (
                                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-60"></div>
                                )}

                                {/* Card Border with Glow */}
                                <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
                                  isActive 
                                    ? `border-${level.color} shadow-2xl` 
                                    : isCompleted 
                                      ? `border-${level.color}/70 shadow-lg`
                                      : 'border-muted/50'
                                }`} 
                                style={{
                                  boxShadow: isActive 
                                    ? `0 0 30px var(--${level.color})/40, 0 0 60px var(--${level.color})/20` 
                                    : isCompleted 
                                      ? `0 0 15px var(--${level.color})/30`
                                      : 'none'
                                }}
                                />
                                
                                {/* Card Content */}
                                <div className="relative p-6">
                                  <div className="flex items-center gap-5">
                                    {/* Level Icon with Gaming Frame */}
                                    <div className="relative">
                                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-6xl transition-all duration-500 ${
                                        isLocked 
                                          ? 'bg-muted/50 grayscale border-2 border-muted' 
                                          : `bg-gradient-to-br from-${level.color}/30 to-${level.color}/10 border-2 border-${level.color}/50 shadow-lg`
                                      }`}>
                                        {isLocked ? '🔒' : level.icon}
                  </div>
                                      

                                      {/* Rarity indicator */}
                                      <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-bold ${
                                        isLocked 
                                          ? 'bg-muted text-black' 
                                          : level.id === 1 
                                            ? 'bg-green-500 text-black' 
                                            : level.id === 2 
                                              ? 'bg-blue-500 text-black' 
                                              : 'bg-purple-500 text-black'
                                      }`}>
                                        {isLocked ? 'LOCKED' : level.id === 1 ? 'COMMON' : level.id === 2 ? 'RARE' : 'LEGENDARY'}
                  </div>
                </div>
                
                                    {/* Level Info */}
                                    <div className="flex-1">
                                      <div className={`text-lg font-bold mb-1 ${
                                        isLocked ? 'text-muted-foreground' : `text-${level.color}`
                                      }`}>
                                        {level.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground mb-3">
                                        {level.subtitle}
                                      </div>
                                      <div className="text-xs text-muted-foreground mb-2">
                                        {level.maxAdventures === Infinity 
                                          ? `${level.minAdventures}+ adventures` 
                                          : `${level.minAdventures}-${level.maxAdventures} adventures`
                                        }
                                      </div>
                                      
                                      {/* Progress bar for active level */}
                                      {isActive && currentHeroLevel.id < 3 && (
                                        <div className="mt-2">
                                          <div className="flex justify-between text-xs mb-1">
                                            <span className={`text-${level.color} font-semibold`}>Progress</span>
                                            <span className="text-muted-foreground">
                                              {profileData.stats.adventuresCompleted}/{heroLevels[currentHeroLevel.id].minAdventures}
                                            </span>
                                          </div>
                                          <div className="gaming-progress h-2">
                                            <div 
                                              className="gaming-progress-fill h-full"
                                              style={{ width: `${progress}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Status Indicator */}
                                    <div className="text-right flex flex-col items-center gap-2">
                                      {isCompleted && (
                                        <div className={`w-10 h-10 rounded-full bg-${level.color} flex items-center justify-center shadow-lg`}>
                                          <div className="text-white text-lg font-bold">✓</div>
                                        </div>
                                      )}
                                      {isActive && (
                                        <div className={`px-3 py-1 rounded-full bg-${level.color}/20 border border-${level.color}/40`}>
                                          <div className={`text-xs font-bold text-${level.color} uppercase tracking-wide`}>ACTIVE</div>
                                        </div>
                                      )}
                                      {isLocked && (
                                        <div className="px-3 py-1 rounded-full bg-muted/50 border border-muted">
                                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">LOCKED</div>
                                        </div>
                                      )}
                  </div>
                </div>
                                </div>


                                {/* Completion celebration effect */}
                                {isCompleted && !isActive && (
                                  <div className="absolute top-2 left-2">
                                    <div className={`text-${level.color} text-sm opacity-75`}>🏆</div>
                                  </div>
                                )}
                              </div>
                            )
                          })
                          })()}
                        </div>


                      </div>
                    )
                })()}
              </div>

              {/* Enhanced Stats Display */}
              <div className="grid grid-cols-2 gap-5 mb-8">
                {/* Adventures Completed */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 border-2 border-neon-green/30 backdrop-blur-sm shadow-lg overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-neon-green/20 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-neon-cyan/15 to-transparent rounded-full blur-lg"></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-green/10 border-2 border-neon-green/40 flex items-center justify-center shadow-lg">
                        <Target className="w-6 h-6 text-neon-green" />
                  </div>
                      <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                    </div>
                    
                    {/* Main Number - Primary Focus */}
                    <div className="mb-2">
                      <div className="text-4xl font-bold text-neon-green leading-none mb-1">
                        {isLoading ? '...' : profileData.stats.adventuresCompleted}
                      </div>
                      <div className="text-sm font-bold text-neon-green/80 uppercase tracking-wide">
                        Quests Joined
                      </div>
                    </div>
                    

                  </div>
                </div>

                {/* Adventures Organized */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 border-2 border-neon-purple/30 backdrop-blur-sm shadow-lg overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-neon-purple/20 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-neon-pink/15 to-transparent rounded-full blur-lg"></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-purple/10 border-2 border-neon-purple/40 flex items-center justify-center shadow-lg">
                        <Crown className="w-6 h-6 text-neon-purple" />
                  </div>
                      <div className="w-2 h-2 rounded-full bg-neon-purple"></div>
                    </div>
                    
                    {/* Main Number - Primary Focus */}
                    <div className="mb-2">
                      <div className="text-4xl font-bold text-neon-purple leading-none mb-1">
                        {isLoading ? '...' : profileData.stats.adventuresOrganized}
                      </div>
                      <div className="text-sm font-bold text-neon-purple/80 uppercase tracking-wide">
                        Quests Organized
                      </div>
                    </div>
                    

                  </div>
                </div>
              </div>



              {/* Community Badges Showcase */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 text-center">Community Badges</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Social Butterfly Badge */}
                  <div className="gaming-panel p-4 text-center border border-neon-pink/30 bg-gradient-to-br from-neon-pink/10 to-neon-pink/5">
                    <div className="text-3xl mb-2">🦋</div>
                    <div className="text-xs font-bold text-neon-pink mb-1">Social Butterfly</div>
                    <div className="text-lg font-bold text-neon-pink mb-1">12</div>
                    <div className="text-xs text-muted-foreground">Great fun to hang with</div>
                  </div>

                  {/* Knight Badge */}
                  <div className="gaming-panel p-4 text-center border border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/10 to-neon-cyan/5">
                    <div className="text-3xl mb-2">⚔️</div>
                    <div className="text-xs font-bold text-neon-cyan mb-1">Knight</div>
                    <div className="text-lg font-bold text-neon-cyan mb-1">8</div>
                    <div className="text-xs text-muted-foreground">Thanks for saving the day!</div>
                  </div>

                  {/* Seedling Badge */}
                  <div className="gaming-panel p-4 text-center border border-neon-green/30 bg-gradient-to-br from-neon-green/10 to-neon-green/5">
                    <div className="text-3xl mb-2">🌱</div>
                    <div className="text-xs font-bold text-neon-green mb-1">Seedling</div>
                    <div className="text-lg font-bold text-neon-green mb-1">3</div>
                    <div className="text-xs text-muted-foreground">Kudos on stepping out of your house</div>
                      </div>

                  {/* Slight Crush Badge */}
                  <div className="gaming-panel p-4 text-center border border-neon-orange/30 bg-gradient-to-br from-neon-orange/10 to-neon-orange/5">
                    <div className="text-3xl mb-2">💝</div>
                    <div className="text-xs font-bold text-neon-orange mb-1">Slight Crush</div>
                    <div className="text-lg font-bold text-neon-orange mb-1">6</div>
                    <div className="text-xs text-muted-foreground">Call me maybe?</div>
                    </div>
                </div>
                
                {/* Badge Summary */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gaming-panel border border-neon-cyan/30">
                    <Star className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm font-bold text-neon-cyan">29 Total Badges Received</span>
                    <Star className="w-4 h-4 text-neon-cyan" />
              </div>
                </div>
              </div>


            </div>
          </div>



          {/* Recent Activity */}
          <div className="mb-6">
            <div className="gaming-panel p-4 border border-neon-purple/30">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-neon-purple" />
                <h3 className="font-bold text-foreground uppercase tracking-wider">Recent Heroics</h3>
              </div>
              <div className="space-y-3">
                {profileData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg gaming-panel">
                    <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                      <span className="text-sm">⚡</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">{activity}</div>
                      <div className="text-xs text-muted-foreground">{index === 0 ? '2 days ago' : index === 1 ? '5 days ago' : '1 week ago'}</div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Banner for Incomplete Profiles */}
      {!isProfileCompleted && (
        <div className="px-4 pt-2 pb-4">
          <div className="gaming-panel p-4 border-2 border-neon-cyan/50 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-pink/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 opacity-50 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Complete your profile</h3>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ready to become a hero? Complete your profile to unlock your adventure dashboard and start your epic journey! ⚡
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
            
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neon-cyan/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-neon-purple/20 to-transparent" />
          </div>
        </div>
      )}
    </div>
  )
}