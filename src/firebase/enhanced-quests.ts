// Enhanced quest management with the full database schema
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  serverTimestamp,
  limit,
  startAfter
} from 'firebase/firestore'
import { db } from './config'

// Enhanced Quest interface
export interface EnhancedQuest {
  id?: string
  // Basic Quest Info
  title: string
  description: string
  category: string
  
  // Location & Timing
  location: string
  address?: string
  latitude?: number
  longitude?: number
  city: string
  date: string
  time: string
  
  // Event Details
  cost: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  maxParticipants?: number
  currentParticipants: number
  
  // Visual & Media
  image?: string
  thumbnail?: string
  
  // Status & Publication
  isPublished: boolean
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  
  // Organizer Info
  organizerUid: string
  organizer: string
  organizerPhotoURL?: string
  
  // Participants & Requests
  participants: string[]
  joinRequests: { [uid: string]: {
    name: string
    message: string
    timestamp: Date
  }}
  
  // Quest Management
  isPrivate: boolean
  tags: string[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  completedAt?: Date
}

// Enhanced quest creation
export const createEnhancedQuest = async (questData: Omit<EnhancedQuest, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const questRef = collection(db, 'quests')
    const docRef = await addDoc(questRef, {
      ...questData,
      currentParticipants: questData.participants?.length || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    // Update organizer's quest count
    const { addQuestToUserCreated } = await import('./users')
    await addQuestToUserCreated(questData.organizerUid, docRef.id)
    
    console.log('✅ Enhanced quest created successfully')
    return { id: docRef.id, ...questData }
  } catch (error: any) {
    console.error('❌ Error creating enhanced quest:', error)
    throw new Error(error.message || 'Failed to create quest')
  }
}

// Get published quests with filtering
export const getPublishedQuests = async (filters: {
  city?: string
  category?: string
  limitCount?: number
} = {}) => {
  try {
    let questQuery = query(
      collection(db, 'quests'),
      where('status', '==', 'published'),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    )
    
    if (filters.city) {
      questQuery = query(questQuery, where('city', '==', filters.city))
    }
    
    if (filters.category) {
      questQuery = query(questQuery, where('category', '==', filters.category))
    }
    
    if (filters.limitCount) {
      questQuery = query(questQuery, limit(filters.limitCount))
    }
    
    const snapshot = await getDocs(questQuery)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnhancedQuest))
  } catch (error: any) {
    console.error('Error fetching published quests:', error)
    throw new Error(`Failed to fetch quests: ${error.message}`)
  }
}

// Get epic/featured quests
export const getEpicQuests = async (city?: string) => {
  try {
    let questQuery = query(
      collection(db, 'quests'),
      where('status', '==', 'published'),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    )
    
    if (city) {
      questQuery = query(questQuery, where('city', '==', city))
    }
    
    const snapshot = await getDocs(questQuery)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnhancedQuest))
  } catch (error: any) {
    console.error('Error fetching epic quests:', error)
    throw new Error(`Failed to fetch epic quests: ${error.message}`)
  }
}

// Join quest request
export const sendJoinQuestRequest = async (
  questId: string, 
  userId: string, 
  userName: string, 
  message: string
) => {
  try {
    const questRef = doc(db, 'quests', questId)
    const joinRequest = {
      [userId]: {
        name: userName,
        message: message,
        timestamp: serverTimestamp()
      }
    }
    
    await updateDoc(questRef, {
      joinRequests: joinRequest
    })
    
    console.log('✅ Join request sent successfully')
    return true
  } catch (error: any) {
    console.error('❌ Error sending join request:', error)
    throw new Error(`Failed to send join request: ${error.message}`)
  }
}

// Accept/Reject join request
export const manageJoinRequest = async (
  questId: string,
  userId: string,
  action: 'accept' | 'reject'
) => {
  try {
    const questRef = doc(db, 'quests', questId)
    const questSnap = await getDoc(questRef)
    
    if (!questSnap.exists()) {
      throw new Error('Quest not found')
    }
    
    const quest = questSnap.data() as EnhancedQuest
    const updates: any = {}
    
    if (action === 'accept') {
      // Add to participants
      updates.participants = [...(quest.participants || []), userId]
      updates.currentParticipants = (quest.currentParticipants || 0) + 1
      
      // Remove from join requests
      const newJoinRequests = { ...quest.joinRequests }
      delete newJoinRequests[userId]
      updates.joinRequests = newJoinRequests
      
      // Add quest to user's joined list
      const { addQuestToUserJoined } = await import('./users')
      await addQuestToUserJoined(userId, questId)
    } else {
      // Just remove from join requests
      const newJoinRequests = { ...quest.joinRequests }
      delete newJoinRequests[userId]
      updates.joinRequests = newJoinRequests
    }
    
    await updateDoc(questRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    
    console.log(`✅ Join request ${action}ed successfully`)
    return true
  } catch (error: any) {
    console.error(`❌ Error ${action}ing join request:`, error)
    throw new Error(`Failed to ${action} join request: ${error.message}`)
  }
}

// Enhanced quest update
export const updateEnhancedQuest = async (questId: string, updates: Partial<EnhancedQuest>) => {
  try {
    const questRef = doc(db, 'quests', questId)
    await updateDoc(questRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Enhanced quest updated successfully')
    return true
  } catch (error: any) {
    console.error('❌ Error updating enhanced quest:', error)
    throw new Error(`Failed to update quest: ${error.message}`)
  }
}

// Publish quest (change status from draft to published)
export const publishQuest = async (questId: string) => {
  return updateEnhancedQuest(questId, {
    status: 'published',
    isPublished: true,
    publishedAt: new Date()
  })
}

// Listen to quests in real-time
export const listenToEnhancedQuests = (callback: (quests: EnhancedQuest[]) => void) => {
  const questQuery = query(
    collection(db, 'quests'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc')
  )
  
  return onSnapshot(questQuery, (snapshot) => {
    const quests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EnhancedQuest))
    callback(quests)
  })
}
