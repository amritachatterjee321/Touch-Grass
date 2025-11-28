import { useState, useEffect } from "react"
import { getUserChats, Chat } from "../firebase/chats"
import { toast } from "sonner"

interface ChatsProps {
  onOpenChat: (chatId: string, questTitle: string) => void
  userUid?: string
}

export function Chats({ onOpenChat, userUid }: ChatsProps) {
  const [activeFilter, setActiveFilter] = useState<'active' | 'past'>('active')
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user chats from Firebase
  useEffect(() => {
    if (userUid) {
      loadUserChats()
    } else {
      setChats([])
      setError(null)
    }
  }, [userUid])

  const loadUserChats = async () => {
    if (!userUid) {
      console.log('❌ No userUid provided to Chats component')
      setError('User not authenticated')
      return
    }
    
    console.log('🔄 Loading chats for user:', userUid)
    setLoading(true)
    setError(null)
    try {
      const userChats = await getUserChats(userUid)
      console.log('✅ Loaded chats:', userChats)
      setChats(userChats)
    } catch (error: any) {
      console.error('❌ Error loading user chats:', error)
      const errorMessage = error.message || 'Failed to load chats'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filteredChats = chats.filter(chat => {
    return (activeFilter === 'active' && chat.isActive) ||
           (activeFilter === 'past' && !chat.isActive)
  })

  const handleChatClick = (chatId: string, questTitle: string) => {
    onOpenChat(chatId, questTitle)
  }

  const handleRefresh = () => {
    if (userUid) {
      loadUserChats()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pt-6">

        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Chats</h1>
          <button
            onClick={handleRefresh}
            disabled={loading || !userUid}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title="Refresh chats"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'active', label: 'ACTIVE' },
            { id: 'past', label: 'COMPLETED' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`py-3 px-4 font-bold transition-all uppercase tracking-wider flex-1 ${
                activeFilter === filter.id 
                  ? 'gaming-filter active' 
                  : 'gaming-filter'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="gaming-panel p-4 mb-4 border-l-4 border-red-500 bg-red-50/10">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <div>
                <h3 className="font-bold text-red-500">Error Loading Chats</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-sm text-red-500 hover:text-red-400 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="space-y-4">
          {loading ? (
            <div className="gaming-panel p-8">
              <div className="text-center">
                <div className="text-4xl mb-4 animate-spin">💬</div>
                <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                  LOADING CHATS...
                </h3>
                <p className="text-muted-foreground">Fetching your conversations...</p>
              </div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="gaming-panel p-8">
              <div className="text-center">
                <div className="text-6xl mb-4 pulse-glow">💬</div>
                <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                  NO CHATS FOUND
                </h3>
                <p className="text-muted-foreground mb-6">
                  {activeFilter === 'active' 
                    ? 'Join some quests to start chatting!' 
                    : 'No completed quest chats yet.'
                  }
                </p>
                {activeFilter === 'active' && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      To start chatting, you need to:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Join existing quests from the Quest Board</li>
                      <li>• Create your own quest and wait for people to join</li>
                      <li>• Accept join requests for quests you've created</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const formatLastMessageTime = (timestamp: any) => {
                if (!timestamp) return 'No messages'
                
                const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
                const now = new Date()
                const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
                
                if (diffInMinutes < 1) return 'Just now'
                if (diffInMinutes < 60) return `${diffInMinutes} min ago`
                if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`
                if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`
                return date.toLocaleDateString()
              }

              return (
                <div 
                  key={chat.id} 
                  onClick={() => handleChatClick(chat.id, chat.questTitle)}
                  className="hud-card cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98] touch-manipulation"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-foreground flex-1">
                        {chat.questTitle}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {chat.participants?.length || 0} members
                        </span>
                        {chat.lastMessageAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatLastMessageTime(chat.lastMessageAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {chat.lastMessage ? (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {chat.lastMessageBy && (
                            <span className="font-medium text-foreground">{chat.lastMessageBy}: </span>
                          )}
                          {chat.lastMessage}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}