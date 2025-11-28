// Database Setup and Initialization
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './config'

// Sample initial data
export const initialCategories = [
  { id: 'social', name: 'Social', description: 'Meet people and make friends', icon: '👥', color: '#EC4899', sortOrder: 1 },
  { id: 'adventure', name: 'Adventure', description: 'Thrilling outdoor activities', icon: '🗺️', color: '#10B981', sortOrder: 2 },
  { id: 'learning', name: 'Learning', description: 'Educational experiences and workshops', icon: '📚', color: '#A855F7', sortOrder: 3 },
  { id: 'creative', name: 'Creative', description: 'Arts, crafts, and creative pursuits', icon: '🎨', color: '#F59E0B', sortOrder: 4 },
  { id: 'sports', name: 'Sports', description: 'Fitness and sporting activities', icon: '⚽', color: '#10B981', sortOrder: 5 },
  { id: 'food', name: 'Food', description: 'Culinary experiences and dining', icon: '🍕', color: '#EC4899', sortOrder: 6 },
  { id: 'music', name: 'Music', description: 'Concerts, bands, and musical events', icon: '🎵', color: '#A855F7', sortOrder: 7 },
  { id: 'tech', name: 'Tech', description: 'Technology workshops and coding', icon: '💻', color: '#00F5FF', sortOrder: 8 }
]

export const initialCities = [
  { 
    id: 'bangalore', 
    name: 'Bangalore', 
    state: 'Karnataka', 
    country: 'India',
    latitude: 12.9716, 
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
    activeQuestsCount: 0,
    activeUsers: 0,
    isPopular: true
  },
  { 
    id: 'delhi', 
    name: 'Delhi', 
    state: 'Delhi', 
    country: 'India',
    latitude: 28.7041, 
    longitude: 77.1025,
    timezone: 'Asia/Kolkata',
    activeQuestsCount: 0,
    activeUsers: 0,
    isPopular: true
  },
  { 
    id: 'mumbai', 
    name: 'Mumbai', 
    state: 'Maharashtra', 
    country: 'India',
    latitude: 19.0760, 
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    activeQuestsCount: 0,
    activeUsers: 0,
    isPopular: true
  }
]

export const initialAchievements = [
  {
    id: 'first_quest',
    name: 'First Quest',
    description: 'Created your first quest',
    icon: '🎯',
    requirement: { type: 'quests_created', value: 1 },
    rewardTokens: 50,
    rewardExperience: 10,
    category: 'creator',
    isSecret: false,
    tier: 'bronze',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Joined 10 quests',
    icon: '🦋',
    requirement: { type: 'quests_joined', value: 10 },
    rewardTokens: 200,
    rewardExperience: 50,
    category: 'social',
    isSecret: false,
    tier: 'silver',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'quest_master',
    name: 'Quest Master',
    description: 'Created 25 successful quests',
    icon: '🏆',
    requirement: { type: 'quests_created', value: 25 },
    rewardTokens: 1000,
    rewardExperience: 250,
    category: 'creator',
    isSecret: false,
    tier: 'platinum',
    isActive: true,
    sortOrder: 3
  }
]

// Initialize database with sample data
export const initializeDatabase = async () => {
  try {
    console.log('Initializing database...')
    
    // Initialize Categories
    for (const category of initialCategories) {
      const categoryRef = doc(db, 'categories', category.id)
      const categoryData = {
        ...category,
        totalQuests: 0,
        activeQuests: 0,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      await setDoc(categoryRef, categoryData)
      console.log(`✅ Category "${category.name}" initialized`)
    }
    
    // Initialize Cities
    for (const city of initialCities) {
      const cityRef = doc(db, 'cities', city.id)
      const cityData = {
        ...city,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      await setDoc(cityRef, cityData)
      console.log(`✅ City "${city.name}" initialized`)
    }
    
    // Initialize Achievements
    for (const achievement of initialAchievements) {
      const achievementRef = doc(db, 'achievements', achievement.id)
      const achievementData = {
        ...achievement,
        createdAt: serverTimestamp()
      }
      await setDoc(achievementRef, achievementData)
      console.log(`✅ Achievement "${achievement.name}" initialized`)
    }
    
    console.log('✅ Database initialization completed successfully')
    return true
    
  } catch (error: any) {
    console.error('❌ Error initializing database:', error)
    throw new Error(`Database initialization failed: ${error.message}`)
  }
}

// Check if categories exist (to avoid re-initialization)
export const checkDatabaseSetup = async () => {
  try {
    const categoriesRef = collection(db, 'categories')
    const categoriesSnapshot = await getDocs(categoriesRef)
    
    return categoriesSnapshot.size > 0
  } catch (error) {
    console.error('Error checking database setup:', error)
    return false
  }
}
