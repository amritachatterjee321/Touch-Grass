// Firebase Index Setup Helper
// NOTE: Most indexes must be created manually in Firebase Console
// This file contains index configurations for reference

interface FirebaseIndexConfig {
  collectionId: string
  fields: { fieldPath: string; order: 'ASCENDING' | 'DESCENDING' }[]
  queryScope?: 'COLLECTION' | 'COLLECTION_GROUP'
}

// All required indexes for EventBuddy app
export const requiredIndexes: FirebaseIndexConfig[] = [
  // QUEST INDEXES
  {
    collectionId: 'quests',
    fields: [
      { fieldPath: 'city', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionId: 'quests', 
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionId: 'quests',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'isEpic', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionId: 'quests',
    fields: [
      { fieldPath: 'organizerUid', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionId: 'quests',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  // CHAT INDEXES
  {
    collectionId: 'chats',
    fields: [
      { fieldPath: 'questId', order: 'ASCENDING' }
    ]
  },
  {
    collectionId: 'chats',
    fields: [
      { fieldPath: 'lastMessageAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionId: 'chats',
    fields: [
      { fieldPath: 'participants', order: 'ASCENDING' },
      { fieldPath: 'lastMessageAt', order: 'DESCENDING' }
    ]
  },
  // MESSAGE INDEXES
  {
    collectionId: 'messages',
    fields: [
      { fieldPath: 'chatId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'ASCENDING' }
    ]
  },
  {
    collectionId: 'messages',
    fields: [
      { fieldPath: 'chatId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  // NOTIFICATION INDEXES
  {
    collectionId: 'notifications',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionId: 'notifications',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'isRead', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  // USER INDEXES
  {
    collectionId: 'users',
    fields: [
      { fieldPath: 'city', order: 'ASCENDING' },
      { fieldPath: 'isProfileCompleted', order: 'ASCENDING' }
    ]
  },
  {
    collectionId: 'users',
    fields: [
      { fieldPath: 'city', order: 'ASCENDING' },
      { fieldPath: 'interests', order: 'ASCENDING' }
    ]
  }
]

// Generate manual index creation commands for Firebase Console
export const generateIndexCreationSteps = () => {
  console.log('📋 Manual Index Creation Steps for Firebase Console:')
  console.log('1. Go to: Firebase Console → Firestore Database → Indexes')
  console.log('2. Click "Create Index"')
  console.log('3. For each index below, create manually:\n')
  
  requiredIndexes.forEach((index, i) => {
    console.log(`${i + 1}. Collection ID: ${index.collectionId}`)
    console.log(`   Fields:`)
    index.fields.forEach(field => {
      console.log(`   - ${field.fieldPath} (${field.order === 'ASCENDING' ? 'Ascending' : 'Descending'})`)
    })
    console.log('')
  })
}

// Log all required indexes with setup steps
generateIndexCreationSteps()
