import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'
import { db } from './config'

// Function to clear all test quests
export async function clearTestQuestData(): Promise<void> {
  try {
    console.log('🧹 Starting to clear test quest data from Firebase...')
    
    // Get all quest documents
    const questsRef = collection(db, 'quests')
    const questsSnapshot = await getDocs(questsRef)
    
    console.log(`📊 Found ${questsSnapshot.size} quest documents to delete`)
    
    // Delete each quest document
    const deletePromises = questsSnapshot.docs.map(async (questDoc) => {
      const questTitle = questDoc.data().title || 'Unknown Quest'
      await deleteDoc(doc(db, 'quests', questDoc.id))
      console.log(`🗑️ Deleted quest: ${questTitle}`)
      return questDoc.id
    })
    
    await Promise.all(deletePromises)
    
    console.log('✅ All test quest data cleared successfully!')
    console.log(`📝 Removed ${questsSnapshot.size} quests from Firebase`)
    
  } catch (error) {
    console.error('❌ Error clearing test quest data:', error)
    throw error
  }
}

// Function to clear test chats and messages related to quests
export async function clearTestChatData(): Promise<void> {
  try {
    console.log('🧹 Starting to clear test chat data from Firebase...')
    
    // Get all chat documents
    const chatsRef = collection(db, 'chats')
    const chatsSnapshot = await getDocs(chatsRef)
    
    console.log(`📊 Found ${chatsSnapshot.size} chat documents to delete`)
    
    // Delete each chat
    const deleteChatPromises = chatsSnapshot.docs.map(async (chatDoc) => {
      const questTitle = chatDoc.data().questTitle || 'Unknown Chat'
      await deleteDoc(doc(db, 'chats', chatDoc.id))
      console.log(`🗑️ Deleted chat: ${questTitle}`)
      return chatDoc.id
    })
    
    await Promise.all(deleteChatPromises)
    
    // Get all message documents
    const messagesRef = collection(db, 'messages')
    const messagesSnapshot = await getDocs(messagesRef)
    
    console.log(`📊 Found ${messagesSnapshot.size} message documents to delete`)
    
    // Delete each message
    const deleteMessagePromises = messagesSnapshot.docs.map(async (messageDoc) => {
      const chatId = messageDoc.data().chatId || 'Unknown'
      await deleteDoc(doc(db, 'messages', messageDoc.id))
      console.log(`🗑️ Deleted message from chat ${chatId}`)
      return messageDoc.id
    })
    
    await Promise.all(deleteMessagePromises)
    
    console.log('✅ All test chat and message data cleared successfully!')
    console.log(`📝 Removed ${chatsSnapshot.size} chats and ${messagesSnapshot.size} messages from Firebase`)
    
  } catch (error) {
    console.error('❌ Error clearing test chat data:', error)
    throw error
  }
}

// Function to clear test users (optional - be careful!)
export async function clearTestUsers(): Promise<void> {
  try {
    console.log('🧹 Starting to clear test user data from Firebase...')
    
    // Test user IDs that we know are dummy data
    const testUserIds = [
      'user1', // Rahul
      'user2', // Priya  
      'user3', // Arjun
      'user4', // Kavya
      'currentUser' // Current User
    ]
    
    // Get all user documents
    const usersRef = collection(db, 'users')
    const usersSnapshot = await getDocs(usersRef)
    
    let deletedCount = 0
    
    // Delete test users
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id
      const userData = userDoc.data()
      
      // Only delete if it's a test user
      if (testUserIds.includes(userId)) {
        await deleteDoc(doc(db, 'users', userId))
        console.log(`🗑️ Deleted test user: ${userData.displayName || userId}`)
        deletedCount++
      }
    }
    
    console.log(`✅ Removed ${deletedCount} test users from Firebase`)
    
  } catch (error) {
    console.error('❌ Error clearing test users:', error)
    throw error
  }
}

// Main function to clear all test data
export async function clearAllTestData(): Promise<void> {
  try {
    console.log('🧹 Starting to clear ALL test data from Firebase...')
    
    await clearTestChatData()  // Clear chats & messages first
    await clearTestQuestData() // Then clear quests
    await clearTestUsers()     // Finally clear test users
    
    console.log('🎉 ALL test data cleared successfully from Firebase!')
    
  } catch (error) {
    console.error('❌ Error clearing some test data:', error)
    throw error
  }
}

// Convenience function for just quest cleanup
export async function clearQuestsOnly(): Promise<void> {
  console.log('🎯 Clearing only quest data...')
  await clearTestQuestData()
}

// Export for easy importing
export default {
  clearTestQuestData,
  clearTestChatData, 
  clearTestUsers,
  clearAllTestData,
  clearQuestsOnly
}
