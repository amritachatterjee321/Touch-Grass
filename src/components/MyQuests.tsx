import { useState, useEffect } from "react"
import { Calendar, MapPin, Settings, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { getOrCreateQuestChat, getUserChats } from "../firebase/chats"
import { useFirebase } from "../contexts/FirebaseContext"
import { getQuestById, unsaveQuest } from "../firebase/quests"
import { getUserProfile } from "../firebase/users"
import { getQuestBadges, getBadgesGivenByUser } from "../firebase/badges"
import { JoinQuestModal } from "./JoinQuestModal"

const initialMockOrganizedQuests = [
  {
    id: '1',
    title: 'Board Game Tournament',
    date: '2025-10-05',
    time: '7:00 PM',
    location: 'Downtown Café',
    category: 'Social',
    description: 'Join us for a fun evening of board games! Perfect for meeting new people and having great conversations.'
  },
  {
    id: '2', 
    title: 'Photography Walk',
    date: '2025-10-10',
    time: '9:00 AM',
    location: 'City Park',
    category: 'Creative',
    description: 'Explore the city through your lens. Bring your camera and let\'s capture some amazing shots together!'
  },
  {
    id: '5',
    title: 'Sunset Beach Volleyball',
    date: '2025-10-12',
    time: '5:30 PM',
    location: 'Marina Beach',
    category: 'Sports',
    description: 'Fun beach volleyball tournament at sunset! All skill levels welcome. Bring your energy and competitive spirit! 🏐'
  },
  {
    id: '6',
    title: 'Street Food Night Walk',
    date: '2025-10-15',
    time: '7:00 PM',
    location: 'VV Puram Food Street',
    category: 'Food',
    description: 'Explore the best street food Bangalore has to offer! We\'ll try local favorites and hidden gems. Come hungry! 🌮'
  },
  {
    id: '7',
    title: 'Coding Hackathon: AI Edition',
    date: '2025-10-20',
    time: '10:00 AM',
    location: 'Tech Hub, Whitefield',
    category: 'Tech',
    description: '24-hour hackathon focused on AI and machine learning projects. Team up, code, and compete for prizes! 💻🤖'
  },
  {
    id: '3',
    title: 'Hiking Adventure',
    date: '2024-08-25',
    time: '6:00 AM',
    location: 'Mountain Trail',
    category: 'Adventure',
    description: 'Early morning hike to catch the sunrise. Great workout and even better views!'
  },
  {
    id: '4',
    title: 'Coffee Shop Exploration',
    date: '2024-08-20',
    time: '10:00 AM',
    location: 'Koramangala',
    category: 'Social',
    description: 'Discovered amazing hidden coffee gems with an awesome squad!'
  }
]

// Mock join requests for organized quests
const mockJoinRequests = [
  {
    id: 'req_001',
    questId: '1',
    questTitle: 'Board Game Tournament',
    questDate: '2025-10-05',
    questTime: '7:00 PM',
    questLocation: 'Downtown Café',
    userId: 'user_123',
    username: 'AdventureSeeker_Raj',
    age: 26,
    city: 'Bangalore',
    profileImage: null,
    interests: ['Board Games', 'Social', 'Food & Drinks'],
    bio: 'Love competitive board games and meeting new people! Always up for strategic challenges and good conversations over coffee.',
    personalityType: 'extrovert',
    personalMessage: 'Hey! I\'ve been playing board games for 5+ years and would love to join this tournament. I\'m particularly good at strategy games like Settlers of Catan and Ticket to Ride. Can bring my own games too if needed! 🎲',
    requestedAt: '2024-01-15T10:30:00Z',
    status: 'pending'
  },
  {
    id: 'req_002', 
    questId: '2',
    questTitle: 'Photography Walk',
    questDate: '2025-10-10',
    questTime: '9:00 AM',
    questLocation: 'City Park',
    userId: 'user_456',
    username: 'ShutterBug_Priya',
    age: 24,
    city: 'Bangalore',
    profileImage: null,
    interests: ['Photography', 'Creative', 'Outdoor Adventures'],
    bio: 'Passionate photographer specializing in street and portrait photography. Love capturing candid moments and exploring the city through my lens! 📸',
    personalityType: 'introvert',
    personalMessage: 'Hi! I\'m really interested in this photography walk. I have a DSLR and some experience with composition and lighting. Would love to learn from other photographers and explore new spots in the city. I can also help with tips for portrait photography if anyone\'s interested! 📷✨',
    requestedAt: '2024-01-16T14:20:00Z',
    status: 'pending'
  },
  {
    id: 'req_003',
    questId: '5',
    questTitle: 'Sunset Beach Volleyball',
    questDate: '2025-10-12',
    questTime: '5:30 PM',
    questLocation: 'Marina Beach',
    userId: 'user_789',
    username: 'SportsEnthusiast_Karthik',
    age: 29,
    city: 'Chennai',
    profileImage: null,
    interests: ['Sports', 'Beach Activities', 'Team Games', 'Fitness'],
    bio: 'Former college volleyball player, now playing for fun! Love team sports and making new connections through athletics. 🏐',
    personalityType: 'extrovert',
    personalMessage: 'Super excited about this! I played volleyball in college and would love to get back into it. Can help coach beginners if needed. Let\'s make this an amazing match! 💪',
    requestedAt: '2024-09-28T09:15:00Z',
    status: 'pending'
  },
  {
    id: 'req_004',
    questId: '5',
    questTitle: 'Sunset Beach Volleyball',
    questDate: '2025-10-12',
    questTime: '5:30 PM',
    questLocation: 'Marina Beach',
    userId: 'user_890',
    username: 'BeachLover_Anjali',
    age: 23,
    city: 'Chennai',
    profileImage: null,
    interests: ['Beach Sports', 'Outdoor Activities', 'Social Events'],
    bio: 'New to volleyball but eager to learn! Love spending time at the beach and meeting active people. Always ready for an adventure! 🌊',
    personalityType: 'ambivert',
    personalMessage: 'I\'m a complete beginner at volleyball but really want to try it! Hope that\'s okay. I\'m a quick learner and super enthusiastic. Can\'t wait for sunset vibes and good energy! ☀️',
    requestedAt: '2024-09-29T11:45:00Z',
    status: 'pending'
  },
  {
    id: 'req_005',
    questId: '6',
    questTitle: 'Street Food Night Walk',
    questDate: '2025-10-15',
    questTime: '7:00 PM',
    questLocation: 'VV Puram Food Street',
    userId: 'user_234',
    username: 'Foodie_Arjun',
    age: 27,
    city: 'Bangalore',
    profileImage: null,
    interests: ['Food & Drinks', 'Street Food', 'Photography', 'Cultural Exploration'],
    bio: 'Self-proclaimed food critic and street food enthusiast! Love discovering hidden food gems and sharing the experience with fellow foodies. 🍜',
    personalityType: 'extrovert',
    personalMessage: 'This sounds like my dream quest! I know VV Puram pretty well and can recommend some amazing spots. Also love taking food photos for Instagram. Let\'s eat our way through Bangalore! 🌮📸',
    requestedAt: '2024-09-29T16:30:00Z',
    status: 'pending'
  },
  {
    id: 'req_006',
    questId: '6',
    questTitle: 'Street Food Night Walk',
    questDate: '2025-10-15',
    questTime: '7:00 PM',
    questLocation: 'VV Puram Food Street',
    userId: 'user_567',
    username: 'CuriousEater_Meera',
    age: 25,
    city: 'Bangalore',
    profileImage: null,
    interests: ['Food Exploration', 'Cultural Events', 'Social Outings'],
    bio: 'Moved to Bangalore recently and want to explore the local food scene! Open to trying everything at least once. 😋',
    personalityType: 'introvert',
    personalMessage: 'New to the city and this would be a great way to explore! I have some dietary preferences (vegetarian) but excited to try local specialties. Hope to make some foodie friends! 🌱',
    requestedAt: '2024-09-30T08:20:00Z',
    status: 'pending'
  },
  {
    id: 'req_007',
    questId: '7',
    questTitle: 'Coding Hackathon: AI Edition',
    questDate: '2025-10-20',
    questTime: '10:00 AM',
    questLocation: 'Tech Hub, Whitefield',
    userId: 'user_345',
    username: 'CodeNinja_Vikram',
    age: 28,
    city: 'Bangalore',
    profileImage: null,
    interests: ['Coding', 'AI/ML', 'Tech', 'Hackathons', 'Innovation'],
    bio: 'Full-stack developer with a passion for AI and machine learning. Love hackathons and building innovative solutions! 💻',
    personalityType: 'introvert',
    personalMessage: 'Been working with TensorFlow and PyTorch for 2 years. Would love to team up and build something amazing! Have experience in NLP and computer vision. Let\'s create some AI magic! 🤖✨',
    requestedAt: '2024-09-29T13:10:00Z',
    status: 'pending'
  },
  {
    id: 'req_008',
    questId: '7',
    questTitle: 'Coding Hackathon: AI Edition',
    questDate: '2025-10-20',
    questTime: '10:00 AM',
    questLocation: 'Tech Hub, Whitefield',
    userId: 'user_678',
    username: 'DataScientist_Sneha',
    age: 26,
    city: 'Bangalore',
    profileImage: null,
    interests: ['Data Science', 'Machine Learning', 'Python', 'Research'],
    bio: 'Data scientist passionate about using AI for social good. Published researcher with hands-on ML experience. 📊',
    personalityType: 'ambivert',
    personalMessage: 'Really interested in collaborating on AI projects! I specialize in data preprocessing and model optimization. Have won 2 hackathons before. Excited to tackle challenging problems together! 🚀',
    requestedAt: '2024-09-30T10:00:00Z',
    status: 'pending'
  },
  {
    id: 'req_009',
    questId: '7',
    questTitle: 'Coding Hackathon: AI Edition',
    questDate: '2025-10-20',
    questTime: '10:00 AM',
    questLocation: 'Tech Hub, Whitefield',
    userId: 'user_901',
    username: 'UIDesigner_Rohan',
    age: 24,
    city: 'Bangalore',
    profileImage: null,
    interests: ['UI/UX Design', 'Frontend Development', 'Creative Tech'],
    bio: 'UI/UX designer who codes! Can handle both design and frontend implementation. Love making AI tools user-friendly. 🎨',
    personalityType: 'extrovert',
    personalMessage: 'While everyone builds the AI, I can create an amazing user interface! Great at React and have design experience. Perfect combo for a winning hackathon project. Let\'s make AI accessible! 💡',
    requestedAt: '2024-09-30T14:30:00Z',
    status: 'pending'
  }
]

// Saved quests are now loaded from Firebase - see loadedSavedQuests state

// Mock joined quests (request accepted, part of the squad)
const mockJoinedQuests = [
  {
    id: 'joined1',
    title: 'Weekend Gaming Marathon',
    date: '2025-09-07',
    time: '2:00 PM',
    location: 'Gaming Lounge',
    category: 'Social',
    description: 'Epic gaming session with board games, video games, and lots of snacks!',
    organizer: 'GameMaster',
    participants: 12,
    maxParticipants: 15,
    joinedDate: '2025-08-28',
    status: 'confirmed'
  },
  {
    id: 'joined2',
    title: 'Morning Yoga in the Park',
    date: '2025-09-05',
    time: '7:00 AM',
    location: 'Central Park',
    category: 'Adventure',
    description: 'Start your day with peaceful yoga surrounded by nature. Mats provided.',
    organizer: 'YogaGuru',
    participants: 8,
    maxParticipants: 10,
    joinedDate: '2025-08-25',
    status: 'confirmed'
  }
]

interface MyQuestsProps {
  onEditQuest: (quest: any) => void
  onNavigateToChats?: () => void
  onOpenChat?: (chatId: string, questTitle: string) => void
  onViewJoinRequest?: (joinRequest: any) => void
  onOpenQuestFeedback?: (questTitle: string, questId: string) => void
  onQuestSaveToggle?: () => void
  badgesRefreshTrigger?: number
}

export function MyQuests({ onEditQuest, onNavigateToChats, onOpenChat, onViewJoinRequest, onOpenQuestFeedback, onQuestSaveToggle, badgesRefreshTrigger }: MyQuestsProps) {
  const { user } = useFirebase()
  const [activeTab, setActiveTab] = useState<'organized' | 'saved' | 'joined'>('organized')
  const [questCompletionStatus, setQuestCompletionStatus] = useState<{[questId: string]: boolean}>({})
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [selectedQuest, setSelectedQuest] = useState<any>(null)
  const [joinedQuests, setJoinedQuests] = useState(mockJoinedQuests)
  const [organizedQuests] = useState(initialMockOrganizedQuests)
  const [joinRequests] = useState(mockJoinRequests)
  const [loadedSavedQuests, setLoadedSavedQuests] = useState<any[]>([])
  const [isLoadingSavedQuests, setIsLoadingSavedQuests] = useState(false)
  const [firebaseChats, setFirebaseChats] = useState<any[]>([])
  const [questBadgeStats, setQuestBadgeStats] = useState<{[questId: string]: {badgesGiven: number, totalParticipants: number, hasUserGivenBadges: boolean}}>({})

  // Load saved quests from Firebase
  useEffect(() => {
    const loadSavedQuests = async () => {
      if (!user) {
        setLoadedSavedQuests([])
        return
      }

      setIsLoadingSavedQuests(true)
      try {
        const profile = await getUserProfile(user.uid)
        if (profile && profile.savedQuests && profile.savedQuests.length > 0) {
          // Fetch quest details for each saved quest ID
          const questPromises = profile.savedQuests.map(questId => getQuestById(questId))
          const quests = await Promise.all(questPromises)
          // Filter out any null quests (in case a quest was deleted)
          const validQuests = quests.filter(quest => quest !== null)
          setLoadedSavedQuests(validQuests)
        } else {
          setLoadedSavedQuests([])
        }
      } catch (error) {
        console.error('Error loading saved quests:', error)
        setLoadedSavedQuests([])
      } finally {
        setIsLoadingSavedQuests(false)
      }
    }

    loadSavedQuests()
  }, [user])

  // Load Firebase chats
  useEffect(() => {
    const loadFirebaseChats = async () => {
      if (!user) {
        setFirebaseChats([])
        return
      }

      try {
        const chats = await getUserChats(user.uid)
        setFirebaseChats(chats)
      } catch (error) {
        console.error('Error loading Firebase chats:', error)
        setFirebaseChats([])
      }
    }

    loadFirebaseChats()
  }, [user])

  // Load badge statistics for each quest
  useEffect(() => {
    const loadBadgeStats = async () => {
      if (!user) {
        console.log('⚠️ No user logged in, skipping badge stats load')
        setQuestBadgeStats({})
        return
      }

      console.log('🔍 Loading badge statistics for', organizedQuests.length, 'quests')

      const statsPromises = organizedQuests.map(async (quest) => {
        try {
          console.log(`📊 Fetching badges for quest ${quest.id} (${quest.title})`)
          
          // Mock participant UIDs for now - in real app, these would come from the quest data
          const mockParticipantUids = ['user_1', 'user_2', 'user_3', 'user_4', 'user_5']
          
          // Get all badges for this quest
          const allBadges = await getQuestBadges(quest.id)
          console.log(`✅ Quest ${quest.id}: Found ${allBadges.length} badges`)
          
          // Check if current user has given badges
          const userBadges = await getBadgesGivenByUser(quest.id, user.uid)
          console.log(`👤 Quest ${quest.id}: User has given ${userBadges.length} badges`)
          
          // Count unique users who have given badges
          const uniqueGivers = new Set(allBadges.map(badge => badge.giverUid))
          const badgesGiven = uniqueGivers.size
          
          console.log(`📈 Quest ${quest.id}: ${badgesGiven} out of ${mockParticipantUids.length} participants gave badges`)
          
          return {
            questId: quest.id,
            stats: {
              badgesGiven,
              totalParticipants: mockParticipantUids.length,
              hasUserGivenBadges: userBadges.length > 0
            }
          }
        } catch (error) {
          console.error(`❌ Error loading badge stats for quest ${quest.id} (${quest.title}):`, error)
          return {
            questId: quest.id,
            stats: {
              badgesGiven: 0,
              totalParticipants: 5,
              hasUserGivenBadges: false
            }
          }
        }
      })

      try {
        const results = await Promise.all(statsPromises)
        const statsMap = results.reduce((acc, { questId, stats }) => {
          acc[questId] = stats
          return acc
        }, {} as {[questId: string]: {badgesGiven: number, totalParticipants: number, hasUserGivenBadges: boolean}})
        
        console.log('✅ Badge statistics loaded successfully:', statsMap)
        setQuestBadgeStats(statsMap)
      } catch (error) {
        console.error('❌ Error loading badge statistics:', error)
      }
    }

    loadBadgeStats()
  }, [user, organizedQuests, badgesRefreshTrigger])

  // Category color mapping consistent with QuestBoard
  const getCategoryStyle = (category: string) => {
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
      }
    }
    
    return categoryStyles[category as keyof typeof categoryStyles] || {
      background: 'rgba(0, 245, 255, 0.85)', // neon-cyan default
      borderColor: 'var(--neon-cyan)',
      color: 'var(--background)',
      textShadow: '0 0 8px rgba(0, 245, 255, 0.8)'
    }
  }

  const handleManageQuest = (quest: any) => {
    onEditQuest(quest)
  }

  const handleSquadChat = async (quest: any) => {
    if (!user) {
      toast.error('Please log in to access chat')
      return
    }

    try {
      // First check if there's already a Firebase chat for this quest
      const existingChat = firebaseChats.find(chat => chat.questId === quest.id)
      
      if (existingChat) {
        // Use existing Firebase chat
        console.log('Using existing Firebase chat:', existingChat.id)
        if (onOpenChat) {
          onOpenChat(existingChat.id, quest.title)
        } else {
          onNavigateToChats?.()
        }
      } else {
        // Create new chat for this quest
        console.log('Creating new chat for quest:', quest.id)
        const chatId = await getOrCreateQuestChat(quest.id, quest.title, user.uid)
        
        // Refresh Firebase chats list
        const chats = await getUserChats(user.uid)
        setFirebaseChats(chats)
        
        // Open the chat with the actual chat document ID
        if (onOpenChat) {
          onOpenChat(chatId, quest.title)
        } else {
          onNavigateToChats?.()
        }
      }
    } catch (error: any) {
      console.error('Error opening squad chat:', error)
      toast.error('Failed to open chat. Please try again.')
    }
  }

  const handleJoinRequest = (questId: string) => {
    if (!user) {
      toast.error('Please log in to join quests')
      return
    }
    
    // Find the quest in saved quests
    const quest = loadedSavedQuests.find(q => q.id === questId)
    if (!quest) {
      toast.error('Quest not found')
      return
    }
    
    console.log('Opening join quest modal for:', quest)
    setSelectedQuest(quest)
    setIsJoinModalOpen(true)
  }

  const handleQuestJoined = (questId: string) => {
    console.log('Quest joined successfully:', questId)
    
    // Find the quest in saved quests
    const quest = loadedSavedQuests.find(q => q.id === questId)
    if (!quest) {
      console.error('Quest not found in saved quests:', questId)
      return
    }
    
    // Remove from saved quests
    setLoadedSavedQuests(prev => prev.filter(q => q.id !== questId))
    
    // Add to joined quests
    const joinedQuest = {
      ...quest,
      joinedDate: new Date().toISOString().split('T')[0], // Today's date
      status: 'confirmed'
    }
    setJoinedQuests(prev => [...prev, joinedQuest])
    
    // Show success message
    toast.success(`Successfully joined "${quest.title}"! 🎉`, {
      description: 'The quest has been moved to your joined quests.'
    })
    
    // Switch to joined tab to show the newly joined quest
    setActiveTab('joined')
  }

  const handleRemoveFromSaved = async (questId: string) => {
    if (!user) {
      toast.error('Please log in to manage saved quests')
      return
    }

    try {
      await unsaveQuest(user.uid, questId)
      // Remove from local state immediately for better UX
      setLoadedSavedQuests(prev => prev.filter(quest => quest.id !== questId))
      toast.success('Quest removed from saved list')
      // Refresh user profile to update heart icons on quest cards
      if (onQuestSaveToggle) {
        onQuestSaveToggle()
      }
    } catch (error: any) {
      console.error('Error removing quest from saved:', error)
      toast.error(error.message || 'Failed to remove quest')
    }
  }

  const getJoinRequestsForQuest = (questId: string) => {
    return joinRequests.filter(request => request.questId === questId && request.status === 'pending')
  }

  const handleViewJoinRequest = (request: any) => {
    console.log('Review button clicked for request:', request)
    if (onViewJoinRequest) {
      onViewJoinRequest(request)
    } else {
      console.log('onViewJoinRequest prop is not provided')
    }
  }

  const isQuestCompleted = (questDate: string) => {
    const today = new Date()
    const questDateObj = new Date(questDate)
    return questDateObj < today
  }

  const handleQuestFeedback = (questTitle: string, questId: string) => {
    if (onOpenQuestFeedback) {
      onOpenQuestFeedback(questTitle, questId)
    }
  }

  // Update quest completion status based on badge stats
  useEffect(() => {
    const completionMap = Object.entries(questBadgeStats).reduce((acc, [questId, stats]) => {
      // Quest is completed when all participants have given badges
      acc[questId] = stats.badgesGiven >= stats.totalParticipants
      return acc
    }, {} as {[questId: string]: boolean})
    
    setQuestCompletionStatus(completionMap)
  }, [questBadgeStats])

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pt-6">
        <div className="space-y-4 px-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('organized')}
              className={`py-3 px-3 font-bold transition-all uppercase tracking-wider text-sm ${
                activeTab === 'organized' 
                  ? 'gaming-filter active' 
                  : 'gaming-filter'
              }`}
            >
              🏰 MY QUESTS
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 px-3 font-bold transition-all uppercase tracking-wider text-sm ${
                activeTab === 'saved' 
                  ? 'gaming-filter active' 
                  : 'gaming-filter'
              }`}
            >
              💾 SAVED
            </button>
            <button
              onClick={() => setActiveTab('joined')}
              className={`py-3 px-3 font-bold transition-all uppercase tracking-wider text-sm ${
                activeTab === 'joined' 
                  ? 'gaming-filter active' 
                  : 'gaming-filter'
              }`}
            >
              ⚔️ JOINED
            </button>
          </div>

          {activeTab === 'organized' && (
            <div className="space-y-4" style={{ paddingBottom: '200px' }}>
              {organizedQuests.map((quest) => {
                const questCompleted = isQuestCompleted(quest.date)
                const questCompletedByBadges = questCompletionStatus[quest.id] || false
                const pendingRequests = getJoinRequestsForQuest(quest.id)
                
                return (
                  <div key={quest.id} className={`hud-card ${questCompleted ? 'quest-completed' : ''}`}>
                    <div className="p-5">


                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className={`font-bold text-lg ${questCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {quest.title}
                            </h3>
                            <div 
                              className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm ml-3"
                              style={{
                                background: getCategoryStyle(quest.category).background,
                                borderColor: getCategoryStyle(quest.category).borderColor,
                                color: getCategoryStyle(quest.category).color,
                                textShadow: getCategoryStyle(quest.category).textShadow,
                                boxShadow: `0 0 15px ${getCategoryStyle(quest.category).borderColor}30`,
                                opacity: questCompleted ? 0.7 : 1
                              }}
                            >
                              {quest.category}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <div className={`flex items-center gap-2 text-sm ${questCompleted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                              <Calendar className={`w-4 h-4 ${questCompleted ? 'text-neon-green' : 'text-neon-purple'}`} />
                              <span>{quest.date} at {quest.time}</span>
                              {questCompleted && (
                                <span className="ml-2 text-xs font-medium text-neon-green">(Completed)</span>
                              )}
                              {questCompletedByBadges && !questCompleted && (
                                <span className="ml-2 text-xs font-medium text-neon-cyan">(Quest Completed)</span>
                              )}
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${questCompleted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                              <MapPin className="w-4 h-4 text-neon-red" />
                              <span>{quest.location}</span>
                            </div>
                          </div>

                          {/* Only show description for active quests */}
                          {!questCompleted && (
                            <p className="text-sm leading-relaxed text-foreground">
                              {quest.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Join Requests Notification - Only show for active quests */}
                      {!questCompleted && pendingRequests.length > 0 && (
                        <div className="mb-4 relative">
                          <div 
                            className="rounded-xl p-4 border"
                            style={{
                              background: 'linear-gradient(90deg, rgba(234, 88, 12, 0.1) 0%, rgba(2, 132, 199, 0.1) 100%)',
                              borderColor: 'rgba(234, 88, 12, 0.3)',
                              position: 'relative',
                              zIndex: 1
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div 
                                  className="w-3 h-3 rounded-full animate-pulse" 
                                  style={{ backgroundColor: 'var(--neon-orange)' }}
                                ></div>
                                <div>
                                  <div className="text-sm font-bold text-foreground">
                                    {pendingRequests.length} New Join Request{pendingRequests.length > 1 ? 's' : ''}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {pendingRequests.length === 1 ? 'Someone wants to join your quest!' : 'Multiple adventurers want to join!'}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (pendingRequests.length > 0) {
                                    handleViewJoinRequest(pendingRequests[0])
                                  }
                                }}
                                className="neon-button px-4 py-2 text-xs font-bold uppercase tracking-wider"
                              >
                                REVIEW
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}  
                      {(questCompleted || questCompletedByBadges) ? (
                        <div className="space-y-4">
                          {/* Clean Badge-Focused Completion Section */}
                          <div className="relative p-6 rounded-2xl overflow-hidden"
                               style={{
                                 background: 'rgba(255, 255, 255, 0.98)',
                                 border: '2px solid rgba(234, 88, 12, 0.3)'
                               }}>
                            
                            {/* Subtle Animated Background Effects */}
                            <div className="absolute inset-0 opacity-15">
                              <div 
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `radial-gradient(circle at 20% 30%, var(--neon-orange) 1px, transparent 1px), radial-gradient(circle at 80% 70%, var(--neon-pink) 1px, transparent 1px)`,
                                  backgroundSize: '60px 60px, 50px 50px',
                                  animation: 'pulse-radial 4s ease-in-out infinite'
                                }}
                              />
                            </div>


                            
                            {/* Main Content */}
                            <div className="relative z-10">
                              {/* Simple Header */}
                              <div className="text-center mb-5">
                                <div className="text-xl font-bold text-neon-orange mb-2">
                                  {questCompletedByBadges ? 'QUEST COMPLETED!' : 'QUEST COMPLETE!'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {questCompletedByBadges 
                                    ? 'All participants gave badges! Quest officially completed! 🎉'
                                    : 'Show appreciation to your squad ✨'
                                  }
                                </div>
                              </div>

                              {/* Social Stats */}
                              <div className="relative rounded-xl p-4 mb-5 text-center"
                                   style={{
                                     background: 'rgba(255, 255, 255, 0.98)',
                                     border: '1px solid rgba(234, 88, 12, 0.3)'
                                   }}>
                                <div className="text-lg font-bold text-neon-orange mb-2">
                                  {questBadgeStats[quest.id]?.badgesGiven || 0} out of {questBadgeStats[quest.id]?.totalParticipants || 5}
                                </div>
                                <div className="text-sm text-muted-foreground mb-3">squad members gave badges</div>
                                
                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                  <div 
                                    className="bg-gradient-to-r from-neon-orange to-neon-pink h-2 rounded-full" 
                                    style={{ 
                                      width: `${((questBadgeStats[quest.id]?.badgesGiven || 0) / (questBadgeStats[quest.id]?.totalParticipants || 5)) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                                
                                <div className="text-xs text-neon-green">
                                  {questBadgeStats[quest.id]?.hasUserGivenBadges 
                                    ? '✅ You\'ve given badges! Thank you for spreading positivity!' 
                                    : 'Help others stay motivated for future adventures!'}
                                </div>
                              </div>

                              {/* Clean Primary Badge Action - Only show if not completed by badges */}
                              {!questCompletedByBadges && (
                                <button 
                                  onClick={() => handleQuestFeedback(quest.title, quest.id)}
                                  className="w-full p-4 rounded-xl font-bold uppercase tracking-wider text-base mb-4 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
                                  style={{
                                    background: 'linear-gradient(135deg, var(--neon-orange) 0%, var(--neon-pink) 50%, var(--neon-purple) 100%)',
                                    color: 'white',
                                    border: '2px solid var(--neon-orange)'
                                  }}
                                >
                                  <div className="flex items-center justify-center relative z-10">
                                    <span>GIVE BADGES NOW</span>
                                  </div>
                                </button>
                              )}

                              {/* Enhanced Secondary Action */}
                              <button 
                                onClick={() => handleSquadChat(quest)}
                                className="w-full py-3 font-semibold text-sm text-muted-foreground hover:text-neon-cyan transition-all duration-300 flex items-center justify-center gap-2 rounded-lg hover:bg-neon-cyan/10"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span>Chat with squad about memories</span>
                              </button>
                            </div>


                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleManageQuest(quest)}
                            className="gaming-filter py-3 font-bold hover:border-neon-cyan hover:text-neon-cyan transition-all uppercase tracking-wider flex items-center justify-center"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            MANAGE
                          </button>
                          <button 
                            onClick={() => handleSquadChat(quest)}
                            className="gaming-filter py-3 font-bold hover:border-neon-cyan hover:text-neon-cyan transition-all uppercase tracking-wider flex items-center justify-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            SQUAD CHAT
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {organizedQuests.length === 0 && activeTab === 'organized' && (
            <div className="gaming-panel p-8 mx-4">
              <div className="text-center">
                <div className="text-6xl mb-4 pulse-glow">🏰</div>
                <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                  NO QUESTS CREATED
                </h3>
                <p className="text-muted-foreground mb-6">Forge your first adventure to become a legendary guide!</p>
                <button className="neon-button px-8 py-3">
                  🗡️ CREATE FIRST QUEST
                </button>
              </div>
            </div>
          )}

          {/* Saved Quests Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-4" style={{ paddingBottom: '200px' }}>
              {isLoadingSavedQuests ? (
                <div className="gaming-panel p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4 pulse-glow">⏳</div>
                    <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                      LOADING SAVED QUESTS...
                    </h3>
                    <p className="text-muted-foreground">Retrieving your bookmarked adventures</p>
                  </div>
                </div>
              ) : loadedSavedQuests.length === 0 ? (
                <div className="gaming-panel p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4 pulse-glow">💾</div>
                    <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                      NO SAVED QUESTS
                    </h3>
                    <p className="text-muted-foreground mb-6">Bookmark interesting quests to join later!</p>
                    <button className="gaming-filter px-8 py-3 font-bold hover:border-neon-cyan hover:text-neon-cyan transition-all uppercase tracking-wider">
                      🌱 BROWSE QUESTS
                    </button>
                  </div>
                </div>
              ) : (
                loadedSavedQuests.map((quest) => (
                  <div key={quest.id} className="hud-card">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-bold text-lg text-foreground">
                            {quest.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-neon-purple" />
                            <span>{quest.date} at {quest.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-neon-red" />
                            <span>{quest.location}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>Organized by: </span>
                            <span className="text-neon-cyan font-medium">{quest.organizer}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div 
                            className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm"
                            style={{
                              background: getCategoryStyle(quest.category).background,
                              borderColor: getCategoryStyle(quest.category).borderColor,
                              color: getCategoryStyle(quest.category).color,
                              textShadow: getCategoryStyle(quest.category).textShadow,
                              boxShadow: `0 0 15px ${getCategoryStyle(quest.category).borderColor}30`
                            }}
                          >
                            {quest.category}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {quest.description}
                        </p>
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleJoinRequest(quest.id)}
                            className="neon-button flex-1 py-3 font-bold text-sm uppercase tracking-wider flex items-center justify-center"
                          >
                            ⚔️ JOIN QUEST
                          </button>
                          <button 
                            onClick={() => handleRemoveFromSaved(quest.id)}
                            className="gaming-filter px-4 py-3 font-bold hover:border-neon-red hover:text-neon-red transition-all uppercase tracking-wider flex items-center justify-center"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Joined Quests Tab */}
          {activeTab === 'joined' && (
            <div className="space-y-4" style={{ paddingBottom: '200px' }}>
              {joinedQuests.length === 0 ? (
                <div className="gaming-panel p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4 pulse-glow">⚔️</div>
                    <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                      NO JOINED QUESTS
                    </h3>
                    <p className="text-muted-foreground mb-6">Join some adventures to start your journey!</p>
                    <button className="gaming-filter px-8 py-3 font-bold hover:border-neon-cyan hover:text-neon-cyan transition-all uppercase tracking-wider">
                      🌱 BROWSE QUESTS
                    </button>
                  </div>
                </div>
              ) : (
                joinedQuests.map((quest) => (
                  <div key={quest.id} className="hud-card">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-bold text-lg text-foreground">
                            {quest.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-neon-purple" />
                            <span>{quest.date} at {quest.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-neon-red" />
                            <span>{quest.location}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>Organized by: </span>
                            <span className="text-neon-cyan font-medium">{quest.organizer}</span>
                          </div>
                          <div className="text-xs text-neon-green">
                            ✅ Joined on {quest.joinedDate}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div 
                            className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm"
                            style={{
                              background: getCategoryStyle(quest.category).background,
                              borderColor: getCategoryStyle(quest.category).borderColor,
                              color: getCategoryStyle(quest.category).color,
                              textShadow: getCategoryStyle(quest.category).textShadow,
                              boxShadow: `0 0 15px ${getCategoryStyle(quest.category).borderColor}30`
                            }}
                          >
                            {quest.category}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {quest.description}
                        </p>
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSquadChat(quest)}
                            className="gaming-filter w-full py-3 font-bold hover:border-neon-cyan hover:text-neon-cyan transition-all uppercase tracking-wider flex items-center justify-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            SQUAD CHAT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Join Quest Modal */}
      {selectedQuest && (
        <JoinQuestModal
          isOpen={isJoinModalOpen}
          onClose={() => {
            setIsJoinModalOpen(false)
            setSelectedQuest(null)
          }}
          quest={{
            id: selectedQuest.id,
            title: selectedQuest.title,
            organizer: selectedQuest.organizer,
            category: selectedQuest.category,
            location: selectedQuest.location,
            date: selectedQuest.date,
            time: selectedQuest.time
          }}
          userProfile={{
            name: user?.displayName || 'Anonymous',
            bio: 'Adventure seeker looking to join amazing quests!',
            interests: ['Adventure', 'Social', 'Learning'],
            age: 25,
            location: 'Bangalore'
          }}
          onJoinSuccess={handleQuestJoined}
        />
      )}
    </div>
  )
}