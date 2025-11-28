import { populateChatData } from './populate-chat-data'

// Run the population script
const runPopulateChats = async () => {
  try {
    console.log('🚀 Starting chat data population...')
    
    const result = await populateChatData()
    
    if (result.success) {
      console.log('✅ Chat data population completed successfully!')
      console.log(`📊 Created ${result.chatCount} chats`)
      console.log('🎯 Chat IDs:', result.chatIds)
    } else {
      console.log('❌ Chat data population failed')
    }
    
  } catch (error) {
    console.error('💥 Error running chat data population:', error)
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runPopulateChats()
}

export { runPopulateChats }
