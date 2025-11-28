import { useState } from 'react'
import { Button } from './ui/button'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

export function MockUserTest() {
  const { user } = useFirebase()
  const [testResults, setTestResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const testMockUserCreation = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setLoading(true)
    addResult('🔄 Testing mock user creation...')
    
    try {
      // Create a simple test mock user
      const testMockUser = {
        uid: 'test_mock_user_123',
        email: 'test.mock@example.com',
        displayName: 'Test Mock User',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        username: 'TestMock',
        age: 25,
        city: 'Test City',
        gender: 'Other',
        bio: 'This is a test mock user for debugging purposes.',
        personalityType: 'ambivert',
        interests: ['Testing', 'Debugging']
      }

      addResult(`👤 Creating test mock user: ${testMockUser.displayName}`)
      
      const userRef = doc(db, 'users', testMockUser.uid)
      const now = new Date()
      
      const userProfile = {
        id: testMockUser.uid,
        email: testMockUser.email,
        username: testMockUser.username,
        displayName: testMockUser.displayName,
        photoURL: testMockUser.photoURL,
        providerId: 'mock.com',
        providerUid: testMockUser.uid,
        
        // Profile Details
        age: testMockUser.age,
        city: testMockUser.city,
        gender: testMockUser.gender,
        bio: testMockUser.bio,
        personalityType: testMockUser.personalityType,
        interests: testMockUser.interests,
        
        // Profile Management
        profileImage: testMockUser.photoURL,
        isProfileCompleted: true,
        
        // Activity Tracking
        questsCreated: [],
        questsJoined: [],
        savedQuests: [],
        totalQuestsCreated: 0,
        totalQuestsJoined: 0,
        
        // Tokens/Achievements
        tokens: 100,
        level: 1,
        experience: 0,
        achievements: [],
        
        // Timestamps
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now
      }
      
      // Try to create the user profile
      await setDoc(userRef, userProfile)
      addResult('✅ Test mock user created successfully!')
      
      // Try to read it back
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        addResult(`✅ User profile verified: ${userData.displayName}`)
        addResult(`📧 Email: ${userData.email}`)
        addResult(`🏙️ City: ${userData.city}`)
        addResult(`🎯 Interests: ${userData.interests.join(', ')}`)
      } else {
        addResult('❌ User profile not found after creation')
      }
      
      toast.success('Mock user test completed successfully!')
      
    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`)
      addResult(`🔍 Error details: ${JSON.stringify(error)}`)
      console.error('Mock user test error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-yellow-50">
      <h3 className="text-lg font-bold">Mock User Test</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Test the basic mock user creation functionality to debug any issues.
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={testMockUserCreation}
            disabled={loading || !user}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {loading ? 'Testing...' : 'Test Mock User Creation'}
          </Button>
          
          <Button 
            onClick={clearResults}
            variant="outline"
          >
            Clear Results
          </Button>
        </div>
      </div>
      
      {testResults.length > 0 && (
        <div className="bg-black text-yellow-400 p-3 rounded font-mono text-sm max-h-60 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
      )}
    </div>
  )
}







