import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './config'
import { indianCities, type City } from '../data/cities'

// Dummy Data Collections
export interface DummyUser {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  city?: string
  interests?: string[]
  bio?: string
  joinedDate?: Timestamp
}

export interface DummyQuest {
  id?: string
  title: string
  description: string
  category: string
  location: string
  date: string
  time: string
  cost: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  organizer: string
  image: string
  participants?: number
  maxParticipants?: number
  createdAt?: Timestamp
}

export interface DummyChat {
  id: string
  questId: string
  questTitle: string
  questCategory: string
  participants: DummyUser[]
  messages: DummyMessage[]
  lastMessage?: DummyMessage
  created: Timestamp
}

export interface DummyMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'location'
  imageUrl?: string
  location?: {
    name: string
    coordinates: string
  }
  replyTo?: {
    messageId: string
    senderName: string
    content: string
  }
}

// Dummy users data
const dummyUsers: DummyUser[] = [
  {
    uid: 'user1',
    displayName: 'Rahul',
    email: 'rahul@example.com',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4f4e?crop=entropy',
    city: 'Bangalore',
    interests: ['Sports', 'Gaming'],
    bio: 'Passionate gamer and adventure enthusiast!'
  },
  {
    uid: 'user2',
    displayName: 'Priya',
    email: 'priya@example.com',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?crop=entropy',
    city: 'Bangalore',
    interests: ['Creative', 'Photography'],
    bio: 'Living life through the lens 📸'
  },
  {
    uid: 'user3',
    displayName: 'Arjun',
    email: 'arjun@example.com',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy',
    city: 'Mumbai',
    interests: ['Tech', 'Adventure'],
    bio: 'Tech enthusiast and fitness lover!'
  },
  {
    uid: 'user4',
    displayName: 'Kavya',
    email: 'kavya@example.com',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy',
    city: 'Delhi',
    interests: ['Gaming', 'Social'],
    bio: 'Avid board game collector and social butterfly!'
  },
  {
    uid: 'currentUser',
    displayName: 'Current User',
    email: 'current@example.com',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy',
    city: 'Bangalore',
    interests: ['Adventure', 'Learning', 'Creative'],
    bio: 'Ready for new adventures and learning experiences!'
  }
]

// Dummy quests data
const dummyQuests: DummyQuest[] = [
  {
    title: 'Looking for Board Game Buddies!',
    description: 'New to the city and missing game nights with friends. Want to start a regular group? I have Catan, Wingspan, and Ticket to Ride. Let\'s make some memories!',
    category: 'Social',
    location: 'My Place (Koramangala)',
    date: '2025-09-02',
    time: '7:00 PM',
    cost: 'Free',
    difficulty: 'Beginner',
    organizer: 'alex_newbie',
    participants: 5,
    maxParticipants: 8,
    image: 'https://images.unsplash.com/photo-1607748732922-4dabb64163d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwaGFuZ2luZyUyMG91dCUyMHRvZ2V0aGVyfGVufDF8fHx8MTc1NjQ2ODQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Early Morning Hike Companion Needed',
    description: 'I love sunrise hikes but hate going alone! Looking for someone who enjoys nature and good conversation. We can motivate each other to stay fit.',
    category: 'Adventure',
    location: 'Nandi Hills',
    date: '2025-09-05',
    time: '5:30 AM',
    cost: 'Free',
    difficulty: 'Intermediate',
    organizer: 'sam_hikes',
    participants: 3,
    maxParticipants: 6,
    image: 'https://images.unsplash.com/photo-1654860394661-85e83e85c0d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwbW91bnRhaW4lMjBoaWtpbmclMjB0cmFpbHxlbnwxfHx8fDE3NTY1NjcwOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Learn Italian Cooking with Me',
    description: 'I\'m learning to cook Italian food from YouTube but it\'s more fun with company! Want to experiment with pasta recipes together? We can split ingredients cost.',
    category: 'Learning',
    location: 'My Kitchen (Whitefield)',
    date: '2025-09-07',
    time: '3:00 PM',
    cost: '₹500',
    difficulty: 'Beginner',
    organizer: 'maria_cooks',
    participants: 4,
    maxParticipants: 6,
    image: 'https://images.unsplash.com/photo-1640459637803-ad56dc973061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwcGFzdGElMjBraXRjaGVuJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU2NTY3MDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Gym Buddy for Rock Climbing',
    description: 'Been climbing alone for months and want someone to belay with! I can teach basics if you\'re new. Looking for a regular climbing partner.',
    category: 'Adventure',
    location: 'Equilibrium Climbing Gym',
    date: '2025-09-08',
    time: '6:00 PM',
    cost: '₹800',
    difficulty: 'Expert',
    organizer: 'jake_climbs',
    participants: 2,
    maxParticipants: 4,
    image: 'https://images.unsplash.com/photo-1633859023075-fada2199a42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjByb2NrJTIwY2xpbWJpbmclMjBneW18ZW58MXx8fHwxNzU2NTY3MDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Watercolor Painting Together',
    description: 'I paint alone in my room and it gets lonely. Want to paint together at a nice café? Beginners welcome - I can share techniques I\'ve learned.',
    category: 'Creative',
    location: 'Café Wanderlust (Indiranagar)',
    date: '2025-09-10',
    time: '10:00 AM',
    cost: '₹300',
    difficulty: 'Beginner',
    organizer: 'luna_paints',
    participants: 6,
    maxParticipants: 10,
    image: 'https://images.unsplash.com/photo-1520882089059-2d00b02047fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwcGFpbnRpbmclMjBhcnQlMjBzdXBwbGllc3xlbnwxfHx8fDE3NTY1NjcwOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    title: 'Board Game Tournament',
    description: 'Join us for a fun evening of board games! Perfect for meeting new people and having great conversations.',
    category: 'Social',
    location: 'Downtown Café',
    date: '2025-09-02',
    time: '7:00 PM',
    cost: 'Free',
    difficulty: 'Beginner',
    organizer: 'gamemaster',
    participants: 8,
    maxParticipants: 12,
    image: 'https://images.unsplash.com/photo-1607748732922-4dabb64163d0?crop=entropy'
  },
  {
    title: 'Photography Walk',
    description: 'Explore the city through your lens. Bring your camera and let\'s capture some amazing shots together!',
    category: 'Creative',
    location: 'City Park',
    date: '2025-09-10',
    time: '9:00 AM',
    cost: 'Free',
    difficulty: 'Beginner',
    organizer: 'photo_walk_guide',
    participants: 5,
    maxParticipants: 8,
    image: 'https://images.unsplash.com/photo-1654860394661-85e83e85c0d2?crop=entropy'
  },
  {
    title: 'Hiking Adventure',
    description: 'Early morning hike to catch the sunrise. Great workout and even better views!',
    category: 'Adventure',
    location: 'Mountain Trail',
    date: '2025-08-25',
    time: '6:00 AM',
    cost: 'Free',
    difficulty: 'Intermediate',
    organizer: 'hiking_guide',
    participants: 6,
    maxParticipants: 10,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy'
  },
  {
    title: 'Cooking Workshop: Italian Cuisine',
    description: 'Learn to make authentic Italian pasta and sauces from a professional chef.',
    category: 'Learning',
    location: 'Culinary Studio',
    date: '2025-09-15',
    time: '3:00 PM',
    cost: '₹500',
    difficulty: 'Beginner',
    organizer: 'Chef Marco',
    participants: 8,
    maxParticipants: 12,
    image: 'https://images.unsplash.com/photo-1640459637803-ad56dc973061?crop=entropy'
  },
  {
    title: 'Beach Volleyball Tournament',
    description: 'Competitive beach volleyball with prizes for winners. All skill levels welcome!',
    category: 'Exercise',
    location: 'Marina Beach',
    date: '2025-09-08',
    time: '10:00 AM',
    cost: 'Free',
    difficulty: 'Intermediate',
    organizer: 'SportZone',
    participants: 16,
    maxParticipants: 20,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy'
  }
]

// Dummy messages for chats
const dummyMessages: DummyMessage[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    senderName: 'Rahul',
    content: 'Hey everyone! Just arrived at the venue. See you inside! 🎲',
    timestamp: '2025-09-02T14:30:00Z',
    type: 'text'
  },
  {
    id: 'msg2',
    senderId: 'user2',
    senderName: 'Priya',
    content: 'Great! I\'m running 5 minutes late',
    timestamp: '2025-09-02T14:32:00Z',
    type: 'text'
  },
  {
    id: 'msg3',
    senderId: 'user1',
    senderName: 'Rahul',
    content: 'No worries! We\'ll wait for you',
    timestamp: '2025-09-02T14:33:00Z',
    type: 'text',
    replyTo: {
      messageId: 'msg2',
      senderName: 'Priya',
      content: 'Great! I\'m running 5 minutes late'
    }
  },
  {
    id: 'msg4',
    senderId: 'user3',
    senderName: 'Arjun',
    content: 'Boardgame photo',
    timestamp: '2025-09-02T14:35:00Z',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1580087700722-bf9a33bc5952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwdGFibGUlMjBzZXR1cHxlbnwxfHx8fDE3NTY1Nzk5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'msg5',
    senderId: 'user4',
    senderName: 'Kavya',
    content: 'Perfect setup! Love the new games you brought',
    timestamp: '2025-09-02T14:37:00Z',
    type: 'text',
    replyTo: {
      messageId: 'msg4',
      senderName: 'Arjun',
      content: 'Image'
    }
  }
]

// Function to save users
export async function saveDummyUsers(): Promise<void> {
  try {
    for (const user of dummyUsers) {
      const userData = {
        ...user,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true })
      console.log(`✅ User saved: ${user.displayName}`)
    }
    console.log('📝 All dummy users saved successfully!')
  } catch (error) {
    console.error('❌ Error saving users:', error)
  }
}

// Function to save quests 
export async function saveDummyQuests(): Promise<string[]> {
  const questIds: string[] = []
  try {
    for (const quest of dummyQuests) {
      const questData = {
        ...quest,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'quests'), questData)
      questIds.push(docRef.id)
      console.log(`✅ Quest saved: ${quest.title}`)
    }
    console.log('📝 All dummy quests saved successfully!')
    return questIds
  } catch (error) {
    console.error('❌ Error saving quests:', error)
    return questIds
  }
}

// Function to save messages for each chat
export async function saveDummyMessages(chatId: string): Promise<string[]> {
  const messageIds: string[] = []
  try {
    for (const message of dummyMessages) {
      const messageData = {
        ...message,
        chatId,
        createdAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'messages'), messageData)
      messageIds.push(docRef.id)
      console.log(`✅ Message saved in chat ${chatId}: ${message.content.substring(0, 30)}...`)
    }
    console.log(`📝 All messages saved for chat ${chatId}!`)
    return messageIds
  } catch (error) {
    console.error('❌ Error saving messages:', error)
    return messageIds
  }
}

// Function to save chats
export async function saveDummyChats(questIds: string[]): Promise<void> {
  try {
    const chatData = [
      {
        questId: questIds[0],
        questTitle: 'Board Game Tournament',
        questCategory: 'Social',
        participants: ['user1', 'user2', 'user3', 'user4', 'currentUser'],
        createdAt: serverTimestamp(),
        isActive: true
      },
      {
        questId: questIds[1],
        questTitle: 'Early Morning Hike Companion Needed',
        questCategory: 'Adventure',
        participants: ['user1', 'user3', 'currentUser'],
        createdAt: serverTimestamp(),
        isActive: true
      },
      {
        questId: questIds[2],
        questTitle: 'Learn Italian Cooking with Me',
        questCategory: 'Learning',
        participants: ['user2', 'user4', 'currentUser'],
        createdAt: serverTimestamp(),
        isActive: true
      }
    ]

    for (let i = 0; i < chatData.length; i++) {
      const chatId = `chat_${Date.now()}_${i}`
      const docRef = await setDoc(doc(db, 'chats', chatId), chatData[i])
      
      // Save messages for this chat
      await saveDummyMessages(chatId)
      console.log(`✅ Chat saved: ${chatData[i].questTitle}`)
    }
    console.log('📝 All dummy chats saved successfully!')
  } catch (error) {
    console.error('❌ Error saving chats:', error)
  }
}

// Function to save categories
export async function saveDummyCategories(): Promise<void> {
  try {
    const categories = [
      'Social',
      'Adventure', 
      'Learning',
      'Creative',
      'Sports',
      'Food',
      'Music',
      'Art',
      'Tech',
      'Travel',
      'Fitness',
      'Exercise'
    ].map((cat, index) => ({ 
      id: `cat${index}`,
      name: cat,
      description: `${cat} activities and events`,
      icon: '',
      color: '#007FFF',
      createdAt: serverTimestamp()
    }))

    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), category)
      console.log(`✅ Category saved: ${category.name}`)
    }
    console.log('📝 All categories saved successfully!')
  } catch (error) {
    console.error('❌ Error saving categories:', error)
  }
}

// Function to save cities
export async function saveDummyCities(): Promise<void> {
  try {
    for (const city of indianCities) {
      const cityData = {
        ...city,
        id: city.name.toLowerCase().replace(' ', '_'),
        createdAt: serverTimestamp()
      }
      await setDoc(doc(db, 'cities', cityData.id), cityData)
      console.log(`✅ City saved: ${city.displayName}`)
    }
    console.log('📝 All cities saved successfully!')
  } catch (error) {
    console.error('❌ Error saving cities:', error)
  }
}

// Function to save achievements
export async function saveDummyAchievements(): Promise<void> {
  try {
    const achievements = [
      {
        id: 'first_quest',
        name: 'First Quest',
        description: 'Complete your first quest!',
        icon: '🎯',
        points: 10,
        criteria: { questsCount: 1 },
        isUnlocked: true,
        createdAt: serverTimestamp()
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Join 5 social quests',
        icon: '🦋',
        points: 50,
        criteria: { questCategoryCount: { 'Social': 5 } },
        isUnlocked: false,
        createdAt: serverTimestamp()
      },
      {
        id: 'explorer',
        name: 'Explorer',
        description: 'Complete 3 adventure quests',
        icon: '🗺️',
        points: 30,
        criteria: { questCategoryCount: { 'Adventure': 3 } },
        isUnlocked: false,
        createdAt: serverTimestamp()
      }
    ]

    for (const achievement of achievements) {
      await setDoc(doc(db, 'achievements', achievement.id), achievement)
      console.log(`✅ Achievement saved: ${achievement.name}`)
    }
    console.log('📝 All achievements saved successfully!')
  } catch (error) {
    console.error('❌ Error saving achievements:', error)
  }
}

// REMOVED: saveAllDummyData function to prevent duplicate data creation
// The saveAllDummyData function has been removed entirely to prevent accidental
// bulk migrations that could cause duplicates on page reloads.

// Individual functions (saveDummyCategories, saveDummyCities, etc.) are still available
// for manual/call-time usage only.
