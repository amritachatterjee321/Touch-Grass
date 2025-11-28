import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'
import { db } from './config'

export async function quickRemoveQuests() {
  try {
    console.log('🧹 Removing test quest data from Firebase...')
    
    // Remove quests
    const questsRef = collection(db, 'quests')
    const questsSnapshot = await getDocs(questsRef)
    console.log(`Found ${questsSnapshot.size} quests to delete`)
    
    for (const questDoc of questsSnapshot.docs) {
      await deleteDoc(doc(db, 'quests', questDoc.id))
      const title = questDoc.data().title || questDoc.id
      console.log(`✓ Deleted quest: ${title}`)
    }
    
    // Remove test chats  
    const chatsRef = collection(db, 'chats')
    const chatsSnapshot = await getDocs(chatsRef)
    console.log(`Found ${chatsSnapshot.size} chats to delete`)
    
    for (const chatDoc of chatsSnapshot.docs) {
      await deleteDoc(doc(db, 'chats', chatDoc.id))
      const title = chatDoc.data().questTitle || chatDoc.id
      console.log(`✓ Deleted chat: ${title}`)
    }
    
    // Remove test messages
    const messagesRef = collection(db, 'messages')
    const messagesSnapshot = await getDocs(messagesRef)
    console.log(`Found ${messagesSnapshot.size} messages to delete`)
    
    for (const messageDoc of messagesSnapshot.docs) {
      await deleteDoc(doc(db, 'messages', messageDoc.id))
    }
    console.log(`✓ Deleted ${messagesSnapshot.size} messages`)
    
    console.log('✅ All test quest data removed successfully!')
  } catch (error) {
    console.error('Failed to remove test data:', error);
  }
}

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  quickRemoveQuests()
}
