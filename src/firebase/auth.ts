import { 
  signInWithPopup, 
  signOut, 
  deleteUser,
  User,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth, googleProvider } from './config'

// Track if sign-in is in progress to prevent duplicate popups
let signInInProgress = false

// Sign in with Google
export const signInWithGoogle = async () => {
  // Prevent multiple simultaneous sign-in attempts
  if (signInInProgress) {
    console.log('⚠️ Sign-in already in progress, ignoring duplicate request')
    throw new Error('Sign-in is already in progress. Please wait.')
  }

  try {
    signInInProgress = true
    console.log('🔄 Starting Google sign-in popup...')
    
    const result = await signInWithPopup(auth, googleProvider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.accessToken
    const user = result.user
    
    console.log('✅ Google sign-in successful')
    return { user, token }
  } catch (error: any) {
    console.error('❌ Google sign-in error:', error)
    // Reset flag on error (unless user cancelled)
    if (error.code !== 'auth/cancelled-popup-request' && 
        error.code !== 'auth/popup-closed-by-user') {
      signInInProgress = false
    } else {
      // User cancelled, reset immediately
      signInInProgress = false
    }
    throw new Error(error.message || 'Failed to sign in with Google')
  } finally {
    // Reset flag after a short delay to allow popup to close
    setTimeout(() => {
      signInInProgress = false
    }, 1000)
  }
}

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out')
  }
}

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser
}

// Listen for auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Get user profile data
export const getUserProfile = (user: User) => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  }
}

// Delete user account from Firebase Authentication
export const deleteAuthUserAccount = async (user: User) => {
  try {
    await deleteUser(user)
    console.log('✅ User account deleted from Firebase Auth')
  } catch (error: any) {
    console.error('❌ Error deleting user account:', error)
    throw new Error(error.message || 'Failed to delete user account')
  }
}
