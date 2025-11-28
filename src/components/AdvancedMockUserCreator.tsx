import { useState } from 'react'
import { Button } from './ui/button'
import { createQuestChat, addChatParticipant, sendMessage } from '../firebase/chats'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

const advancedMockUsers = [
  {
    uid: 'mock_alex_gaming',
    email: 'alex.gaming@mockuser.com',
    displayName: 'Alex Gaming',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    username: 'AlexGamer',
    age: 24,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Gaming enthusiast and board game collector. Always up for a good challenge!',
    personalityType: 'extrovert',
    interests: ['Gaming', 'Technology', 'Sports', 'Social'],
    mockMessages: [
      'Hey everyone! Ready for some epic gaming? 🎮',
      'I brought my favorite board games! 🎲',
      'This is going to be amazing! Who\'s ready to lose? 😄',
      'Game night is the best night! 🎯'
    ]
  },
  {
    uid: 'mock_sarah_photographer',
    email: 'sarah.lens@mockuser.com',
    displayName: 'Sarah Lens',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    username: 'SarahLens',
    age: 28,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Professional photographer with a passion for capturing life\'s beautiful moments.',
    personalityType: 'ambivert',
    interests: ['Photography', 'Art', 'Travel', 'Creative'],
    mockMessages: [
      'Can\'t wait to capture some amazing shots! 📸',
      'The lighting at this location should be perfect! ✨',
      'I\'ll bring my camera equipment for everyone to use 📷',
      'This photography walk is going to be incredible! 🌅'
    ]
  },
  {
    uid: 'mock_mike_volleyball',
    email: 'mike.volleyball@mockuser.com',
    displayName: 'Mike Volleyball',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    username: 'MikeVolleyball',
    age: 26,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Beach volleyball player and fitness enthusiast. Love the competitive spirit!',
    personalityType: 'extrovert',
    interests: ['Sports', 'Fitness', 'Beach', 'Competition'],
    mockMessages: [
      'Ready to dominate the court! 🏐',
      'Let\'s show them how it\'s done! 💪',
      'I\'m bringing extra water for everyone! 💧',
      'Game on! This is going to be intense! 🔥'
    ]
  },
  {
    uid: 'mock_priya_foodie',
    email: 'priya.foodie@mockuser.com',
    displayName: 'Priya Foodie',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    username: 'PriyaFoodie',
    age: 23,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Food blogger and street food explorer. Always hunting for the next delicious discovery!',
    personalityType: 'extrovert',
    interests: ['Food', 'Travel', 'Culture', 'Social'],
    mockMessages: [
      'I\'m so hungry! Let\'s eat everything! 🍕',
      'I know all the best spots! Follow me! 🗺️',
      'This food walk is going to be legendary! 🌮',
      'Bring your appetite, we\'re going big! 🍜'
    ]
  },
  {
    uid: 'mock_david_coder',
    email: 'david.coder@mockuser.com',
    displayName: 'David Code',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    username: 'DavidCode',
    age: 29,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Full-stack developer passionate about AI and machine learning. Building the future one line at a time.',
    personalityType: 'introvert',
    interests: ['Technology', 'AI', 'Programming', 'Learning'],
    mockMessages: [
      'Let\'s build something amazing! 💻',
      'I\'ve got some cool AI projects to share! 🤖',
      '24 hours of coding? I\'m in! ⏰',
      'Time to hack the future! 🚀'
    ]
  },
  {
    uid: 'mock_emma_yoga',
    email: 'emma.yoga@mockuser.com',
    displayName: 'Emma Zen',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    username: 'EmmaZen',
    age: 31,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Certified yoga instructor and wellness coach. Helping people find peace and balance.',
    personalityType: 'ambivert',
    interests: ['Yoga', 'Wellness', 'Meditation', 'Fitness'],
    mockMessages: [
      'Namaste everyone! Ready to find your zen? 🧘‍♀️',
      'I\'ll bring extra yoga mats for beginners! 🧘‍♂️',
      'Let\'s start the day with peace and energy! ☀️',
      'Yoga in the park is the best way to connect! 🌿'
    ]
  },
  {
    uid: 'mock_james_reader',
    email: 'james.reader@mockuser.com',
    displayName: 'James Reader',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    username: 'JamesReader',
    age: 35,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Literature professor and book club organizer. Stories are the best way to understand life.',
    personalityType: 'introvert',
    interests: ['Books', 'Literature', 'Discussion', 'Learning'],
    mockMessages: [
      'I\'ve read this book three times! 📚',
      'The discussion is going to be fascinating! 🤔',
      'I love how this book explores human nature! 💭',
      'Can\'t wait to hear everyone\'s thoughts! 💬'
    ]
  }
]

export function AdvancedMockUserCreator() {
  const { user } = useFirebase()
  const [creationResults, setCreationResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (result: string) => {
    setCreationResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const clearResults = () => {
    setCreationResults([])
  }

  const createAdvancedMockUsers = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    addResult('🔄 Creating advanced mock users with detailed profiles...')
    
    try {
      for (const mockUser of advancedMockUsers) {
        addResult(`👤 Creating user: ${mockUser.displayName} (${mockUser.username})`)
        
        // Create user profile directly in Firestore
        const { doc, setDoc } = await import('firebase/firestore')
        const { db } = await import('../firebase/config')
        
        const userRef = doc(db, 'users', mockUser.uid)
        const now = new Date()
        
        const userProfile = {
          id: mockUser.uid,
          email: mockUser.email,
          username: mockUser.username,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL,
          providerId: 'mock.com',
          providerUid: mockUser.uid,
          
          // Profile Details
          age: mockUser.age,
          city: mockUser.city,
          gender: mockUser.gender,
          bio: mockUser.bio,
          personalityType: mockUser.personalityType,
          interests: mockUser.interests,
          
          // Profile Management
          profileImage: mockUser.photoURL,
          isProfileCompleted: true,
          
          // Activity Tracking
          questsCreated: [],
          questsJoined: [],
          savedQuests: [],
          totalQuestsCreated: 0,
          totalQuestsJoined: 0,
          
          // Tokens/Achievements
          tokens: 100,
          level: 1,
          experience: 0,
          achievements: [],
          
          // Timestamps
          createdAt: now,
          updatedAt: now,
          lastActiveAt: now
        }
        
        await setDoc(userRef, userProfile)
        
        addResult(`✅ User created: ${mockUser.displayName}`)
      }
      
      addResult('✅ All advanced mock users created successfully!')
      toast.success('Advanced mock users created!')
      
    } catch (error: any) {
      addResult(`❌ User creation failed: ${error.message}`)
      console.error('Advanced mock user creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createRealisticChatEnvironment = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    addResult('🔄 Creating realistic chat environment...')
    
    try {
      // Get existing chats
      const { getUserChats } = await import('../firebase/chats')
      const chats = await getUserChats(user.uid)
      
      if (chats.length === 0) {
        addResult('⚠️ No existing chats found. Create chats first.')
        return
      }

      for (const chat of chats) {
        addResult(`💬 Setting up realistic chat: ${chat.questTitle}`)
        
        // Select 3-4 relevant users based on quest category
        const relevantUsers = selectRelevantUsers(chat.questTitle)
        
        for (const mockUser of relevantUsers) {
          try {
            await addChatParticipant(chat.id, mockUser.uid)
            addResult(`👤 Added ${mockUser.displayName} to ${chat.questTitle}`)
            
            // Add realistic conversation messages
            await addRealisticConversation(chat.id, mockUser)
            
          } catch (error) {
            addResult(`⚠️ Could not add ${mockUser.displayName}: ${error}`)
          }
        }
      }
      
      addResult('✅ Realistic chat environment created!')
      toast.success('Realistic chat environment created!')
      
    } catch (error: any) {
      addResult(`❌ Failed to create realistic environment: ${error.message}`)
      console.error('Realistic environment error:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectRelevantUsers = (questTitle: string) => {
    const title = questTitle.toLowerCase()
    
    if (title.includes('gaming') || title.includes('board game')) {
      return advancedMockUsers.filter(u => u.interests.includes('Gaming'))
    } else if (title.includes('photography') || title.includes('photo')) {
      return advancedMockUsers.filter(u => u.interests.includes('Photography'))
    } else if (title.includes('volleyball') || title.includes('sport')) {
      return advancedMockUsers.filter(u => u.interests.includes('Sports'))
    } else if (title.includes('food') || title.includes('street')) {
      return advancedMockUsers.filter(u => u.interests.includes('Food'))
    } else if (title.includes('coding') || title.includes('hackathon')) {
      return advancedMockUsers.filter(u => u.interests.includes('Technology'))
    } else if (title.includes('yoga') || title.includes('fitness')) {
      return advancedMockUsers.filter(u => u.interests.includes('Fitness'))
    } else if (title.includes('book') || title.includes('discussion')) {
      return advancedMockUsers.filter(u => u.interests.includes('Books'))
    } else {
      // Random selection for other quests
      return advancedMockUsers.sort(() => 0.5 - Math.random()).slice(0, 3)
    }
  }

  const addRealisticConversation = async (chatId: string, mockUser: any) => {
    const messages = mockUser.mockMessages
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    try {
      await sendMessage(
        chatId,
        mockUser.uid,
        mockUser.displayName,
        mockUser.photoURL,
        randomMessage,
        'text'
      )
      addResult(`💬 ${mockUser.displayName}: "${randomMessage}"`)
    } catch (error) {
      addResult(`⚠️ Could not send message from ${mockUser.displayName}: ${error}`)
    }
  }

  const createCompleteAdvancedEnvironment = async () => {
    clearResults()
    addResult('🚀 Creating complete advanced mock environment...')
    await createAdvancedMockUsers()
    await createRealisticChatEnvironment()
    addResult('🎉 Complete advanced mock environment created!')
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-bold">Advanced Mock User Creator</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Create sophisticated mock users with personality-based conversations and smart quest matching.
        </p>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Features:</strong> Smart user matching, personality-based messages, realistic conversations</p>
          <p><strong>Users:</strong> 7 advanced mock users with detailed profiles and contextual messages</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={createCompleteAdvancedEnvironment}
            disabled={loading || !user}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Creating...' : 'Create Advanced Environment'}
          </Button>
          
          <Button 
            onClick={createAdvancedMockUsers}
            disabled={loading || !user}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Create Advanced Users
          </Button>
          
          <Button 
            onClick={createRealisticChatEnvironment}
            disabled={loading || !user}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Create Realistic Chats
          </Button>
          
          <Button 
            onClick={clearResults}
            variant="outline"
          >
            Clear Results
          </Button>
        </div>
      </div>
      
      {creationResults.length > 0 && (
        <div className="bg-black text-blue-400 p-3 rounded font-mono text-sm max-h-60 overflow-y-auto">
          {creationResults.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
      )}
    </div>
  )
}
