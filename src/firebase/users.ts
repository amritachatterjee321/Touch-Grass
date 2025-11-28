// User profile management and operations
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from './config'
import { User } from 'firebase/auth'

// User Profile Type
export interface UserProfile {
  id: string // Firebase Authentication UID (unique user identifier)
  // Basic Auth Info
  email: string
  username: string
  displayName: string
  photoURL?: string
  providerId?: string // Authentication provider (e.g., 'google.com')
  providerUid?: string // Provider-specific UID (Google User ID)
  
  // Profile Details
  age: number
  city: string
  gender: string
  bio: string
  personalityType: 'introvert' | 'extrovert' | 'ambivert'
  interests: string[]
  
  // Profile Management
  profileImage?: string
  isProfileCompleted: boolean
  
  // Activity Tracking
  questsCreated: string[]
  questsJoined: string[]
  savedQuests: string[]
  totalQuestsCreated: number
  totalQuestsJoined: number
  
  // Tokens/Achievements
  tokens: number
  level: number
  achievements: string[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastActiveAt: Date
}

// Create or update user profile
export const createUserProfile = async (
  user: User,
  profileData?: Partial<UserProfile>
) => {
  try {
    const userRef = doc(db, 'users', user.uid)
    const now = new Date()
    
    // Extract provider information (Google authentication data)
    const googleProvider = user.providerData.find(provider => provider.providerId === 'google.com')
    
    const userProfile = {
      id: user.uid, // Firebase Authentication UID (primary identifier)
      email: user.email || '',
      username: user.displayName?.split(' ')[0] || 'Anonymous',
      displayName: user.displayName || 'Anonymous User',
      photoURL: user.photoURL || null,
      providerId: googleProvider?.providerId || 'google.com', // Store authentication provider
      providerUid: googleProvider?.uid || user.uid, // Store Google User ID
      age: profileData?.age || 0,
      city: profileData?.city || '',
      gender: profileData?.gender || '',
      bio: profileData?.bio || '',
      personalityType: profileData?.personalityType || 'introvert',
      interests: profileData?.interests || [],
      profileImage: profileData?.profileImage || null,
      isProfileCompleted: profileData?.isProfileCompleted || false,
      questsCreated: [],
      questsJoined: [],
      totalQuestsCreated: 0,
      totalQuestsJoined: 0,
      tokens: 0,
      level: 1,
      achievements: [],
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
      ...profileData
    }
    
    await setDoc(userRef, userProfile, { merge: true })
    console.log('✅ User profile created/updated successfully')
    console.log(`🔑 User ID: ${user.uid} | Provider: ${userProfile.providerId} | Provider UID: ${userProfile.providerUid}`)
    return userProfile
  } catch (error: any) {
    console.error('❌ Error creating user profile:', error)
    throw new Error(`Failed to create user profile: ${error.message}`)
  }
}

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile
    } else {
      return null
    }
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    throw new Error(`Failed to fetch user profile: ${error.message}`)
  }
}

// Update user profile
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
      lastActiveAt: new Date()
    })
    
    console.log('✅ User profile updated successfully')
    return true
  } catch (error: any) {
    console.error('❌ Error updating user profile:', error)
    throw new Error(`Failed to update user profile: ${error.message}`)
  }
}

// Add quest to user's created quests
export const addQuestToUserCreated = async (userId: string, questId: string) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    questsCreated: arrayUnion(questId),
    totalQuestsCreated: increment(1),
    lastActiveAt: new Date()
  })
}

// Add quest to user's joined quests
export const addQuestToUserJoined = async (userId: string, questId: string) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    questsJoined: arrayUnion(questId),
    totalQuestsJoined: increment(1),
    lastActiveAt: new Date()
  })
}

// Award tokens to user
export const awardTokens = async (userId: string, amount: number, reason?: string) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    tokens: increment(amount),
    lastActiveAt: new Date()
  })
  
  console.log(`✅ Awarded ${amount} tokens to user ${userId}: ${reason || ''}`)
}

// Check if user exists
export const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    return userSnap.exists()
  } catch (error) {
    return false
  }
}

// Get users by city for local quest discovery
export const getUsersInCity = async (city: string) => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(
      usersRef,
      where('city', '==', city),
      where('isProfileCompleted', '==', true)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as UserProfile)
  } catch (error: any) {
    console.error('Error fetching users in city:', error)
    throw new Error(`Failed to fetch users in city: ${error.message}`)
  }
}
