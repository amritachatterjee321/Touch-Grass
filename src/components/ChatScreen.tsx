import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Image, MapPin, Reply, MoreVertical, Camera, FileImage, VolumeX, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { toast } from "sonner"
import { sendMessage, subscribeToChatMessages, Message as FirebaseMessage, getChat } from "../firebase/chats"
import { useFirebase } from "../contexts/FirebaseContext"
import { uploadImageToStorage } from "../firebase/storage"

interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderPhotoURL?: string
  content: string
  timestamp: any
  messageType: 'text' | 'image' | 'system'
  isEdited?: boolean
  editedAt?: any
  reactions?: { [userId: string]: string }
  replyTo?: {
    messageId: string
    senderName: string
    content: string
    messageType: 'text' | 'image' | 'system'
  }
}

interface ChatScreenProps {
  chatId: string
  questTitle: string
  onBack: () => void
  onLeaveChat?: () => void
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return 'Just now'
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function ChatScreen({ chatId, questTitle, onBack, onLeaveChat }: ChatScreenProps) {
  const { user } = useFirebase()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [sharingLocation, setSharingLocation] = useState(false)
  const [chatData, setChatData] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Load chat data to check if user is creator
  useEffect(() => {
    if (!chatId) return

    const loadChatData = async () => {
      try {
        const chat = await getChat(chatId)
        setChatData(chat)
      } catch (error) {
        console.error('Error loading chat data:', error)
      }
    }

    loadChatData()
  }, [chatId])

  // Load messages and set up real-time listener
  useEffect(() => {
    if (!chatId) return

    setLoading(true)
    
    // Set up real-time listener for messages
    const unsubscribe = subscribeToChatMessages(chatId, (firebaseMessages: FirebaseMessage[]) => {
      setMessages(firebaseMessages)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || sending) {
      console.log('🚫 Message send blocked:', {
        hasMessage: !!newMessage.trim(),
        hasUser: !!user,
        isSending: sending
      })
      return
    }

    console.log('🚀 Attempting to send message:', {
      chatId,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      message: newMessage,
      hasReplyData: !!replyingTo
    })

    setSending(true)
    try {
      const replyData = replyingTo ? {
        messageId: replyingTo.id,
        senderName: replyingTo.senderName,
        content: replyingTo.content,
        messageType: replyingTo.messageType
      } : undefined

      console.log('📤 Calling sendMessage with data:', {
        chatId,
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        senderPhotoURL: user.photoURL,
        content: newMessage,
        messageType: 'text',
        replyData
      })

      const messageId = await sendMessage(
        chatId,
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL,
        newMessage,
        'text',
        replyData
      )
      
      console.log('✅ Message sent successfully, ID:', messageId)
      setNewMessage('')
      setReplyingTo(null)
      toast.success('Message sent!')
    } catch (error: any) {
      console.error('❌ Error sending message:', error)
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
      toast.error(error.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReply = (message: Message) => {
    setReplyingTo(message)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingImage(true)
    setShowImageOptions(false)
    
    try {
      // Upload image to Firebase Storage
      const imagePath = `chat-images/${chatId}/${Date.now()}-${file.name}`
      const imageUrl = await uploadImageToStorage(file, imagePath)
      
      // Send message with image URL
      const replyData = replyingTo ? {
        messageId: replyingTo.id,
        senderName: replyingTo.senderName,
        content: replyingTo.content,
        messageType: replyingTo.messageType
      } : undefined

      await sendMessage(
        chatId,
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL,
        imageUrl,
        'image',
        replyData
      )
      
      setReplyingTo(null)
      toast.success('Image sent!')
    } catch (error: any) {
      console.error('❌ Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleShareLocation = async () => {
    if (!user) return
    
    setSharingLocation(true)
    
    try {
      let locationContent: string
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: false
            })
          })
          
          locationContent = `📍 Location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        } catch (geoError) {
          console.warn('Geolocation error, using fallback:', geoError)
          // Fallback to a default location (or you could show an error)
          locationContent = '📍 Location: Unable to get current location'
          toast.error('Could not get your location. Please check your location permissions.')
          setSharingLocation(false)
          return
        }
      } else {
        locationContent = '📍 Location: Geolocation not supported'
        toast.error('Geolocation is not supported by your browser')
        setSharingLocation(false)
        return
      }
      
      // Send location message
      const replyData = replyingTo ? {
        messageId: replyingTo.id,
        senderName: replyingTo.senderName,
        content: replyingTo.content,
        messageType: replyingTo.messageType
      } : undefined

      await sendMessage(
        chatId,
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL,
        locationContent,
        'text',
        replyData
      )
      
      setReplyingTo(null)
      toast.success('Location shared!')
    } catch (error: any) {
      console.error('❌ Error sharing location:', error)
      toast.error(error.message || 'Failed to share location')
    } finally {
      setSharingLocation(false)
    }
  }


  const handleMuteChat = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      toast.success("Chat muted! You won't receive notifications", {
        description: "You can unmute anytime from the menu"
      })
    } else {
      toast.success("Chat unmuted! You'll receive notifications again")
    }
  }

  const handleLeaveChat = () => {
    // Check if current user is the creator
    if (chatData && user && chatData.createdBy === user.uid) {
      toast.error("Quest creators cannot leave their own quest", {
        description: "You created this quest and need to manage it"
      })
      return
    }

    if (window.confirm('Are you sure you want to leave this quest? You will be removed from the event and won\'t be able to rejoin unless the quest creator invites you again.')) {
      toast.success("Removed from quest successfully", {
        description: "You are no longer part of this adventure"
      })
      onLeaveChat?.()
    }
  }
  
  // Check if current user is the quest creator
  const isQuestCreator = chatData && user && chatData.createdBy === user.uid

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === user?.uid
    
    return (
      <div
        key={message.id}
        className={`flex gap-2 mb-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isCurrentUser ? 'from-neon-pink to-neon-orange' : ''}`}>
          {message.senderName.charAt(0).toUpperCase()}
        </div>

        {/* Message Content */}
        <div className={`flex-1 max-w-[75%] ${isCurrentUser ? 'flex flex-col items-end' : ''}`}>
          {/* Sender Name */}
          {!isCurrentUser && (
            <div className="text-xs font-bold text-foreground mb-1">
              {message.senderName}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`hud-card p-3 relative group ${
              isCurrentUser 
                ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white' 
                : 'bg-input-background text-foreground'
            }`}
          >
            {/* Reply Context */}
            {message.replyTo && (
              <div className={`mb-2 p-2 rounded border-l-2 border-neon-cyan ${isCurrentUser ? 'bg-white/10' : 'bg-muted/50'}`}>
                <div className={`text-xs font-bold mb-1 ${isCurrentUser ? 'text-white/80' : 'text-neon-cyan'}`}>
                  {message.replyTo.senderName}
                </div>
                <div className={`text-xs truncate ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {message.replyTo.messageType === 'image' ? 'Image' : message.replyTo.content}
                </div>
              </div>
            )}

            {/* Message Content Based on Type */}
            {message.messageType === 'text' && (
              <div className="relative">
                <div className="text-sm break-words">
                  {message.content}
                </div>
                {/* Timestamp below text with proper spacing */}
                <div className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            )}

            {message.messageType === 'image' && (
              <div className="relative">
                <img 
                  src={message.content} 
                  alt="Shared image" 
                  className="max-w-full h-auto rounded-lg mb-2"
                  style={{ maxHeight: '200px' }}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs opacity-75 flex-1">Image</div>
                  <div className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            )}

            {message.messageType === 'system' && (
              <div className="relative">
                <div className="text-sm break-words italic text-muted-foreground">
                  {message.content}
                </div>
                {/* Timestamp below text with proper spacing */}
                <div className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            )}

            {/* Reply Button for non-current user messages */}
            {!isCurrentUser && (
              <button
                onClick={() => handleReply(message)}
                className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-muted"
              >
                <Reply className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="gaming-panel p-4 m-4 mb-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-foreground">{questTitle}</h1>
              {isMuted && (
                <VolumeX className="w-4 h-4 text-neon-orange" title="Chat is muted" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {messages.length > 0 ? `${new Set(messages.map(m => m.senderId)).size} members` : 'No members'}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-muted transition-colors">
                <MoreVertical className="w-5 h-5 text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 hud-card border-border bg-card/95 backdrop-blur-md"
            >
              <DropdownMenuItem 
                onClick={handleMuteChat}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <VolumeX className="w-4 h-4 text-neon-orange" />
                <span className="text-sm font-medium">
                  {isMuted ? 'Unmute Chat' : 'Mute Chat'}
                </span>
              </DropdownMenuItem>
              {!isQuestCreator && (
                <DropdownMenuItem 
                  onClick={handleLeaveChat}
                  className="flex items-center gap-3 p-3 hover:bg-destructive/10 cursor-pointer transition-colors text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Leave Quest</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-spin">💬</div>
              <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                LOADING MESSAGES...
              </h3>
              <p className="text-muted-foreground">Fetching conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4 pulse-glow">💬</div>
              <h3 className="font-bold mb-2 text-foreground uppercase tracking-wider">
                NO MESSAGES YET
              </h3>
              <p className="text-muted-foreground mb-6">
                Start the conversation by sending a message!
              </p>
            </div>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="mx-3 hud-card p-2 border-l-2 border-neon-cyan bg-input-background">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-neon-cyan font-bold">
                Replying to {replyingTo.senderName}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {replyingTo.messageType === 'image' ? 'Image' : replyingTo.content}
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-muted-foreground hover:text-foreground ml-2 p-1 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Image Options Menu */}
      {showImageOptions && (
        <div className="mx-3 hud-card p-2.5 mb-2">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors flex-1"
            >
              <FileImage className="w-4 h-4 text-neon-purple" />
              <span className="text-sm">Gallery</span>
            </button>
            <button
              onClick={() => {
                // In real app, would open camera
                fileInputRef.current?.click()
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors flex-1"
            >
              <Camera className="w-4 h-4 text-neon-green" />
              <span className="text-sm">Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-3">
        <div className="hud-card p-2.5">
          <div className="flex items-end gap-2">
            {/* Action Buttons */}
            <div className="flex gap-1">
              <button
                onClick={() => setShowImageOptions(!showImageOptions)}
                disabled={uploadingImage || sending}
                className="p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                {uploadingImage ? (
                  <div className="w-5 h-5 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
                ) : (
                  <Image className="w-5 h-5 text-neon-purple" />
                )}
              </button>
              
              <button
                onClick={handleShareLocation}
                disabled={sharingLocation || sending}
                className="p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                {sharingLocation ? (
                  <div className="w-5 h-5 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5 text-neon-green" />
                )}
              </button>
            </div>

            {/* Message Input */}
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full resize-none rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all p-2 mobile-form-input"
                rows={1}
                style={{ minHeight: '36px', maxHeight: '120px', fontSize: '16px', pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.currentTarget.focus()
                }}
                onTouchStart={(e) => {
                  e.stopPropagation()
                  e.currentTarget.focus()
                }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="p-2 rounded-lg neon-button disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-[0.95]"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
              <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}