import { 
  signInWithPopup, 
  signOut, 
  User,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth, googleProvider } from './config'

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.accessToken
    const user = result.user
    
    return { user, token }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google')
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
