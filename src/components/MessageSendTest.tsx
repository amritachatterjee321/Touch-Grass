import { useState } from 'react'
import { Button } from './ui/button'
import { sendMessage, getChat, getOrCreateQuestChat } from '../firebase/chats'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

export function MessageSendTest() {
  const { user } = useFirebase()
  const [testMessage, setTestMessage] = useState('Test message from debug tool')
  const [chatId, setChatId] = useState('')
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  const clearDebugInfo = () => {
    setDebugInfo([])
  }

  const testChatCreation = async () => {
    if (!user) {
      addDebugInfo('❌ No user authenticated')
      return
    }

    setLoading(true)
    addDebugInfo('🔄 Testing chat creation...')
    
    try {
      const id = await getOrCreateQuestChat('debug-test-quest', 'Debug Test Quest', user.uid)
      setChatId(id)
      addDebugInfo(`✅ Chat created/found: ${id}`)
      
      // Verify chat exists
      const chat = await getChat(id)
      addDebugInfo(`✅ Chat verified: ${chat.questTitle} with ${chat.participants?.length || 0} participants`)
      
    } catch (error: any) {
      addDebugInfo(`❌ Chat creation failed: ${error.message}`)
      console.error('Chat creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testMessageSending = async () => {
    if (!user) {
      addDebugInfo('❌ No user authenticated')
      return
    }

    if (!chatId) {
      addDebugInfo('❌ No chat ID available. Create a chat first.')
      return
    }

    if (!testMessage.trim()) {
      addDebugInfo('❌ No message content')
      return
    }

    setLoading(true)
    addDebugInfo(`🔄 Sending message: "${testMessage}"`)
    addDebugInfo(`📤 To chat: ${chatId}`)
    addDebugInfo(`👤 From user: ${user.uid} (${user.displayName || 'Anonymous'})`)
    
    try {
      const messageId = await sendMessage(
        chatId,
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL,
        testMessage,
        'text'
      )
      
      addDebugInfo(`✅ Message sent successfully! Message ID: ${messageId}`)
      setTestMessage('')
      
    } catch (error: any) {
      addDebugInfo(`❌ Message send failed: ${error.message}`)
      addDebugInfo(`🔍 Error code: ${error.code || 'No code'}`)
      addDebugInfo(`🔍 Error details: ${JSON.stringify(error)}`)
      console.error('Message send error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testFullFlow = async () => {
    clearDebugInfo()
    await testChatCreation()
    if (chatId) {
      await testMessageSending()
    }
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold">Message Send Test</h3>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button 
            onClick={testFullFlow} 
            disabled={loading || !user}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Testing...' : 'Test Full Flow'}
          </Button>
          <Button 
            onClick={clearDebugInfo}
            variant="outline"
          >
            Clear Log
          </Button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message"
            className="flex-1 p-2 border rounded"
          />
          <Button 
            onClick={testMessageSending}
            disabled={loading || !chatId || !testMessage.trim()}
            className="bg-green-500 hover:bg-green-600"
          >
            Send Test Message
          </Button>
        </div>
        
        {chatId && (
          <p className="text-sm text-gray-600">
            Current Chat ID: <code className="bg-gray-200 px-1 rounded">{chatId}</code>
          </p>
        )}
      </div>
      
      {debugInfo.length > 0 && (
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-60 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <div key={index}>{info}</div>
          ))}
        </div>
      )}
    </div>
  )
}

