import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

// Mock users for testing login
const mockUsers = [
  {
    uid: 'mock_user_1',
    email: 'alex.gamer@gmail.com',
    displayName: 'Alex Gaming',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    username: 'AlexGamer',
    age: 24,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Gaming enthusiast and board game collector. Always up for a good challenge!',
    personalityType: 'extrovert',
    interests: ['Gaming', 'Technology', 'Sports', 'Social']
  },
  {
    uid: 'mock_user_2',
    email: 'sarah.photographer@gmail.com',
    displayName: 'Sarah Lens',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    username: 'SarahLens',
    age: 28,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Professional photographer with a passion for capturing life\'s beautiful moments.',
    personalityType: 'ambivert',
    interests: ['Photography', 'Art', 'Travel', 'Creative']
  },
  {
    uid: 'mock_user_3',
    email: 'mike.sports@gmail.com',
    displayName: 'Mike Volleyball',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    username: 'MikeVolleyball',
    age: 26,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Beach volleyball player and fitness enthusiast. Love the competitive spirit!',
    personalityType: 'extrovert',
    interests: ['Sports', 'Fitness', 'Beach', 'Competition']
  },
  {
    uid: 'mock_user_4',
    email: 'priya.foodie@gmail.com',
    displayName: 'Priya Foodie',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    username: 'PriyaFoodie',
    age: 23,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Food blogger and street food explorer. Always hunting for the next delicious discovery!',
    personalityType: 'extrovert',
    interests: ['Food', 'Travel', 'Culture', 'Social']
  },
  {
    uid: 'mock_user_5',
    email: 'david.coder@gmail.com',
    displayName: 'David Code',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    username: 'DavidCode',
    age: 29,
    city: 'Bangalore',
    gender: 'Male',
    bio: 'Full-stack developer passionate about AI and machine learning. Building the future one line at a time.',
    personalityType: 'introvert',
    interests: ['Technology', 'AI', 'Programming', 'Learning']
  },
  {
    uid: 'mock_user_6',
    email: 'emma.yoga@gmail.com',
    displayName: 'Emma Zen',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    username: 'EmmaZen',
    age: 31,
    city: 'Bangalore',
    gender: 'Female',
    bio: 'Certified yoga instructor and wellness coach. Helping people find peace and balance.',
    personalityType: 'ambivert',
    interests: ['Yoga', 'Wellness', 'Meditation', 'Fitness']
  }
]

export function MockUserLogin() {
  const { user } = useFirebase()
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleMockLogin = async (mockUser: any) => {
    setIsLoggingIn(true)
    
    try {
      // Create a mock Firebase User object
      const mockFirebaseUser = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoURL: mockUser.photoURL,
        emailVerified: true,
        // Add other required Firebase User properties
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString()
        },
        providerData: [{
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL,
          providerId: 'mock.com'
        }],
        refreshToken: 'mock-refresh-token',
        getIdToken: async () => 'mock-id-token',
        getIdTokenResult: async () => ({
          token: 'mock-id-token',
          authTime: new Date().toISOString(),
          issuedAtTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600000).toISOString(),
          signInProvider: 'mock.com',
          signInSecondFactor: null,
          claims: {},
          audience: 'mock-audience',
          issuer: 'mock-issuer'
        }),
        reload: async () => {},
        toJSON: () => ({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL
        })
      }

      // Store the mock user in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockFirebaseUser))
      
      // Trigger auth state change manually
      window.dispatchEvent(new CustomEvent('mockUserLogin', { 
        detail: mockFirebaseUser 
      }))
      
      toast.success(`Logged in as ${mockUser.displayName}`)
      setSelectedUser(mockUser)
      
    } catch (error: any) {
      console.error('Mock login error:', error)
      toast.error('Mock login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleMockLogout = () => {
    localStorage.removeItem('mockUser')
    window.dispatchEvent(new CustomEvent('mockUserLogout'))
    setSelectedUser(null)
    toast.success('Logged out from mock user')
  }

  // Show current mock user if logged in
  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Mock User Active
            </Badge>
          </CardTitle>
          <CardDescription>
            Currently logged in as a mock user for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
              <AvatarFallback>
                {user.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.displayName}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleMockLogout}
            variant="outline" 
            className="w-full"
          >
            Logout Mock User
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Testing Mode
          </Badge>
          Mock User Login
        </CardTitle>
        <CardDescription>
          Login as any mock user to test the app without requiring Google authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUsers.map((mockUser) => (
            <div
              key={mockUser.uid}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedUser?.uid === mockUser.uid 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedUser(mockUser)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={mockUser.photoURL} alt={mockUser.displayName} />
                  <AvatarFallback>
                    {mockUser.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{mockUser.displayName}</h4>
                  <p className="text-xs text-gray-500 truncate">{mockUser.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {mockUser.interests.slice(0, 2).map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {mockUser.interests.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{mockUser.interests.length - 2}
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMockLogin(mockUser)
                  }}
                  disabled={isLoggingIn}
                  size="sm"
                  className="w-full"
                >
                  {isLoggingIn ? 'Logging in...' : 'Login as this user'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Testing Mode Notice</h4>
          <p className="text-sm text-yellow-700">
            This is a testing feature that allows you to login as mock users without requiring actual Google authentication. 
            Use this for development and testing purposes only.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}







