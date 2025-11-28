import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from './config'

// Chat interface based on database schema
export interface Chat {
  id: string
  questId: string
  questTitle: string
  participants: string[]
  lastMessage?: string
  lastMessageAt?: any
  lastMessageBy?: string
  isActive: boolean
  createdBy: string
  createdAt: any
  updatedAt: any
}

// Message interface based on database schema
export interface Message {
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

// Create a new chat for a quest
export const createQuestChat = async (questId: string, questTitle: string, createdBy: string, participants: string[]) => {
  try {
    const chatData = {
      questId,
      questTitle,
      participants,
      isActive: true,
      createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, 'chats'), chatData)
    console.log('✅ Chat created successfully:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ Error creating chat:', error)
    throw new Error(error.message || 'Failed to create chat')
  }
}

// Get all chats for a user (where user is a participant)
export const getUserChats = async (userId: string) => {
  try {
    const chatsRef = collection(db, 'chats')
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const chats: Chat[] = []
    
    querySnapshot.forEach((doc) => {
      chats.push({
        id: doc.id,
        ...doc.data()
      } as Chat)
    })
    
    console.log('✅ User chats fetched successfully:', chats.length)
    return chats
  } catch (error: any) {
    console.error('❌ Error fetching user chats:', error)
    throw new Error(error.message || 'Failed to fetch user chats')
  }
}

// Get chat by ID
export const getChat = async (chatId: string) => {
  try {
    const chatRef = doc(db, 'chats', chatId)
    const chatSnap = await getDoc(chatRef)
    
    if (chatSnap.exists()) {
      const chat = {
        id: chatSnap.id,
        ...chatSnap.data()
      } as Chat
      console.log('✅ Chat fetched successfully:', chat.id)
      return chat
    } else {
      throw new Error('Chat not found')
    }
  } catch (error: any) {
    console.error('❌ Error fetching chat:', error)
    throw new Error(error.message || 'Failed to fetch chat')
  }
}

// Get chat messages
export const getChatMessages = async (chatId: string, limitCount: number = 50) => {
  try {
    const messagesRef = collection(db, 'messages')
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const messages: Message[] = []
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message)
    })
    
    // Sort messages by timestamp in descending order (newest first)
    messages.sort((a, b) => {
      const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp)
      const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp)
      return bTime.getTime() - aTime.getTime()
    })
    console.log('✅ Chat messages fetched successfully:', messages.length)
    return messages
  } catch (error: any) {
    console.error('❌ Error fetching chat messages:', error)
    throw new Error(error.message || 'Failed to fetch chat messages')
  }
}

// Send a message to a chat
export const sendMessage = async (
  chatId: string, 
  senderId: string, 
  senderName: string, 
  senderPhotoURL: string | null,
  content: string,
  messageType: 'text' | 'image' | 'system' = 'text',
  replyTo?: {
    messageId: string
    senderName: string
    content: string
    messageType: 'text' | 'image' | 'system'
  }
) => {
  try {
    const messageData = {
      chatId,
      senderId,
      senderName,
      senderPhotoURL,
      content,
      timestamp: serverTimestamp(),
      messageType,
      isEdited: false,
      ...(replyTo && { replyTo })
    }

    // Add message to messages collection
    const messageRef = await addDoc(collection(db, 'messages'), messageData)
    
    // Update chat with last message info
    const chatRef = doc(db, 'chats', chatId)
    await updateDoc(chatRef, {
      lastMessage: content,
      lastMessageAt: serverTimestamp(),
      lastMessageBy: senderName,
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Message sent successfully:', messageRef.id)
    return messageRef.id
  } catch (error: any) {
    console.error('❌ Error sending message:', error)
    
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Make sure you are authenticated and have access to this chat.')
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase service is currently unavailable. Please try again later.')
    } else if (error.code === 'unauthenticated') {
      throw new Error('You must be signed in to send messages.')
    } else if (error.message?.includes('Firebase configuration')) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.')
    }
    
    throw new Error(error.message || 'Failed to send message')
  }
}

// Add participant to chat
export const addChatParticipant = async (chatId: string, userId: string) => {
  try {
    const chatRef = doc(db, 'chats', chatId)
    await updateDoc(chatRef, {
      participants: arrayUnion(userId),
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Participant added to chat successfully')
  } catch (error: any) {
    console.error('❌ Error adding participant to chat:', error)
    throw new Error(error.message || 'Failed to add participant to chat')
  }
}

// Remove participant from chat
export const removeChatParticipant = async (chatId: string, userId: string) => {
  try {
    const chatRef = doc(db, 'chats', chatId)
    await updateDoc(chatRef, {
      participants: arrayRemove(userId),
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Participant removed from chat successfully')
  } catch (error: any) {
    console.error('❌ Error removing participant from chat:', error)
    throw new Error(error.message || 'Failed to remove participant from chat')
  }
}

// Update chat status (active/inactive)
export const updateChatStatus = async (chatId: string, isActive: boolean) => {
  try {
    const chatRef = doc(db, 'chats', chatId)
    await updateDoc(chatRef, {
      isActive,
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Chat status updated successfully')
  } catch (error: any) {
    console.error('❌ Error updating chat status:', error)
    throw new Error(error.message || 'Failed to update chat status')
  }
}

// Delete chat
export const deleteChat = async (chatId: string) => {
  try {
    const chatRef = doc(db, 'chats', chatId)
    await deleteDoc(chatRef)
    
    console.log('✅ Chat deleted successfully')
  } catch (error: any) {
    console.error('❌ Error deleting chat:', error)
    throw new Error(error.message || 'Failed to delete chat')
  }
}

// Real-time chat listener
export const subscribeToChat = (chatId: string, callback: (chat: Chat | null) => void) => {
  const chatRef = doc(db, 'chats', chatId)
  
  return onSnapshot(chatRef, (doc) => {
    if (doc.exists()) {
      const chat = {
        id: doc.id,
        ...doc.data()
      } as Chat
      callback(chat)
    } else {
      callback(null)
    }
  })
}

// Real-time messages listener
export const subscribeToChatMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesRef = collection(db, 'messages')
  const q = query(
    messagesRef,
    where('chatId', '==', chatId)
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = []
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message)
    })
    
    // Sort messages by timestamp in ascending order (oldest first)
    messages.sort((a, b) => {
      const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp)
      const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp)
      return aTime.getTime() - bTime.getTime()
    })
    
    callback(messages)
  })
}

// Get or create chat for a quest
export const getOrCreateQuestChat = async (questId: string, questTitle: string, userId: string) => {
  try {
    // First, try to find existing chat for this quest
    const chatsRef = collection(db, 'chats')
    const q = query(
      chatsRef,
      where('questId', '==', questId)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      // Chat exists, check if user is a participant
      const existingChat = querySnapshot.docs[0]
      const chatData = existingChat.data() as Chat
      
      if (chatData.participants.includes(userId)) {
        console.log('✅ Found existing chat for quest:', existingChat.id)
        return existingChat.id
      } else {
        // Add user to existing chat
        await addChatParticipant(existingChat.id, userId)
        console.log('✅ Added user to existing quest chat:', existingChat.id)
        return existingChat.id
      }
    } else {
      // Create new chat for quest
      const chatId = await createQuestChat(questId, questTitle, userId, [userId])
      console.log('✅ Created new quest chat:', chatId)
      return chatId
    }
  } catch (error: any) {
    console.error('❌ Error getting or creating quest chat:', error)
    throw new Error(error.message || 'Failed to get or create quest chat')
  }
}
