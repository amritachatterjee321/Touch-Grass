import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthStateChange } from '../firebase/auth'
import { getAllQuests, Quest, listenToQuests } from '../firebase/quests'

interface FirebaseContextType {
  user: User | null
  loading: boolean
  quests: Quest[]
  questsLoading: boolean
  dbInitialized: boolean
  isMockUser: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  quests: [],
  questsLoading: true,
  dbInitialized: false,
  isMockUser: false
})

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider')
  }
  return context
}

interface FirebaseProviderProps {
  children: ReactNode
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [quests, setQuests] = useState<Quest[]>([])
  const [questsLoading, setQuestsLoading] = useState(true)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [isMockUser, setIsMockUser] = useState(false)

  useEffect(() => {
    // Initialize database on app startup
    const initializeDB = async () => {
      try {
        console.log('🚀 Initializing database...')
        
        // Database collections should be manually created via Firebase Console
        // No automatic collection creation to prevent unwanted data structures
        console.log('📝 Database initialization completed - collection creation removed')
        
        setDbInitialized(true)
        console.log('✅ Database initialization completed')
      } catch (error) {
        console.error('❌ Database initialization failed:', error)
        
        // No fallback collection creation
        console.log('🛑 No automatic collection creation available')
        setDbInitialized(true) // Still continue app without collection creation
      }
    }
    
    initializeDB()
  }, [])

  useEffect(() => {
    // Check for mock user in localStorage on app start
    const checkMockUser = () => {
      const mockUserData = localStorage.getItem('mockUser')
      if (mockUserData) {
        try {
          const mockUser = JSON.parse(mockUserData)
          setUser(mockUser as User)
          setIsMockUser(true)
          setLoading(false)
          return
        } catch (error) {
          console.error('Error parsing mock user data:', error)
          localStorage.removeItem('mockUser')
        }
      }
    }

    // Check for mock user first
    checkMockUser()

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChange((user) => {
      // Only update if not a mock user (mock users are handled separately)
      if (!isMockUser) {
        setUser(user)
        setLoading(false)
      }
    })

    // Listen for mock user login/logout events
    const handleMockUserLogin = (event: any) => {
      setUser(event.detail)
      setIsMockUser(true)
      setLoading(false)
    }

    const handleMockUserLogout = () => {
      setUser(null)
      setIsMockUser(false)
      setLoading(false)
    }

    window.addEventListener('mockUserLogin', handleMockUserLogin)
    window.addEventListener('mockUserLogout', handleMockUserLogout)

    return () => {
      unsubscribe()
      window.removeEventListener('mockUserLogin', handleMockUserLogin)
      window.removeEventListener('mockUserLogout', handleMockUserLogout)
    }
  }, [isMockUser])

  useEffect(() => {
    // Listen for quest updates in real-time
    const unsubscribe = listenToQuests((questList) => {
      console.log('📡 FirebaseContext: Received quest list:', questList)
      setQuests(questList)
      setQuestsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    quests,
    questsLoading,
    dbInitialized,
    isMockUser
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}
