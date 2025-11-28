// Badge system for quest completion tracking
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
  Timestamp
} from 'firebase/firestore'
import { db } from './config'

// Badge collection reference
const badgesRef = collection(db, 'badges')

// Badge data types
export interface Badge {
  id?: string
  questId: string
  giverUid: string // User who gave the badge
  giverName: string
  receiverUid: string // User who received the badge
  receiverName: string
  badgeType: 'butterfly' | 'grass' | 'knight' | 'heart'
  badgeName: string
  badgeIcon: string
  badgeDescription: string
  createdAt: Timestamp
}

export interface QuestBadgeSummary {
  questId: string
  totalParticipants: number
  badgesGiven: number
  badgesReceived: { [uid: string]: Badge[] }
  completionStatus: {
    allBadgesGiven: boolean
    completionPercentage: number
    completedAt?: Timestamp
  }
}

// Give a badge to another user
export const giveBadge = async (badgeData: Omit<Badge, 'id' | 'createdAt'>) => {
  try {
    console.log('🏆 Giving badge:', badgeData)
    
    const docRef = await addDoc(badgesRef, {
      ...badgeData,
      createdAt: serverTimestamp()
    })
    
    console.log('✅ Badge given successfully with ID:', docRef.id)
    
    // Update quest completion status after giving badge (optional for mock quests)
    try {
      await updateQuestCompletionStatus(badgeData.questId)
    } catch (error) {
      console.log('⚠️ Quest completion status update failed (normal for mock quests):', error)
    }
    
    return { id: docRef.id, ...badgeData }
  } catch (error: any) {
    console.error('❌ Error giving badge:', error)
    throw new Error(error.message || 'Failed to give badge')
  }
}

// Get badges for a specific quest
export const getQuestBadges = async (questId: string): Promise<Badge[]> => {
  try {
    console.log(`🔍 [getQuestBadges] Querying badges for questId: "${questId}"`)
    const badgeQuery = query(
      badgesRef,
      where('questId', '==', questId)
      // Note: orderBy removed to avoid requiring composite index
      // Sorting isn't needed for badge statistics anyway
    )
    const querySnapshot = await getDocs(badgeQuery)
    const badges = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge))
    console.log(`✅ [getQuestBadges] Found ${badges.length} badges for questId: "${questId}"`)
    return badges
  } catch (error: any) {
    console.error(`❌ [getQuestBadges] Error fetching badges for questId "${questId}":`, error)
    console.error('   Error code:', error.code)
    console.error('   Error message:', error.message)
    // Return empty array instead of throwing to prevent UI breaks
    return []
  }
}

// Get badges given by a specific user in a quest
export const getBadgesGivenByUser = async (questId: string, giverUid: string): Promise<Badge[]> => {
  try {
    console.log(`🔍 [getBadgesGivenByUser] Querying badges for questId: "${questId}", giverUid: "${giverUid}"`)
    const badgeQuery = query(
      badgesRef,
      where('questId', '==', questId),
      where('giverUid', '==', giverUid)
    )
    const querySnapshot = await getDocs(badgeQuery)
    const badges = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge))
    console.log(`✅ [getBadgesGivenByUser] Found ${badges.length} badges given by user for questId: "${questId}"`)
    return badges
  } catch (error: any) {
    console.error(`❌ [getBadgesGivenByUser] Error fetching badges for questId "${questId}", giverUid "${giverUid}":`, error)
    console.error('   Error code:', error.code)
    console.error('   Error message:', error.message)
    // Return empty array instead of throwing to prevent UI breaks
    return []
  }
}

// Get badges received by a specific user in a quest
export const getBadgesReceivedByUser = async (questId: string, receiverUid: string): Promise<Badge[]> => {
  try {
    const badgeQuery = query(
      badgesRef,
      where('questId', '==', questId),
      where('receiverUid', '==', receiverUid)
    )
    const querySnapshot = await getDocs(badgeQuery)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge))
  } catch (error: any) {
    console.error('❌ Error fetching badges received by user:', error)
    throw new Error(error.message || 'Failed to fetch badges received by user')
  }
}

// Calculate quest completion status based on badges
export const calculateQuestCompletionStatus = async (
  questId: string, 
  participantUids: string[]
): Promise<QuestBadgeSummary> => {
  try {
    const badges = await getQuestBadges(questId)
    const totalParticipants = participantUids.length
    const expectedBadges = totalParticipants * (totalParticipants - 1) // Each participant gives badges to all others
    
    // Group badges by receiver
    const badgesReceived: { [uid: string]: Badge[] } = {}
    participantUids.forEach(uid => {
      badgesReceived[uid] = badges.filter(badge => badge.receiverUid === uid)
    })
    
    const badgesGiven = badges.length
    const allBadgesGiven = badgesGiven >= expectedBadges
    const completionPercentage = Math.min(100, (badgesGiven / expectedBadges) * 100)
    
    return {
      questId,
      totalParticipants,
      badgesGiven,
      badgesReceived,
      completionStatus: {
        allBadgesGiven,
        completionPercentage,
        completedAt: allBadgesGiven ? serverTimestamp() as Timestamp : undefined
      }
    }
  } catch (error: any) {
    console.error('❌ Error calculating quest completion status:', error)
    throw new Error(error.message || 'Failed to calculate quest completion status')
  }
}

// Update quest completion status in the quest document
export const updateQuestCompletionStatus = async (questId: string) => {
  try {
    // Import quest functions here to avoid circular dependency
    const { getQuestById, updateQuest } = await import('./quests')
    
    const quest = await getQuestById(questId)
    if (!quest || !quest.participants) {
      console.log('⚠️ Quest not found in Firebase or has no participants:', questId)
      console.log('⚠️ This is normal for mock quests - badges will be saved but quest status won\'t be updated')
      return null
    }
    
    const completionStatus = await calculateQuestCompletionStatus(questId, quest.participants)
    
    // Update quest status if all badges are given
    if (completionStatus.completionStatus.allBadgesGiven && quest.status !== 'completed') {
      await updateQuest(questId, {
        status: 'completed',
        completedAt: serverTimestamp()
      })
      console.log('🎉 Quest marked as completed!', questId)
    }
    
    return completionStatus
  } catch (error: any) {
    console.error('❌ Error updating quest completion status:', error)
    console.log('⚠️ This is normal for mock quests - badges will be saved but quest status won\'t be updated')
    // Don't throw error for mock quests - just log it
    return null
  }
}

// Get user's badge statistics
export const getUserBadgeStats = async (userId: string) => {
  try {
    const badgesGivenQuery = query(
      badgesRef,
      where('giverUid', '==', userId)
    )
    const badgesReceivedQuery = query(
      badgesRef,
      where('receiverUid', '==', userId)
    )
    
    const [givenSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(badgesGivenQuery),
      getDocs(badgesReceivedQuery)
    ])
    
    const badgesGiven = givenSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge))
    const badgesReceived = receivedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge))
    
    // Count badges by type
    const badgesGivenByType = badgesGiven.reduce((acc, badge) => {
      acc[badge.badgeType] = (acc[badge.badgeType] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const badgesReceivedByType = badgesReceived.reduce((acc, badge) => {
      acc[badge.badgeType] = (acc[badge.badgeType] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    return {
      badgesGiven: badgesGiven.length,
      badgesReceived: badgesReceived.length,
      badgesGivenByType,
      badgesReceivedByType,
      totalBadges: badgesGiven.length + badgesReceived.length
    }
  } catch (error: any) {
    console.error('❌ Error fetching user badge stats:', error)
    throw new Error(error.message || 'Failed to fetch user badge stats')
  }
}

// Badge type definitions for consistency
export const BADGE_TYPES = {
  butterfly: {
    id: 'butterfly',
    name: 'Social Butterfly',
    icon: '🦋',
    description: 'Great fun to hang with',
    color: 'neon-pink',
    subtitle: 'Made the quest amazing!'
  },
  grass: {
    id: 'grass',
    name: 'Seedling',
    icon: '🌱',
    description: 'Kudos on stepping out of your house',
    color: 'neon-green',
    subtitle: 'Welcome to the adventure!'
  },
  knight: {
    id: 'knight',
    name: 'Knight',
    icon: '⚔️',
    description: 'Thanks for saving the day!',
    color: 'neon-cyan',
    subtitle: 'Led the way brilliantly!'
  },
  heart: {
    id: 'heart',
    name: 'Slight Crush',
    icon: '💝',
    description: 'Call me maybe?',
    color: 'neon-orange',
    subtitle: 'Great connection potential!'
  }
} as const
