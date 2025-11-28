import { useState } from 'react'
import { Button } from './ui/button'
import { getUserChats, createQuestChat } from '../firebase/chats'
import { populateChatData, populateChatDataForUser } from '../firebase/populate-chat-data'
import { populateQuestDataForUser, populateUserQuestData } from '../firebase/quests'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'
import { ChatTest } from './ChatTest'
import { MessageSendTest } from './MessageSendTest'
import { FirebaseDiagnostic } from './FirebaseDiagnostic'
import { MockChatMigrator } from './MockChatMigrator'
import { MockUserCreator } from './MockUserCreator'
import { AdvancedMockUserCreator } from './AdvancedMockUserCreator'
import { MockUserTest } from './MockUserTest'
import { MockUserLogin } from './MockUserLogin'

export function ChatDebugger() {
  const { user } = useFirebase()
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testChatConnection = async () => {
    if (!user) {
      setDebugInfo('❌ No user authenticated')
      return
    }

    setLoading(true)
    setDebugInfo('🔄 Testing chat connection...\n')
    
    try {
      // Test 1: Check user authentication
      setDebugInfo(prev => prev + `✅ User authenticated: ${user.uid}\n`)
      setDebugInfo(prev => prev + `📧 User email: ${user.email}\n`)
      setDebugInfo(prev => prev + `👤 User name: ${user.displayName}\n\n`)

      // Test 2: Try to fetch user chats
      setDebugInfo(prev => prev + '🔄 Fetching user chats...\n')
      const chats = await getUserChats(user.uid)
      setDebugInfo(prev => prev + `✅ Found ${chats.length} chats\n`)
      
      if (chats.length > 0) {
        setDebugInfo(prev => prev + '📋 Chat details:\n')
        chats.forEach((chat, index) => {
          setDebugInfo(prev => prev + `  ${index + 1}. ${chat.questTitle} (${chat.participants?.length || 0} participants)\n`)
        })
      } else {
        setDebugInfo(prev => prev + '⚠️ No chats found for this user\n')
        setDebugInfo(prev => prev + '💡 Try populating chat data first\n')
      }

    } catch (error: any) {
      console.error('Chat debug error:', error)
      setDebugInfo(prev => prev + `❌ Error: ${error.message}\n`)
      setDebugInfo(prev => prev + '🔍 Check Firebase configuration and security rules\n')
    } finally {
      setLoading(false)
    }
  }

  const createTestChat = async () => {
    if (!user) {
      toast.error('Please log in first')
      return
    }

    setLoading(true)
    try {
      const chatId = await createQuestChat(
        'test-quest-123',
        'Test Quest Chat',
        user.uid,
        [user.uid]
      )
      
      toast.success('Test chat created successfully!')
      setDebugInfo(prev => prev + `✅ Created test chat: ${chatId}\n`)
    } catch (error: any) {
      console.error('Error creating test chat:', error)
      toast.error(`Failed to create test chat: ${error.message}`)
      setDebugInfo(prev => prev + `❌ Failed to create test chat: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const populateTestData = async () => {
    if (!user) {
      toast.error('Please log in first')
      return
    }

    setLoading(true)
    setDebugInfo(prev => prev + `🔄 Populating test data for user: ${user.uid}...\n`)
    
    try {
      const result = await populateChatDataForUser(user.uid)
      
      if (result.success) {
        toast.success(`Successfully created ${result.chatCount} chats with messages!`)
        setDebugInfo(prev => prev + `✅ Created ${result.chatCount} chats successfully!\n`)
        setDebugInfo(prev => prev + `📋 Chat IDs: ${result.chatIds.join(', ')}\n`)
        setDebugInfo(prev => prev + `👤 User included in all chats: ${user.uid}\n`)
        
        // Refresh the chat list
        setTimeout(() => {
          testChatConnection()
        }, 1000)
      } else {
        toast.error('Failed to populate test data')
        setDebugInfo(prev => prev + '❌ Failed to populate test data\n')
      }
    } catch (error: any) {
      console.error('Error populating test data:', error)
      toast.error(`Failed to populate test data: ${error.message}`)
      setDebugInfo(prev => prev + `❌ Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const populateQuestData = async () => {
    if (!user) {
      toast.error('Please log in first')
      return
    }

    setLoading(true)
    setDebugInfo(prev => prev + `🔄 Populating quest data for user: ${user.uid}...\n`)
    
    try {
      const result = await populateQuestDataForUser(user.uid, user.displayName || 'Test User')
      
      if (result.success) {
        toast.success(`Successfully created ${result.questCount} quests!`)
        setDebugInfo(prev => prev + `✅ Created ${result.questCount} quests successfully!\n`)
        setDebugInfo(prev => prev + `📋 Quest IDs: ${result.questIds.join(', ')}\n`)
        setDebugInfo(prev => prev + `👤 User set as organizer: ${user.uid}\n`)
      } else {
        toast.error('Failed to populate quest data')
        setDebugInfo(prev => prev + '❌ Failed to populate quest data\n')
      }
    } catch (error: any) {
      console.error('Error populating quest data:', error)
      toast.error(`Failed to populate quest data: ${error.message}`)
      setDebugInfo(prev => prev + `❌ Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const populateSavedJoinedQuests = async () => {
    if (!user) {
      toast.error('Please log in first')
      return
    }

    setLoading(true)
    setDebugInfo(prev => prev + `🔄 Populating saved/joined quest data for user: ${user.uid}...\n`)
    
    try {
      const result = await populateUserQuestData(user.uid)
      
      if (result.success) {
        toast.success(`Successfully created ${result.otherQuestCount} other quests and updated user profile!`)
        setDebugInfo(prev => prev + `✅ Created ${result.otherQuestCount} other user quests!\n`)
        setDebugInfo(prev => prev + `💾 User has ${result.savedQuestCount} saved quests\n`)
        setDebugInfo(prev => prev + `🎯 User has ${result.joinedQuestCount} joined quests\n`)
        setDebugInfo(prev => prev + `📋 Other Quest IDs: ${result.otherQuestIds.join(', ')}\n`)
      } else {
        toast.error('Failed to populate saved/joined quest data')
        setDebugInfo(prev => prev + '❌ Failed to populate saved/joined quest data\n')
      }
    } catch (error: any) {
      console.error('Error populating saved/joined quest data:', error)
      toast.error(`Failed to populate saved/joined quest data: ${error.message}`)
      setDebugInfo(prev => prev + `❌ Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="gaming-panel p-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">Chat Debugger</h2>
        
        <div className="mb-6 space-y-4">
          <MockChatMigrator />
          <MockUserTest />
          <MockUserCreator />
          <AdvancedMockUserCreator />
          <FirebaseDiagnostic />
          <MessageSendTest />
          <ChatTest />
        </div>
        
        <div className="space-y-4 mb-4">
          <Button 
            onClick={testChatConnection}
            disabled={loading}
            className="neon-button"
          >
            {loading ? 'Testing...' : 'Test Chat Connection'}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              onClick={createTestChat}
              disabled={loading || !user}
              className="gaming-filter flex-1"
            >
              Create Test Chat
            </Button>
            
            <Button 
              onClick={populateTestData}
              disabled={loading || !user}
              className="gaming-filter flex-1"
            >
              Populate Chat Data
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={populateQuestData}
              disabled={loading || !user}
              className="neon-button flex-1"
            >
              Populate Quest Data
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={populateSavedJoinedQuests}
              disabled={loading || !user}
              className="gaming-filter flex-1"
            >
              Populate Saved/Joined Quests
            </Button>
          </div>
        </div>

        {debugInfo && (
          <div className="bg-black/50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-foreground">Debug Output:</h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
              {debugInfo}
            </pre>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p><strong>User Status:</strong> {user ? `Logged in as ${user.email}` : 'Not logged in'}</p>
          <p><strong>User UID:</strong> {user?.uid || 'N/A'}</p>
        </div>
      </div>

      {/* Mock User Login Component */}
      <div className="mt-6">
        <MockUserLogin />
      </div>

      {/* Additional Testing Components */}
      <div className="mt-6 space-y-4">
        <ChatTest />
        <MessageSendTest />
        <FirebaseDiagnostic />
        <MockChatMigrator />
        <MockUserCreator />
        <AdvancedMockUserCreator />
        <MockUserTest />
      </div>
    </div>
  )
}
