import { useState } from 'react'
import { Button } from './ui/button'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'

export function MockAuthButton() {
  const { user, isMockUser } = useFirebase()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleMockLogin = async () => {
    setIsLoggingIn(true)
    
    try {
      // Create a simple mock user for quick testing
      const mockUser = {
        uid: 'mock_test_user',
        email: 'test.user@gmail.com',
        displayName: 'Test User',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        emailVerified: true,
        // Add other required Firebase User properties
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString()
        },
        providerData: [{
          uid: 'mock_test_user',
          email: 'test.user@gmail.com',
          displayName: 'Test User',
          photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
          uid: 'mock_test_user',
          email: 'test.user@gmail.com',
          displayName: 'Test User',
          photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        })
      }

      // Store the mock user in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
      
      // Trigger auth state change manually
      window.dispatchEvent(new CustomEvent('mockUserLogin', { 
        detail: mockUser 
      }))
      
      toast.success('Logged in as Test User')
      
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
    toast.success('Logged out from mock user')
  }

  // Show logout button if mock user is logged in
  if (user && isMockUser) {
    return (
      <Button 
        onClick={handleMockLogout}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        🧪 Logout Mock User
      </Button>
    )
  }

  // Show login button if no user is logged in
  if (!user) {
    return (
      <Button 
        onClick={handleMockLogin}
        disabled={isLoggingIn}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        {isLoggingIn ? 'Logging in...' : '🧪 Mock Login'}
      </Button>
    )
  }

  // Don't show anything if real user is logged in
  return null
}







