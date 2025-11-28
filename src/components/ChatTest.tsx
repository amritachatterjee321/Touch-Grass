import { useState } from 'react'
import { Button } from './ui/button'
import { sendMessage, getOrCreateQuestChat, subscribeToChatMessages } from '../firebase/chats'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

export function ChatTest() {
  const { user } = useFirebase()
  const [testMessage, setTestMessage] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])

  const createTestChat = async () => {
    if (!user) {
      toast.error('Please log in first')
      return
    }

    try {
      const id = await getOrCreateQuestChat('test-quest-123', 'Test Quest', user.uid)
      setChatId(id)
      toast.success(`Test chat created: ${id}`)
      
      // Subscribe to messages
      const unsubscribe = subscribeToChatMessages(id, (msgs) => {
        setMessages(msgs)
        console.log('Received messages:', msgs)
      })
      
      // Store unsubscribe function for cleanup
      return () => unsubscribe()
    } catch (error: any) {
      console.error('Error creating test chat:', error)
      toast.error(`Failed to create test chat: ${error.message}`)
    }
  }

  const sendTestMessage = async () => {
    if (!chatId || !user || !testMessage.trim()) {
      toast.error('Please create a chat first and enter a message')
      return
    }

    try {
      await sendMessage(
        chatId,
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL,
        testMessage,
        'text'
      )
      setTestMessage('')
      toast.success('Test message sent!')
    } catch (error: any) {
      console.error('Error sending test message:', error)
      toast.error(`Failed to send message: ${error.message}`)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Chat Test</h2>
      
      <div className="space-y-2">
        <Button onClick={createTestChat} disabled={!user}>
          Create Test Chat
        </Button>
        
        {chatId && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Chat ID: {chatId}</p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message"
                className="flex-1 p-2 border rounded"
              />
              <Button onClick={sendTestMessage} disabled={!testMessage.trim()}>
                Send
              </Button>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold">Messages ({messages.length}):</h3>
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                  <strong>{msg.senderName}:</strong> {msg.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

