import { clearTestQuestData } from './clear-test-data'

// Quick function to clear only quest data
export async function runQuestCleanup() {
  try {
    console.log('🧹 Removing test quest data from Firebase...')
    await clearTestQuestData()
    console.log('✅ Quest cleanup completed successfully!')
    console.log('📋 You can now add your real quest data without test interference.')
  } catch (error) {
    console.error('❌ Quest cleanup failed:', error)
  }
}

// Immediately run the cleanup
runQuestCleanup()
