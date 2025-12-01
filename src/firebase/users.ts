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
  Timestamp,
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
  personalityType: 'introvert' | 'extrovert' | 'ambivert' | 'mysterious'
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
    // Validate user object
    if (!user || !user.uid) {
      throw new Error('Invalid user object: user or user.uid is missing')
    }

    const userRef = doc(db, 'users', user.uid)
    
    // Extract provider information (Google authentication data)
    // Handle cases where providerData might not exist (e.g., mock users)
    // For Firebase Auth User objects, providerData is available directly
    const providerData = user.providerData || []
    const googleProvider = Array.isArray(providerData) 
      ? providerData.find((provider: any) => provider?.providerId === 'google.com')
      : null
    
    // Determine provider info - check if it's a mock user or use Google provider
    const isMockUser = !providerData || providerData.length === 0 || (user as any).providerId === 'mock.com'
    const providerId = isMockUser 
      ? ((user as any).providerId || 'mock.com')
      : (googleProvider?.providerId || 'google.com')
    const providerUid = isMockUser
      ? ((user as any).providerUid || user.uid)
      : (googleProvider?.uid || user.uid)
    
    // Use profileData username if provided, otherwise try to extract from displayName
    const username = profileData?.username || 
                     (user.displayName?.split(' ')[0]) || 
                     'Anonymous'
    
    // Convert Date objects to Firestore Timestamps
    const createdAt = profileData?.createdAt 
      ? (profileData.createdAt instanceof Date 
          ? Timestamp.fromDate(profileData.createdAt) 
          : profileData.createdAt)
      : serverTimestamp()
    
    const userProfile = {
      id: user.uid, // Firebase Authentication UID (primary identifier)
      email: user.email || '',
      username: username,
      displayName: profileData?.displayName || user.displayName || username || 'Anonymous User',
      photoURL: user.photoURL || profileData?.profileImage || null,
      providerId: providerId,
      providerUid: providerUid,
      age: profileData?.age || 0,
      city: profileData?.city || '',
      gender: profileData?.gender || '',
      bio: profileData?.bio || '',
      personalityType: profileData?.personalityType || 'introvert',
      interests: profileData?.interests || [],
      profileImage: profileData?.profileImage || user.photoURL || null,
      isProfileCompleted: profileData?.isProfileCompleted || false,
      questsCreated: profileData?.questsCreated || [],
      questsJoined: profileData?.questsJoined || [],
      savedQuests: profileData?.savedQuests || [],
      totalQuestsCreated: profileData?.totalQuestsCreated || 0,
      totalQuestsJoined: profileData?.totalQuestsJoined || 0,
      tokens: profileData?.tokens || 0,
      level: profileData?.level || 1,
      achievements: profileData?.achievements || [],
      createdAt: createdAt,
      updatedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      ...profileData
    }
    
    // Remove any undefined values that might cause issues
    Object.keys(userProfile).forEach(key => {
      if (userProfile[key as keyof typeof userProfile] === undefined) {
        delete userProfile[key as keyof typeof userProfile]
      }
    })
    
    console.log('📝 Creating user profile in Firestore:', {
      uid: user.uid,
      email: user.email,
      providerId: providerId,
      isProfileCompleted: userProfile.isProfileCompleted
    })
    
    await setDoc(userRef, userProfile, { merge: true })
    
    // Verify the document was created
    const createdDoc = await getDoc(userRef)
    if (!createdDoc.exists()) {
      throw new Error('Failed to create user profile document - document does not exist after creation')
    }
    
    console.log('✅ User profile created/updated successfully in Firestore')
    console.log(`🔑 User ID: ${user.uid} | Provider: ${userProfile.providerId} | Provider UID: ${userProfile.providerUid}`)
    console.log('📄 Document data:', createdDoc.data())
    
    return userProfile
  } catch (error: any) {
    console.error('❌ Error creating user profile:', error)
    console.error('❌ User object:', user ? { uid: user.uid, email: user.email } : 'null')
    console.error('❌ Profile data:', profileData)
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

// Delete user account and all associated data
export const deleteUserAccount = async (userId: string, isMockUser: boolean = false) => {
  const errors: string[] = []
  
  try {
    console.log(`🗑️ Starting account deletion for user: ${userId} (Mock: ${isMockUser})`)
    
    // Import quest and chat functions
    const { getUserQuests } = await import('./quests')
    const { getUserChats, removeChatParticipant } = await import('./chats')
    const { deleteAuthUserAccount } = await import('./auth')
    const { getCurrentUser } = await import('./auth')
    
    // 1. Get user profile to find all associated data (optional for mock users)
    let userProfile = null
    try {
      userProfile = await getUserProfile(userId)
      if (!userProfile && !isMockUser) {
        console.log('⚠️ User profile not found in Firestore')
      } else if (!userProfile && isMockUser) {
        console.log('ℹ️ Mock user profile not in Firestore (this is normal)')
      }
    } catch (error: any) {
      console.log('⚠️ Could not fetch user profile:', error.message)
      // For mock users, this is fine - continue
      if (!isMockUser) {
        errors.push(`Could not fetch profile: ${error.message}`)
      }
    }
    
    // 2. Delete or update quests created by the user
    try {
      const userQuests = await getUserQuests(userId)
      console.log(`📋 Found ${userQuests.length} quests created by user`)
      
      for (const quest of userQuests) {
        if (quest.id) {
          try {
            // Delete the quest (this will also remove it from participants' joined lists)
            await deleteDoc(doc(db, 'quests', quest.id))
            console.log(`🗑️ Deleted quest: ${quest.title}`)
          } catch (error: any) {
            console.error(`⚠️ Error deleting quest ${quest.id}:`, error)
            errors.push(`Failed to delete quest: ${quest.title}`)
          }
        }
      }
    } catch (error: any) {
      console.error('⚠️ Error fetching/deleting user quests:', error)
      // For mock users, this might be expected if they have no quests
      if (!isMockUser || error.code !== 'failed-precondition') {
        errors.push(`Error with quests: ${error.message}`)
      }
    }
    
    // 3. Remove user from quests they joined
    try {
      const questsRef = collection(db, 'quests')
      const joinedQuestsQuery = query(
        questsRef,
        where('participants', 'array-contains', userId)
      )
      const joinedQuestsSnapshot = await getDocs(joinedQuestsQuery)
      
      for (const questDoc of joinedQuestsSnapshot.docs) {
        try {
          const questData = questDoc.data()
          const questRef = doc(db, 'quests', questDoc.id)
          
          // Remove user from participants
          await updateDoc(questRef, {
            participants: arrayRemove(userId)
          })
          
          // Remove user from join requests if present
          if (questData.joinRequests && questData.joinRequests[userId]) {
            const newJoinRequests = { ...questData.joinRequests }
            delete newJoinRequests[userId]
            await updateDoc(questRef, {
              joinRequests: newJoinRequests
            })
          }
          
          console.log(`👋 Removed user from quest: ${questData.title}`)
        } catch (error: any) {
          console.error(`⚠️ Error removing user from quest ${questDoc.id}:`, error)
          errors.push(`Failed to remove from quest: ${questDoc.id}`)
        }
      }
    } catch (error: any) {
      console.error('⚠️ Error removing user from joined quests:', error)
      // For mock users, this might be expected
      if (!isMockUser || error.code !== 'failed-precondition') {
        errors.push(`Error with joined quests: ${error.message}`)
      }
    }
    
    // 4. Remove user from all chats
    try {
      const userChats = await getUserChats(userId)
      console.log(`💬 Found ${userChats.length} chats for user`)
      
      for (const chat of userChats) {
        try {
          await removeChatParticipant(chat.id, userId)
          console.log(`👋 Removed user from chat: ${chat.questTitle}`)
        } catch (error: any) {
          console.error(`⚠️ Error removing user from chat ${chat.id}:`, error)
          errors.push(`Failed to remove from chat: ${chat.questTitle}`)
        }
      }
    } catch (error: any) {
      console.error('⚠️ Error removing user from chats:', error)
      // For mock users, this might be expected
      if (!isMockUser || error.code !== 'failed-precondition') {
        errors.push(`Error with chats: ${error.message}`)
      }
    }
    
    // 5. Delete user profile from Firestore (if it exists)
    try {
      const userRef = doc(db, 'users', userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        await deleteDoc(userRef)
        console.log('✅ User profile deleted from Firestore')
      } else {
        console.log('ℹ️ User profile does not exist in Firestore (this is fine for mock users)')
      }
    } catch (error: any) {
      console.error('⚠️ Error deleting user profile:', error)
      // For mock users, if profile doesn't exist, that's fine
      if (!isMockUser || !error.message?.includes('not found')) {
        errors.push(`Error deleting profile: ${error.message}`)
      }
    }
    
    // 6. Delete Firebase Auth account (only for real users, not mock users)
    if (!isMockUser) {
      try {
        const currentUser = getCurrentUser()
        if (currentUser && currentUser.uid === userId) {
          await deleteAuthUserAccount(currentUser)
          console.log('✅ User account deleted from Firebase Auth')
        } else {
          console.log('⚠️ Current user does not match, skipping Auth deletion')
        }
      } catch (error: any) {
        console.error('⚠️ Error deleting Firebase Auth account:', error)
        errors.push(`Error deleting auth account: ${error.message}`)
        // Don't throw - profile is already deleted, auth deletion is secondary
      }
    } else {
      console.log('ℹ️ Mock user - skipping Firebase Auth deletion')
      // Remove mock user from localStorage (do this even if other steps failed)
      try {
        localStorage.removeItem('mockUser')
        window.dispatchEvent(new CustomEvent('mockUserLogout'))
        console.log('✅ Mock user removed from localStorage')
      } catch (error: any) {
        console.error('⚠️ Error removing mock user from localStorage:', error)
        errors.push(`Error removing from localStorage: ${error.message}`)
      }
    }
    
    // If there were errors but we're dealing with a mock user, still consider it successful
    // as long as we cleared localStorage
    if (errors.length > 0) {
      if (isMockUser) {
        console.log('⚠️ Some cleanup steps had errors, but mock user deletion completed')
        console.log('Errors:', errors)
      } else {
        console.warn('⚠️ Some cleanup steps had errors:', errors)
      }
    }
    
    console.log('✅ Account deletion completed successfully')
    return true
  } catch (error: any) {
    console.error('❌ Error deleting user account:', error)
    
    // For mock users, even if there's an error, try to clean up localStorage
    if (isMockUser) {
      try {
        localStorage.removeItem('mockUser')
        window.dispatchEvent(new CustomEvent('mockUserLogout'))
        console.log('✅ Mock user removed from localStorage despite errors')
        // Still return success for mock users if we cleared localStorage
        return true
      } catch (localError: any) {
        console.error('❌ Failed to remove mock user from localStorage:', localError)
      }
    }
    
    throw new Error(`Failed to delete user account: ${error.message}`)
  }
}
