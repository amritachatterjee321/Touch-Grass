import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  updateDoc, 
  deleteDoc,
  query, 
  orderBy, 
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore'
import { db } from './config'

// Quest collection reference
const questsRef = collection(db, 'quests')

// Quest data types
export interface Quest {
  id?: string
  title: string
  description: string
  category: string
  location: string
  date: string
  time: string
  cost: string
  organizerUid?: string
  organizer?: string // Display name for "Posted by"
  image?: string
  status?: 'draft' | 'published' | 'active' | 'completed' | 'cancelled'
  participants?: string[]
  completedAt?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
  city?: string
  joinRequests?: { [uid: string]: {
    name: string
    message: string
    timestamp: Timestamp
  }}
}

// Create a new quest
export const createQuest = async (questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('💾 Adding quest to Firestore with data:', questData)
    
    // Check for required fields to avoid undefined values in where query
    if (!questData.title || !questData.organizerUid || !questData.location) {
      console.error('❌ Required quest fields missing:', { 
        title: questData.title, 
        organizerUid: questData.organizerUid, 
        location: questData.location 
      })
      throw new Error('Required quest fields are missing')
    }
    
    // Check for existing quest with same title from same organizer to prevent duplicates
    const duplicateCheckQuery = query(
      questsRef,
      where('title', '==', questData.title),
      where('organizerUid', '==', questData.organizerUid),
      where('location', '==', questData.location)
    )
    const duplicateSnapshot = await getDocs(duplicateCheckQuery)
    
    if (!duplicateSnapshot.empty) {
      console.warn('⚠️ Duplicate quest detected, avoiding duplicate save:', questData.title)
      const existingDoc = duplicateSnapshot.docs[0]
      return { id: existingDoc.id, ...existingDoc.data() }
    }
    
    // Remove any undefined values before saving to Firestore
    const cleanedQuestData: any = { ...questData }
    Object.keys(cleanedQuestData).forEach(key => {
      if (cleanedQuestData[key] === undefined) {
        delete cleanedQuestData[key]
      }
    })
    
    const docRef = await addDoc(questsRef, {
      ...cleanedQuestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    console.log('✅ Quest added to Firestore with ID:', docRef.id)
    return { id: docRef.id, ...cleanedQuestData }
  } catch (error: any) {
    console.error('❌ Error adding quest to Firestore:', error)
    throw new Error(error.message || 'Failed to create quest')
  }
}

// Get all quests
export const getAllQuests = async () => {
  try {
    const questQuery = query(questsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(questQuery)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest))
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch quests')
  }
}

// Get quest by ID
export const getQuestById = async (questId: string) => {
  try {
    const docRef = doc(db, 'quests', questId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Quest
    } else {
      throw new Error('Quest not found')
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch quest')
  }
}

// Get user's created quests
export const getUserQuests = async (userUid: string) => {
  try {
    const questQuery = query(
      questsRef, 
      where('organizerUid', '==', userUid),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(questQuery)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest))
  } catch (error: any) {
    // If index error, try without orderBy as fallback
    if (error.message?.includes('index') || error.code === 'failed-precondition') {
      console.warn('⚠️ Firestore index not found, falling back to query without orderBy')
      try {
        const questQuery = query(
          questsRef, 
          where('organizerUid', '==', userUid)
        )
        const querySnapshot = await getDocs(questQuery)
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest))
      } catch (fallbackError: any) {
        throw new Error(error.message || 'Failed to fetch user quests. Please create the required Firestore index.')
      }
    }
    throw new Error(error.message || 'Failed to fetch user quests')
  }
}

// Get count of user's created quests (simpler query, no index needed)
export const getUserQuestsCount = async (userUid: string) => {
  try {
    const questQuery = query(
      questsRef, 
      where('organizerUid', '==', userUid)
    )
    const querySnapshot = await getDocs(questQuery)
    return querySnapshot.size
  } catch (error: any) {
    console.error('Error getting user quests count:', error)
    return 0
  }
}

// Update quest
export const updateQuest = async (questId: string, questData: Partial<Quest>) => {
  try {
    const docRef = doc(db, 'quests', questId)
    await updateDoc(docRef, {
      ...questData,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update quest')
  }
}

// Delete quest
export const deleteQuest = async (questId: string) => {
  try {
    const docRef = doc(db, 'quests', questId)
    await deleteDoc(docRef)
    return true
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete quest')
  }
}

// Listen to quests in real-time
export const listenToQuests = (callback: (quests: Quest[]) => void) => {
  const questQuery = query(questsRef, orderBy('createdAt', 'desc'))
  return onSnapshot(questQuery, (snapshot) => {
    console.log('📻 listenToQuests: Received snapshot with', snapshot.docs.length, 'docs')
    const quests = snapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() } as Quest
      console.log('📄 Processed quest:', data.title)
      return data
    })
    callback(quests)
  })
}

// Join quest request
export const sendJoinRequest = async (questId: string, fromUid: string, fromName: string, message: string) => {
  try {
    const docRef = doc(db, 'quests', questId)
    const joinRequest = {
      [fromUid]: {
        name: fromName,
        message,
        timestamp: serverTimestamp()
      }
    }
    
    await updateDoc(docRef, {
      joinRequests: joinRequest
    })
    return true
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send join request')
  }
}

// Save quest to user's saved list
export const saveQuest = async (userId: string, questId: string) => {
  try {
    // This would typically be stored in a user's savedQuests array
    // For now, we'll add it to the user profile
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      savedQuests: arrayUnion(questId),
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error: any) {
    throw new Error(error.message || 'Failed to save quest')
  }
}

// Remove quest from user's saved list
export const unsaveQuest = async (userId: string, questId: string) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      savedQuests: arrayRemove(questId),
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error: any) {
    throw new Error(error.message || 'Failed to unsave quest')
  }
}

// Join a quest (accept join request)
export const joinQuest = async (userId: string, questId: string) => {
  try {
    // Add to user's joined quests
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      joinedQuests: arrayUnion(questId),
      totalQuestsJoined: increment(1),
      updatedAt: serverTimestamp()
    })
    
    // Add to quest's participants
    const questRef = doc(db, 'quests', questId)
    await updateDoc(questRef, {
      participants: arrayUnion(userId),
      updatedAt: serverTimestamp()
    })
    
    return true
  } catch (error: any) {
    throw new Error(error.message || 'Failed to join quest')
  }
}

// Get user's saved quests
export const getUserSavedQuests = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      const savedQuestIds = userData.savedQuests || []
      
      if (savedQuestIds.length === 0) return []
      
      // Fetch quest details for saved quest IDs
      const quests = await Promise.all(
        savedQuestIds.map(async (questId: string) => {
          try {
            const questSnap = await getDoc(doc(db, 'quests', questId))
            if (questSnap.exists()) {
              return { id: questSnap.id, ...questSnap.data() } as Quest
            }
            return null
          } catch (error) {
            console.error(`Error fetching saved quest ${questId}:`, error)
            return null
          }
        })
      )
      
      return quests.filter(quest => quest !== null)
    }
    
    return []
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch saved quests')
  }
}

// Get user's joined quests
export const getUserJoinedQuests = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      const joinedQuestIds = userData.joinedQuests || []
      
      if (joinedQuestIds.length === 0) return []
      
      // Fetch quest details for joined quest IDs
      const quests = await Promise.all(
        joinedQuestIds.map(async (questId: string) => {
          try {
            const questSnap = await getDoc(doc(db, 'quests', questId))
            if (questSnap.exists()) {
              return { id: questSnap.id, ...questSnap.data() } as Quest
            }
            return null
          } catch (error) {
            console.error(`Error fetching joined quest ${questId}:`, error)
            return null
          }
        })
      )
      
      return quests.filter(quest => quest !== null)
    }
    
    return []
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch joined quests')
  }
}

// Mock quest data for testing
const mockQuests = [
  {
    title: 'Board Game Tournament',
    description: 'Join us for an epic board game tournament! We\'ll have games like Catan, Ticket to Ride, and more. Prizes for winners!',
    category: 'Gaming',
    location: 'Community Center',
    city: 'San Francisco',
    date: '2024-02-15',
    time: '18:00',
    cost: '₹15',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500'
  },
  {
    title: 'Photography Walk',
    description: 'Explore the city through your lens! We\'ll visit iconic landmarks and hidden gems. All skill levels welcome.',
    category: 'Photography',
    location: 'Golden Gate Park',
    city: 'San Francisco',
    date: '2024-02-20',
    time: '09:00',
    cost: 'Free',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500'
  },
  {
    title: 'Coffee Crawl Adventure',
    description: 'Discover the best coffee shops in the city! We\'ll visit 5 unique cafes and try their signature drinks.',
    category: 'Food & Drink',
    location: 'Mission District',
    city: 'San Francisco',
    date: '2024-02-25',
    time: '10:00',
    cost: '₹25',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500'
  },
  {
    title: 'Hiking Adventure',
    description: 'Join us for a scenic hike through the mountains! We\'ll explore beautiful trails and enjoy nature.',
    category: 'Outdoor',
    location: 'Mount Tamalpais',
    city: 'Mill Valley',
    date: '2024-03-01',
    time: '08:00',
    cost: '₹10',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500'
  },
  {
    title: 'Art Workshop',
    description: 'Learn watercolor painting techniques from a professional artist. All materials provided!',
    category: 'Arts & Crafts',
    location: 'Art Studio Downtown',
    city: 'San Francisco',
    date: '2024-03-05',
    time: '14:00',
    cost: '₹35',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500'
  }
]

// Function to populate quest data for a specific user
export const populateQuestDataForUser = async (userId: string, userName: string) => {
  try {
    console.log(`🚀 Starting to populate quest data for user: ${userId}...`)
    
    const questIds: string[] = []
    
    // Create quests with the specific user as organizer
    for (const questData of mockQuests) {
      const questDoc = {
        ...questData,
        organizerUid: userId,
        organizer: userName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const questRef = await addDoc(questsRef, questDoc)
      questIds.push(questRef.id)
      console.log(`✅ Created quest: ${questData.title} (ID: ${questRef.id})`)
    }
    
    console.log('🎉 Successfully populated Firebase with user-specific quest data!')
    console.log(`📊 Created ${mockQuests.length} quests for user: ${userId}`)
    
    return {
      success: true,
      questCount: mockQuests.length,
      questIds: questIds
    }
    
  } catch (error) {
    console.error('❌ Error populating quest data for user:', error)
    throw error
  }
}

// Function to populate saved and joined quests for a user
export const populateUserQuestData = async (userId: string) => {
  try {
    console.log(`🚀 Starting to populate user quest data for: ${userId}...`)
    
    // First, create some quests by other users
    const otherUserQuests = [
      {
        title: 'Weekend Hiking Trip',
        description: 'Join us for a beautiful hike through the redwoods! Perfect for nature lovers.',
        category: 'Outdoor',
        location: 'Muir Woods',
        city: 'Mill Valley',
        date: '2024-03-10',
        time: '09:00',
        cost: 'Free',
        difficulty: 'Medium',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
        organizerUid: 'other_user_001',
        organizer: 'Sarah Johnson',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Cooking Class: Italian Cuisine',
        description: 'Learn to make authentic Italian pasta and sauces from scratch!',
        category: 'Food & Drink',
        location: 'Culinary Institute',
        city: 'San Francisco',
        date: '2024-03-15',
        time: '19:00',
        cost: '₹45',
        difficulty: 'Medium',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
        organizerUid: 'other_user_002',
        organizer: 'Marco Rossi',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Yoga in the Park',
        description: 'Morning yoga session in the beautiful park. All levels welcome!',
        category: 'Fitness',
        location: 'Dolores Park',
        city: 'San Francisco',
        date: '2024-03-20',
        time: '08:00',
        cost: '₹10',
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        organizerUid: 'other_user_003',
        organizer: 'Emma Chen',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ]
    
    const otherQuestIds: string[] = []
    
    // Create quests by other users
    for (const questData of otherUserQuests) {
      const questRef = await addDoc(questsRef, questData)
      otherQuestIds.push(questRef.id)
      console.log(`✅ Created other user quest: ${questData.title} (ID: ${questRef.id})`)
    }
    
    // Set some quests as saved and some as joined
    const savedQuestIds = [otherQuestIds[0], otherQuestIds[1]] // First 2 quests saved
    const joinedQuestIds = [otherQuestIds[2]] // Last quest joined
    
    // Now update the user's profile with saved and joined quests
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      
      await updateDoc(userRef, {
        savedQuests: savedQuestIds,
        joinedQuests: joinedQuestIds,
        totalQuestsJoined: joinedQuestIds.length,
        updatedAt: serverTimestamp()
      })
      
      console.log(`✅ Updated user profile with saved quests: ${savedQuestIds.length}`)
      console.log(`✅ Updated user profile with joined quests: ${joinedQuestIds.length}`)
    } else {
      console.log('⚠️ User profile not found, creating basic profile...')
      // Create a basic user profile if it doesn't exist
      await setDoc(userRef, {
        id: userId,
        email: 'user@example.com',
        username: 'testuser',
        displayName: 'Test User',
        age: 25,
        city: 'San Francisco',
        gender: 'Other',
        bio: 'Test user for quest data',
        personalityType: 'ambivert',
        interests: ['gaming', 'photography', 'hiking'],
        isProfileCompleted: true,
        questsCreated: [],
        questsJoined: joinedQuestIds,
        savedQuests: savedQuestIds,
        totalQuestsCreated: 0,
        totalQuestsJoined: joinedQuestIds.length,
        tokens: 100,
        level: 1,
        achievements: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
    
    console.log('🎉 Successfully populated user quest data!')
    console.log(`📊 Created ${otherUserQuests.length} other user quests`)
    console.log(`💾 User has ${savedQuestIds.length} saved quests and ${joinedQuestIds.length} joined quests`)
    
    return {
      success: true,
      otherQuestCount: otherUserQuests.length,
      savedQuestCount: savedQuestIds.length,
      joinedQuestCount: joinedQuestIds.length,
      otherQuestIds: otherQuestIds
    }
    
  } catch (error) {
    console.error('❌ Error populating user quest data:', error)
    throw error
  }
}
