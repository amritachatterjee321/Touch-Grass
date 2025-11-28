import { useState } from 'react'
import { Button } from './ui/button'
import { createQuestChat, sendMessage, addChatParticipant } from '../firebase/chats'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

const mockOrganizedQuests = [
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
    location: 'Tech Hub',
    category: 'Tech',
    description: 'Build amazing AI projects in 24 hours! Teams welcome, mentors available. Prizes for best projects! 💻'
  }
]

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
    category: 'Fitness',
    description: 'Start your day with peaceful yoga in nature. All levels welcome!',
    organizer: 'YogaZen',
    participants: 8,
    maxParticipants: 20,
    joinedDate: '2025-08-30',
    status: 'confirmed'
  },
  {
    id: 'joined3',
    title: 'Book Club Discussion',
    date: '2025-09-12',
    time: '6:30 PM',
    location: 'Coffee Corner',
    category: 'Learning',
    description: 'Discussing "The Seven Husbands of Evelyn Hugo". Great book, great conversation!',
    organizer: 'BookWorm',
    participants: 6,
    maxParticipants: 10,
    joinedDate: '2025-09-01',
    status: 'confirmed'
  }
]

export function MockChatMigrator() {
  const { user } = useFirebase()
  const [migrationResults, setMigrationResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (result: string) => {
    setMigrationResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const clearResults = () => {
    setMigrationResults([])
  }

  const migrateOrganizedQuests = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    addResult('🔄 Starting migration of organized quests...')
    
    try {
      for (const quest of mockOrganizedQuests) {
        addResult(`📝 Creating chat for: ${quest.title}`)
        
        // Create chat with user as creator
        const chatId = await createQuestChat(
          quest.id,
          quest.title,
          user.uid,
          [user.uid] // Start with just the creator
        )
        
        addResult(`✅ Chat created: ${chatId}`)
        
        // Add some initial messages
        const initialMessages = [
          `Welcome to the ${quest.title} chat! 🎉`,
          `Event details: ${quest.date} at ${quest.time}`,
          `Location: ${quest.location}`,
          `Description: ${quest.description}`,
          `Looking forward to seeing everyone there!`
        ]
        
        for (const message of initialMessages) {
          await sendMessage(
            chatId,
            user.uid,
            user.displayName || 'Anonymous',
            user.photoURL,
            message,
            'text'
          )
        }
        
        addResult(`💬 Added ${initialMessages.length} initial messages`)
      }
      
      addResult('✅ Organized quests migration completed!')
      toast.success('Organized quests migrated successfully!')
      
    } catch (error: any) {
      addResult(`❌ Migration failed: ${error.message}`)
      console.error('Migration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const migrateJoinedQuests = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    addResult('🔄 Starting migration of joined quests...')
    
    try {
      for (const quest of mockJoinedQuests) {
        addResult(`📝 Creating chat for: ${quest.title}`)
        
        // Create chat with organizer as creator (using a mock organizer ID)
        const organizerId = `organizer_${quest.id}`
        const chatId = await createQuestChat(
          quest.id,
          quest.title,
          organizerId,
          [organizerId] // Start with organizer
        )
        
        addResult(`✅ Chat created: ${chatId}`)
        
        // Add current user as participant
        await addChatParticipant(chatId, user.uid)
        addResult(`👤 Added current user as participant`)
        
        // Add some initial messages from organizer
        const organizerMessages = [
          `Welcome to the ${quest.title} group! 👋`,
          `Event details: ${quest.date} at ${quest.time}`,
          `Location: ${quest.location}`,
          `Description: ${quest.description}`,
          `We have ${quest.participants}/${quest.maxParticipants} participants so far!`
        ]
        
        for (const message of organizerMessages) {
          await sendMessage(
            chatId,
            organizerId,
            quest.organizer,
            null,
            message,
            'text'
          )
        }
        
        // Add a message from current user
        await sendMessage(
          chatId,
          user.uid,
          user.displayName || 'Anonymous',
          user.photoURL,
          `Hey everyone! Looking forward to this event! 🎉`,
          'text'
        )
        
        addResult(`💬 Added ${organizerMessages.length + 1} messages`)
      }
      
      addResult('✅ Joined quests migration completed!')
      toast.success('Joined quests migrated successfully!')
      
    } catch (error: any) {
      addResult(`❌ Migration failed: ${error.message}`)
      console.error('Migration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const migrateAllQuests = async () => {
    clearResults()
    addResult('🚀 Starting full migration...')
    await migrateOrganizedQuests()
    await migrateJoinedQuests()
    addResult('🎉 Full migration completed!')
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-purple-50">
      <h3 className="text-lg font-bold">Mock Chat Migrator</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Convert mock quest chats to real Firebase chats with initial messages.
        </p>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={migrateAllQuests}
            disabled={loading || !user}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {loading ? 'Migrating...' : 'Migrate All Quests'}
          </Button>
          
          <Button 
            onClick={migrateOrganizedQuests}
            disabled={loading || !user}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-50"
          >
            Migrate Organized Quests
          </Button>
          
          <Button 
            onClick={migrateJoinedQuests}
            disabled={loading || !user}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-50"
          >
            Migrate Joined Quests
          </Button>
          
          <Button 
            onClick={clearResults}
            variant="outline"
          >
            Clear Results
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Organized Quests:</strong> {mockOrganizedQuests.length} quests (you're the organizer)</p>
          <p><strong>Joined Quests:</strong> {mockJoinedQuests.length} quests (you're a participant)</p>
        </div>
      </div>
      
      {migrationResults.length > 0 && (
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-60 overflow-y-auto">
          {migrationResults.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
      )}
    </div>
  )
}







