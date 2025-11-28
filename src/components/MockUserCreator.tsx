import { useState } from 'react'
import { Button } from './ui/button'
import { createQuestChat, addChatParticipant, sendMessage } from '../firebase/chats'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

const mockUsers = [
  {
    uid: 'mock_user_1',
    email: 'alex.gamer@gmail.com',
    displayName: 'Alex Gaming',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    username: 'AlexGamer',
    age: 24,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Gaming enthusiast and board game collector. Always up for a good challenge!',
    personalityType: 'extrovert',
    interests: ['Gaming', 'Technology', 'Sports', 'Social'],
    savedQuests: [],
    joinedQuests: []
  },
  {
    uid: 'mock_user_2',
    email: 'sarah.photographer@gmail.com',
    displayName: 'Sarah Lens',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    username: 'SarahLens',
    age: 28,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Professional photographer with a passion for capturing life\'s beautiful moments.',
    personalityType: 'ambivert',
    interests: ['Photography', 'Art', 'Travel', 'Creative'],
    savedQuests: [],
    joinedQuests: []
  },
  {
    uid: 'mock_user_3',
    email: 'mike.sports@gmail.com',
    displayName: 'Mike Volleyball',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    username: 'MikeVolleyball',
    age: 26,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Beach volleyball player and fitness enthusiast. Love the competitive spirit!',
    personalityType: 'extrovert',
    interests: ['Sports', 'Fitness', 'Beach', 'Competition'],
    savedQuests: [],
    joinedQuests: []
  },
  {
    uid: 'mock_user_4',
    email: 'priya.foodie@gmail.com',
    displayName: 'Priya Foodie',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    username: 'PriyaFoodie',
    age: 23,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Food blogger and street food explorer. Always hunting for the next delicious discovery!',
    personalityType: 'extrovert',
    interests: ['Food', 'Travel', 'Culture', 'Social'],
    savedQuests: [],
    joinedQuests: []
  },
  {
    uid: 'mock_user_5',
    email: 'david.coder@gmail.com',
    displayName: 'David Code',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    username: 'DavidCode',
    age: 29,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Full-stack developer passionate about AI and machine learning. Building the future one line at a time.',
    personalityType: 'introvert',
    interests: ['Technology', 'AI', 'Programming', 'Learning'],
    savedQuests: [],
    joinedQuests: []
  },
  {
    uid: 'mock_user_6',
    email: 'emma.yoga@gmail.com',
    displayName: 'Emma Zen',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    username: 'EmmaZen',
    age: 31,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Certified yoga instructor and wellness coach. Helping people find peace and balance.',
    personalityType: 'ambivert',
    interests: ['Yoga', 'Wellness', 'Meditation', 'Fitness'],
    savedQuests: [],
    joinedQuests: []
  },
  {
    uid: 'mock_user_7',
    email: 'james.bookworm@gmail.com',
    displayName: 'James Reader',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    username: 'JamesReader',
    age: 35,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Literature professor and book club organizer. Stories are the best way to understand life.',
    personalityType: 'introvert',
    interests: ['Books', 'Literature', 'Discussion', 'Learning'],
    savedQuests: [],
    joinedQuests: []
  },
  {
    uid: 'mock_user_8',
    email: 'lisa.adventure@gmail.com',
    displayName: 'Lisa Explorer',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    username: 'LisaExplorer',
    age: 27,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Travel blogger and adventure seeker. Life is too short to stay in one place!',
    personalityType: 'extrovert',
    interests: ['Travel', 'Adventure', 'Photography', 'Social'],
    savedQuests: [],
    joinedQuests: []
  }
]

export function MockUserCreator() {
  const { user } = useFirebase()
  const [creationResults, setCreationResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (result: string) => {
    setCreationResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const clearResults = () => {
    setCreationResults([])
  }

  const createMockUsers = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    addResult('🔄 Starting mock user creation...')
    
    try {
      for (const mockUser of mockUsers) {
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
          savedQuests: mockUser.savedQuests || [],
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
      
      addResult('✅ All mock users created successfully!')
      toast.success('Mock users created successfully!')
      
    } catch (error: any) {
      addResult(`❌ User creation failed: ${error.message}`)
      console.error('Mock user creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addUsersToExistingChats = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    addResult('🔄 Adding mock users to existing chats...')
    
    try {
      // Get existing chats
      const { getUserChats } = await import('../firebase/chats')
      const chats = await getUserChats(user.uid)
      
      if (chats.length === 0) {
        addResult('⚠️ No existing chats found. Create chats first.')
        return
      }

      for (const chat of chats) {
        addResult(`💬 Adding users to chat: ${chat.questTitle}`)
        
        // Add 2-3 random mock users to each chat
        const shuffledUsers = [...mockUsers].sort(() => 0.5 - Math.random())
        const usersToAdd = shuffledUsers.slice(0, Math.floor(Math.random() * 3) + 2)
        
        for (const mockUser of usersToAdd) {
          try {
            await addChatParticipant(chat.id, mockUser.uid)
            addResult(`👤 Added ${mockUser.displayName} to ${chat.questTitle}`)
          } catch (error) {
            addResult(`⚠️ Could not add ${mockUser.displayName}: ${error}`)
          }
        }
        
        // Add some messages from mock users
        for (const mockUser of usersToAdd.slice(0, 2)) {
          const messages = [
            `Hey everyone! Looking forward to this event! 🎉`,
            `Count me in! This sounds amazing! 😊`,
            `What time should we meet? ⏰`,
            `I'm bringing some snacks for everyone! 🍕`,
            `This is going to be so much fun! Can't wait! 🚀`,
            `Anyone else excited about this? 🙌`,
            `Perfect! I've been looking forward to this! 🎯`,
            `Let's make this the best event ever! 💪`
          ]
          
          const randomMessage = messages[Math.floor(Math.random() * messages.length)]
          
          try {
            await sendMessage(
              chat.id,
              mockUser.uid,
              mockUser.displayName,
              mockUser.photoURL,
              randomMessage,
              'text'
            )
            addResult(`💬 ${mockUser.displayName} sent: "${randomMessage}"`)
          } catch (error) {
            addResult(`⚠️ Could not send message from ${mockUser.displayName}: ${error}`)
          }
        }
      }
      
      addResult('✅ Mock users added to chats successfully!')
      toast.success('Mock users added to chats!')
      
    } catch (error: any) {
      addResult(`❌ Failed to add users to chats: ${error.message}`)
      console.error('Add users to chats error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCompleteMockEnvironment = async () => {
    clearResults()
    addResult('🚀 Creating complete mock environment...')
    await createMockUsers()
    await addUsersToExistingChats()
    addResult('🎉 Complete mock environment created!')
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-green-50">
      <h3 className="text-lg font-bold">Mock User Creator</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Create realistic mock users and add them to your chats for a more engaging experience.
        </p>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Mock Users:</strong> {mockUsers.length} users with complete profiles</p>
          <p><strong>Includes:</strong> Alex Gaming, Sarah Lens, Mike Volleyball, Priya Foodie, David Code, Emma Zen, James Reader, Lisa Explorer</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={createCompleteMockEnvironment}
            disabled={loading || !user}
            className="bg-green-500 hover:bg-green-600"
          >
            {loading ? 'Creating...' : 'Create Complete Environment'}
          </Button>
          
          <Button 
            onClick={createMockUsers}
            disabled={loading || !user}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-50"
          >
            Create Mock Users Only
          </Button>
          
          <Button 
            onClick={addUsersToExistingChats}
            disabled={loading || !user}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-50"
          >
            Add Users to Chats
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
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-60 overflow-y-auto">
          {creationResults.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
      )}
    </div>
  )
}
