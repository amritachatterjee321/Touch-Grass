import { useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { X } from "lucide-react"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { signInWithGoogle } from "../firebase/auth"
import { getUserProfile, createUserProfile } from "../firebase/users"

interface GoogleLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
  onMockLoginSuccess?: () => void
  actionType: 'join' | 'save'
  questTitle?: string
}

// Mock users for testing
const mockUsers = [
  {
    uid: 'mock_user_1',
    email: 'alex.gamer@gmail.com',
    displayName: 'Alex Gaming',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    username: 'AlexGamer'
  },
  {
    uid: 'mock_user_2',
    email: 'sarah.photographer@gmail.com',
    displayName: 'Sarah Lens',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    username: 'SarahLens'
  },
  {
    uid: 'mock_user_3',
    email: 'mike.sports@gmail.com',
    displayName: 'Mike Volleyball',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    username: 'MikeVolleyball'
  },
  {
    uid: 'mock_user_4',
    email: 'priya.foodie@gmail.com',
    displayName: 'Priya Foodie',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    username: 'PriyaFoodie'
  }
]

export function GoogleLoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  onMockLoginSuccess,
  actionType, 
  questTitle 
}: GoogleLoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [selectedMockUser, setSelectedMockUser] = useState<any>(mockUsers[1]) // Default to Sarah Lens
  const [showMockUsers, setShowMockUsers] = useState(true) // Show mock users by default

  // Debug log to check initial state
  console.log('🔍 Initial selectedMockUser:', selectedMockUser)
  console.log('🔍 Mock users available:', mockUsers)

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return // Prevent multiple clicks
    
    setIsLoggingIn(true)
    
    try {
      console.log('🔄 Initiating Google login...')
      
      // Call Firebase Google sign-in directly
      const { user } = await signInWithGoogle()
      
      if (user) {
        console.log('✅ Google login successful:', user.email)
        toast.success(`Welcome, ${user.displayName || 'User'}! 🎉`)
        
        // Check if this is a first-time user (no profile or incomplete profile)
        try {
          const profile = await getUserProfile(user.uid)
          const isFirstTimeUser = !profile || !profile.isProfileCompleted
          
          if (isFirstTimeUser) {
            console.log('👤 First-time user detected - creating basic profile and redirecting to profile creation')
            
            // Create a basic profile document in Firestore immediately after Google login
            // This ensures the account exists in Firestore even before profile completion
            // The document will be UPDATED (not recreated) when user completes their profile
            try {
              console.log('🔄 Step 1: Creating initial user document in Firestore...')
              console.log('👤 User object:', { 
                uid: user.uid, 
                email: user.email, 
                displayName: user.displayName,
                photoURL: user.photoURL 
              })
              
              const createdProfile = await createUserProfile(user, {
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || null,
                isProfileCompleted: false
              })
              
              console.log('✅ Step 1 Complete: Initial user document created in Firestore')
              console.log('📋 Document will be UPDATED (not recreated) when user completes profile')
              console.log('🔑 Document ID (user.uid):', user.uid)
            } catch (profileCreateError: any) {
              console.error('❌ CRITICAL: Error creating basic profile:', profileCreateError)
              console.error('❌ Error details:', {
                code: profileCreateError.code,
                message: profileCreateError.message,
                stack: profileCreateError.stack
              })
              
              // Show error to user
              toast.error('Failed to create user account', {
                description: profileCreateError.message || 'Please try again or contact support'
              })
              
              // Don't continue - this is a critical error
              setIsLoggingIn(false)
              return
            }
            
            // Don't call onLoginSuccess for first-time users
            // The parent component will handle navigation to profile creation
            // via the useEffect that checks profile completion
            onClose()
            // Trigger a custom event to notify parent that login succeeded
            // and profile creation is needed
            window.dispatchEvent(new CustomEvent('googleLoginSuccess', { 
              detail: { userId: user.uid, needsProfile: true } 
            }))
            return
          } else {
            console.log('👤 Returning user - profile already completed')
            // Dispatch general login success event for returning users
            window.dispatchEvent(new CustomEvent('generalGoogleLoginSuccess'))
            // Call the parent's success handler for returning users (if provided)
            if (onLoginSuccess) {
              await onLoginSuccess()
            }
          }
        } catch (profileError: any) {
          console.error('⚠️ Error checking profile:', profileError)
          // If we can't check profile, assume first-time user and create basic profile
          console.log('👤 Assuming first-time user due to profile check error - creating basic profile')
          
          try {
            console.log('🔄 Creating basic user profile in Firestore (fallback)...')
            console.log('👤 User object:', { uid: user.uid, email: user.email, displayName: user.displayName })
            
            const createdProfile = await createUserProfile(user, {
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || null,
              isProfileCompleted: false
            })
            
            console.log('✅ Basic user profile created in Firestore (fallback):', createdProfile)
          } catch (profileCreateError: any) {
            console.error('❌ CRITICAL: Error creating basic profile (fallback):', profileCreateError)
            console.error('❌ Error details:', {
              code: profileCreateError.code,
              message: profileCreateError.message,
              stack: profileCreateError.stack
            })
            
            // Show error to user
            toast.error('Failed to create user account', {
              description: profileCreateError.message || 'Please try again or contact support'
            })
            
            // Don't continue - this is a critical error
            setIsLoggingIn(false)
            return
          }
          
          onClose()
          window.dispatchEvent(new CustomEvent('googleLoginSuccess', { 
            detail: { userId: user.uid, needsProfile: true } 
          }))
          return
        }
        
        // Close modal after successful login
        onClose()
        setIsLoggingIn(false) // Reset loading state
      } else {
        setIsLoggingIn(false) // Reset loading state
        throw new Error('No user returned from Google sign-in')
      }
      
    } catch (error: any) {
      console.error('❌ Google login failed:', error)
      setIsLoggingIn(false) // Always reset loading state on error
      
      // Don't show error toast if user cancelled or if sign-in is already in progress
      if (error.code === 'auth/cancelled-popup-request' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.message?.includes('cancelled') ||
          error.message?.includes('closed') ||
          error.message?.includes('already in progress')) {
        console.log('ℹ️ User cancelled Google login or sign-in already in progress')
        return
      }
      
      // Handle specific Firebase Auth errors
      let errorMessage = "Login failed"
      let errorDescription = "Please try again or contact support if the issue persists."
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup blocked"
        errorDescription = "Please allow popups for this site and try again."
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error"
        errorDescription = "Please check your internet connection and try again."
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "Unauthorized domain"
        errorDescription = "This domain is not authorized for Google sign-in. Please contact support."
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Sign-in method not enabled"
        errorDescription = "Google sign-in is not enabled. Please contact support."
      } else if (error.message) {
        errorDescription = error.message
      }
      
      toast.error(errorMessage, {
        description: errorDescription
      })
    }
  }

  const handleMockLogin = async (mockUser: any) => {
    console.log('🚀 Starting mock login for:', mockUser.displayName)
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

      console.log('📝 Storing mock user in localStorage:', mockFirebaseUser)
      // Store the mock user in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockFirebaseUser))
      
      console.log('📡 Dispatching mockUserLogin event')
      // Trigger auth state change manually
      window.dispatchEvent(new CustomEvent('mockUserLogin', { 
        detail: mockFirebaseUser 
      }))
      
      toast.success(`Logged in as ${mockUser.displayName}`)
      
      console.log('✅ Calling parent login success handler')
      // Call the appropriate parent handler
      if (onMockLoginSuccess) {
        await onMockLoginSuccess()
      } else {
        await onLoginSuccess()
      }
      
    } catch (error: any) {
      console.error('❌ Mock login error:', error)
      toast.error('Mock login failed')
      setIsLoggingIn(false)
    }
  }


  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-describedby="login-description"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="gradient-text font-bold">LOGIN REQUIRED</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Testing Mode Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">
                🧪 Testing Mode
              </Badge>
              <span className="text-sm font-medium text-blue-800">Quick Login Options</span>
            </div>
            <p className="text-xs text-blue-700">
              For testing purposes, you can login as any of these mock users without Google authentication.
            </p>
          </div>

          {/* Mock User Login Options */}
          {!showMockUsers ? (
            <Button
              onClick={() => setShowMockUsers(true)}
              variant="outline"
              className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              🧪 Login as Test User (Recommended)
            </Button>
          ) : (
            <div className="space-y-3">
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                  Selected: {selectedMockUser?.displayName || 'None'} | Users: {mockUsers.length}
                </div>
              )}
              
              <div className="space-y-2">
                {mockUsers.map((mockUser) => (
                  <div
                    key={mockUser.uid}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md active:scale-95 touch-manipulation ${
                      selectedMockUser?.uid === mockUser.uid 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('👆 Selecting mock user:', mockUser.displayName, mockUser.uid)
                      setSelectedMockUser(mockUser)
                      console.log('👆 Mock user set to:', mockUser)
                      console.log('👆 New state will be:', mockUser)
                      toast.success(`Selected ${mockUser.displayName}`)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={mockUser.photoURL} alt={mockUser.displayName} />
                          <AvatarFallback className="text-sm">
                            {mockUser.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {selectedMockUser?.uid === mockUser.uid && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{mockUser.displayName}</h4>
                        <p className="text-xs text-gray-500 truncate">{mockUser.email}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedMockUser?.uid === mockUser.uid 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedMockUser?.uid === mockUser.uid && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded mb-2">
                DEBUG: selectedMockUser = {selectedMockUser?.displayName || 'null'}
              </div>
              
              <button
                type="button"
                onClick={() => {
                  console.log('🔘 Login button clicked')
                  console.log('🔘 selectedMockUser:', selectedMockUser)
                  console.log('🔘 selectedMockUser type:', typeof selectedMockUser)
                  console.log('🔘 selectedMockUser truthy?', !!selectedMockUser)
                  console.log('🔘 isLoggingIn:', isLoggingIn)
                  
                  if (selectedMockUser) {
                    console.log('✅ Attempting to login as:', selectedMockUser.displayName)
                    handleMockLogin(selectedMockUser)
                  } else {
                    console.log('❌ No mock user selected')
                    toast.error('Please select a user first')
                  }
                }}
                disabled={isLoggingIn}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                  selectedMockUser 
                    ? 'bg-blue-500 hover:bg-blue-600 shadow-md' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoggingIn ? 'Logging in...' : 
                 selectedMockUser ? `Login as ${selectedMockUser.displayName}` : 
                 'Select a user above'}
              </button>
              
              <Button
                onClick={() => setShowMockUsers(false)}
                variant="ghost"
                className="w-full text-sm"
              >
                ← Back to login options
              </Button>
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full neon-button py-4 font-bold tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLoggingIn ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}
            </div>
          </Button>

          <div className="text-center">
            <button
              onClick={onClose}
              disabled={isLoggingIn}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Maybe later
            </button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
