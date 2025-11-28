import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore'
import { db } from './config'

// Mock chat data based on the original structure
const mockChats = [
  {
    questId: 'joined1',
    questTitle: 'Weekend Gaming Marathon',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_007', 'user_008', 'user_009', 'user_010', 'user_011', 'user_012'],
    lastMessage: 'Can\'t wait for tomorrow! I\'m bringing my Nintendo Switch! 🎮',
    lastMessageBy: 'Alex',
    isActive: true,
    createdBy: 'user_001'
  },
  {
    questId: 'joined2',
    questTitle: 'Morning Yoga in the Park',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_007', 'user_008'],
    lastMessage: 'Perfect weather forecast for our session! 🧘‍♀️☀️',
    lastMessageBy: 'Maya',
    isActive: true,
    createdBy: 'user_002'
  },
  {
    questId: 'quest_001',
    questTitle: 'Board Game Tournament',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_007', 'user_008'],
    lastMessage: 'Hey everyone! Just arrived at the venue. See you inside! 🎲',
    lastMessageBy: 'Rahul',
    isActive: true,
    createdBy: 'user_001'
  },
  {
    questId: 'quest_002',
    questTitle: 'Photography Walk',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'],
    lastMessage: 'Uploading some shots from today! Amazing golden hour 📸',
    lastMessageBy: 'Priya',
    isActive: true,
    createdBy: 'user_002'
  },
  {
    questId: 'quest_003',
    questTitle: 'Coffee Crawl Adventure',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_007', 'user_008', 'user_009', 'user_010', 'user_011', 'user_012'],
    lastMessage: 'Next stop is Third Wave! Their cold brew is legendary ☕',
    lastMessageBy: 'Arjun',
    isActive: true,
    createdBy: 'user_003'
  },
  {
    questId: '3',
    questTitle: 'Hiking Adventure',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006'],
    lastMessage: 'Thanks everyone for an amazing trek! Same time next month?',
    lastMessageBy: 'Neha',
    isActive: false,
    createdBy: 'user_004'
  },
  {
    questId: '4',
    questTitle: 'Coffee Shop Exploration',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_007', 'user_008'],
    lastMessage: 'Those dosas were incredible! Best food walk ever 😋',
    lastMessageBy: 'Kavya',
    isActive: false,
    createdBy: 'user_001'
  },
  {
    questId: 'quest_004',
    questTitle: 'Hiking Adventure',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006'],
    lastMessage: 'Thanks everyone for an amazing trek! Same time next month?',
    lastMessageBy: 'Neha',
    isActive: false,
    createdBy: 'user_004'
  },
  {
    questId: 'quest_005',
    questTitle: 'Art Workshop',
    participants: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005', 'user_006', 'user_007', 'user_008', 'user_009', 'user_010'],
    lastMessage: 'Loved the watercolor techniques we learned today! 🎨',
    lastMessageBy: 'Kavya',
    isActive: false,
    createdBy: 'user_005'
  }
]

// Mock messages for each chat
const mockMessages = {
  'joined1': [
    {
      senderId: 'user_002',
      senderName: 'GameMaster',
      content: 'Welcome to the squad everyone! 🎉 I\'ve set up an epic gaming room with consoles and board games!',
      messageType: 'text' as const
    },
    {
      senderId: 'user_003',
      senderName: 'Alex',
      content: 'This is going to be awesome! I\'m bringing my Nintendo Switch with Mario Kart 🏎️',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'Count me in for some Smash Bros! Also bringing Catan and Ticket to Ride 🎲',
      messageType: 'text' as const
    },
    {
      senderId: 'user_004',
      senderName: 'Priya',
      content: 'I\'ll bring snacks! Any dietary restrictions I should know about?',
      messageType: 'text' as const
    },
    {
      senderId: 'user_005',
      senderName: 'Raj',
      content: 'No restrictions here! Maybe some vegetarian options would be great 🌱',
      messageType: 'text' as const
    },
    {
      senderId: 'user_003',
      senderName: 'Alex',
      content: 'Can\'t wait for tomorrow! I\'m bringing my Nintendo Switch! 🎮',
      messageType: 'text' as const
    }
  ],
  'joined2': [
    {
      senderId: 'user_006',
      senderName: 'YogaGuru',
      content: 'Namaste everyone! 🙏 Looking forward to our morning session. Remember to bring water!',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'Hi! This is my first outdoor yoga session. So excited! Do I need to bring my own mat?',
      messageType: 'text' as const
    },
    {
      senderId: 'user_006',
      senderName: 'YogaGuru',
      content: 'Great question! Mats are provided, but feel free to bring your own if you prefer 😊',
      messageType: 'text' as const
    },
    {
      senderId: 'user_007',
      senderName: 'Maya',
      content: 'The sunrise in Central Park is beautiful at this time. Perfect for meditation! 🌅',
      messageType: 'text' as const
    },
    {
      senderId: 'user_008',
      senderName: 'Karthik',
      content: 'I checked the weather - it\'s going to be perfect! Low 70s with clear skies ☀️',
      messageType: 'text' as const
    },
    {
      senderId: 'user_007',
      senderName: 'Maya',
      content: 'Perfect weather forecast for our session! 🧘‍♀️☀️',
      messageType: 'text' as const
    }
  ],
  'quest_001': [
    {
      senderId: 'user_002',
      senderName: 'Rahul',
      content: 'Hey everyone! Just arrived at the venue. See you inside! 🎲',
      messageType: 'text' as const
    },
    {
      senderId: 'user_003',
      senderName: 'Priya',
      content: 'Great! I\'m running 5 minutes late',
      messageType: 'text' as const
    },
    {
      senderId: 'user_002',
      senderName: 'Rahul',
      content: 'No worries! We\'ll wait for you',
      messageType: 'text' as const
    },
    {
      senderId: 'user_004',
      senderName: 'Arjun',
      content: 'https://images.unsplash.com/photo-1580087700722-bf9a33bc5952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwdGFibGUlMjBzZXR1cHxlbnwxfHx8fDE3NTY1Nzk5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      messageType: 'image' as const
    },
    {
      senderId: 'user_005',
      senderName: 'Kavya',
      content: 'Perfect setup! Love the new games you brought',
      messageType: 'text' as const
    }
  ],
  'quest_002': [
    {
      senderId: 'user_003',
      senderName: 'Priya',
      content: 'Uploading some shots from today! Amazing golden hour 📸',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'Those photos look incredible! What camera did you use?',
      messageType: 'text' as const
    },
    {
      senderId: 'user_003',
      senderName: 'Priya',
      content: 'Thanks! I used my Canon EOS R5 with a 24-70mm lens',
      messageType: 'text' as const
    }
  ],
  'quest_003': [
    {
      senderId: 'user_004',
      senderName: 'Arjun',
      content: 'Next stop is Third Wave! Their cold brew is legendary ☕',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'I\'ve heard great things about their coffee! Can\'t wait to try it',
      messageType: 'text' as const
    },
    {
      senderId: 'user_006',
      senderName: 'Suresh',
      content: 'Their nitro cold brew is out of this world!',
      messageType: 'text' as const
    }
  ],
  '3': [
    {
      senderId: 'user_005',
      senderName: 'Neha',
      content: 'Thanks everyone for an amazing trek! Same time next month?',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'Absolutely! That was an incredible experience. Count me in!',
      messageType: 'text' as const
    },
    {
      senderId: 'user_002',
      senderName: 'Rahul',
      content: 'The sunrise view was breathtaking! Definitely up for next month',
      messageType: 'text' as const
    },
    {
      senderId: 'user_003',
      senderName: 'Priya',
      content: 'Got some amazing photos from the peak! Will share them soon 📸',
      messageType: 'text' as const
    }
  ],
  '4': [
    {
      senderId: 'user_002',
      senderName: 'Arjun',
      content: 'What an epic food adventure! My taste buds are still celebrating 🎉',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'That filter coffee at the end was *chef\'s kiss* ☕',
      messageType: 'text' as const
    },
    {
      senderId: 'user_006',
      senderName: 'Kavya',
      content: 'Those dosas were incredible! Best food walk ever 😋',
      messageType: 'text' as const
    },
    {
      senderId: 'user_004',
      senderName: 'Suresh',
      content: 'I gained 5kg but it was totally worth it! When\'s the next one? 🤤',
      messageType: 'text' as const
    },
    {
      senderId: 'user_003',
      senderName: 'Meera',
      content: 'Already missing the vada pav from that street corner! We need to do this again',
      messageType: 'text' as const
    }
  ],
  'quest_004': [
    {
      senderId: 'user_005',
      senderName: 'Neha',
      content: 'Thanks everyone for an amazing trek! Same time next month?',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'Absolutely! That was an incredible experience. Count me in!',
      messageType: 'text' as const
    },
    {
      senderId: 'user_002',
      senderName: 'Rahul',
      content: 'The sunrise view was breathtaking! Definitely up for next month',
      messageType: 'text' as const
    }
  ],
  'quest_005': [
    {
      senderId: 'user_006',
      senderName: 'Kavya',
      content: 'Loved the watercolor techniques we learned today! 🎨',
      messageType: 'text' as const
    },
    {
      senderId: 'user_001',
      senderName: 'You',
      content: 'The instructor was amazing! I learned so much about color mixing',
      messageType: 'text' as const
    },
    {
      senderId: 'user_007',
      senderName: 'Meera',
      content: 'Can\'t wait to practice these techniques at home!',
      messageType: 'text' as const
    }
  ]
}

// Function to populate Firebase with mock chat data
export const populateChatData = async () => {
  try {
    console.log('🚀 Starting to populate Firebase with mock chat data...')
    
    const chatIds: string[] = []
    
    // Create chats
    for (const chatData of mockChats) {
      const chatDoc = {
        questId: chatData.questId,
        questTitle: chatData.questTitle,
        participants: chatData.participants,
        lastMessage: chatData.lastMessage,
        lastMessageBy: chatData.lastMessageBy,
        lastMessageAt: serverTimestamp(),
        isActive: chatData.isActive,
        createdBy: chatData.createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const chatRef = await addDoc(collection(db, 'chats'), chatDoc)
      chatIds.push(chatRef.id)
      console.log(`✅ Created chat: ${chatData.questTitle} (${chatRef.id})`)
    }
    
    // Create messages for each chat
    for (let i = 0; i < mockChats.length; i++) {
      const chatId = chatIds[i]
      const questId = mockChats[i].questId
      const messages = mockMessages[questId as keyof typeof mockMessages]
      
      if (messages) {
        for (const messageData of messages) {
          const messageDoc = {
            chatId: chatId,
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            content: messageData.content,
            messageType: messageData.messageType,
            timestamp: serverTimestamp(),
            isEdited: false
          }
          
          await addDoc(collection(db, 'messages'), messageDoc)
        }
        console.log(`✅ Added ${messages.length} messages to chat: ${mockChats[i].questTitle}`)
      }
    }
    
    console.log('🎉 Successfully populated Firebase with mock chat data!')
    console.log(`📊 Created ${mockChats.length} chats with messages`)
    
    return {
      success: true,
      chatCount: mockChats.length,
      chatIds: chatIds
    }
    
  } catch (error) {
    console.error('❌ Error populating chat data:', error)
    throw error
  }
}

// Function to populate chat data for a specific user
export const populateChatDataForUser = async (userId: string) => {
  try {
    console.log(`🚀 Starting to populate chat data for user: ${userId}...`)
    
    const chatIds: string[] = []
    
    // Create chats with the specific user included
    for (const chatData of mockChats) {
      // Update participants to include the specific user
      const updatedParticipants = [...chatData.participants]
      if (!updatedParticipants.includes(userId)) {
        updatedParticipants[0] = userId // Replace first participant with actual user
      }
      
      const chatDoc = {
        questId: chatData.questId,
        questTitle: chatData.questTitle,
        participants: updatedParticipants,
        lastMessage: chatData.lastMessage,
        lastMessageBy: chatData.lastMessageBy,
        lastMessageAt: serverTimestamp(),
        isActive: chatData.isActive,
        createdBy: userId, // Set the current user as creator
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const chatRef = await addDoc(collection(db, 'chats'), chatDoc)
      chatIds.push(chatRef.id)
      console.log(`✅ Created chat: ${chatData.questTitle} (ID: ${chatRef.id})`)
    }
    
    // Create messages for each chat
    for (let i = 0; i < mockChats.length; i++) {
      const chatId = chatIds[i]
      const questId = mockChats[i].questId
      const messages = mockMessages[questId as keyof typeof mockMessages]
      
      if (messages) {
        for (const messageData of messages) {
          // Update sender info for the first message to be from the current user
          const updatedMessageData = {
            chatId: chatId,
            senderId: messageData.senderId === 'user_001' ? userId : messageData.senderId,
            senderName: messageData.senderName,
            content: messageData.content,
            messageType: messageData.messageType,
            timestamp: serverTimestamp(),
            isEdited: false
          }
          
          await addDoc(collection(db, 'messages'), updatedMessageData)
        }
        console.log(`✅ Added ${messages.length} messages to chat: ${mockChats[i].questTitle}`)
      }
    }
    
    console.log('🎉 Successfully populated Firebase with user-specific chat data!')
    console.log(`📊 Created ${mockChats.length} chats with messages for user: ${userId}`)
    
    return {
      success: true,
      chatCount: mockChats.length,
      chatIds: chatIds
    }
    
  } catch (error) {
    console.error('❌ Error populating chat data for user:', error)
    throw error
  }
}

// Function to clear all chat data (for testing)
export const clearChatData = async () => {
  try {
    console.log('🗑️ Clearing all chat data...')
    
    // Note: In a real app, you'd want to use batch operations
    // and proper security rules. This is for development/testing only.
    
    console.log('⚠️ Clear function not implemented - use Firebase console or implement batch delete')
    
  } catch (error) {
    console.error('❌ Error clearing chat data:', error)
    throw error
  }
}

// Export the mock data for reference
export { mockChats, mockMessages }
