import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from './config'

/**
 * Migration script to update all quest costs from $ to ₹
 * Run this once to update existing data in Firebase
 */
export const updateQuestCurrency = async () => {
  try {
    console.log('🔄 Starting currency update migration...')
    
    const questsRef = collection(db, 'quests')
    const querySnapshot = await getDocs(questsRef)
    
    let updatedCount = 0
    let skippedCount = 0
    
    const updatePromises = querySnapshot.docs.map(async (questDoc) => {
      const questData = questDoc.data()
      const currentCost = questData.cost
      
      // Check if cost contains dollar sign
      if (currentCost && typeof currentCost === 'string' && currentCost.includes('$')) {
        // Replace $ with ₹
        const newCost = currentCost.replace(/\$/g, '₹')
        
        console.log(`📝 Updating quest "${questData.title}": ${currentCost} → ${newCost}`)
        
        // Update the document
        await updateDoc(doc(db, 'quests', questDoc.id), {
          cost: newCost
        })
        
        updatedCount++
      } else {
        console.log(`⏭️ Skipping quest "${questData.title}" - no dollar sign found (cost: ${currentCost})`)
        skippedCount++
      }
    })
    
    await Promise.all(updatePromises)
    
    console.log('✅ Currency update migration complete!')
    console.log(`📊 Updated: ${updatedCount} quests`)
    console.log(`📊 Skipped: ${skippedCount} quests`)
    
    return {
      success: true,
      updated: updatedCount,
      skipped: skippedCount
    }
    
  } catch (error: any) {
    console.error('❌ Error updating currency:', error)
    throw new Error(error.message || 'Failed to update currency')
  }
}

