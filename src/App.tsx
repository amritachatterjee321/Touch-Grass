import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { GameHeader } from "./components/GameHeader"
import { QuestBoard } from "./components/QuestBoard"
import { MyQuests } from "./components/MyQuests"  
import { Chats } from "./components/Chats"
import { ChatScreen } from "./components/ChatScreen"
import { ProfileScreen } from "./components/ProfileScreen"
import { ProfileCreationScreen } from "./components/ProfileCreationScreen"
import { NotificationScreen } from "./components/NotificationScreen"
import { SettingsScreen } from "./components/SettingsScreen"
import { ChatDebugger } from "./components/ChatDebugger"
import { PopulateChatData } from "./components/PopulateChatData"
import { QuestCreationScreen } from "./components/QuestCreationScreen"
import { QuestFeedbackScreen } from "./components/QuestFeedbackScreen"
import { QuestApprovalScreen } from "./components/QuestApprovalScreen"
import { FAQScreen } from "./components/FAQScreen"
import { ContactSupportScreen } from "./components/ContactSupportScreen"
import { ReportBugScreen } from "./components/ReportBugScreen"
import { PrivacyPolicyScreen } from "./components/PrivacyPolicyScreen"
import { TermsOfServiceScreen } from "./components/TermsOfServiceScreen"
import { GoogleLoginModal } from "./components/GoogleLoginModal"
import { BottomNavigation } from "./components/BottomNavigation"
import { Toaster } from "sonner"
import { FirebaseProvider, useFirebase } from "./contexts/FirebaseContext"
import { signInWithGoogle, signOutUser } from "./firebase/auth"
import { getUserProfile, createUserProfile, deleteUserAccount } from "./firebase/users"
import { toast } from "sonner"

type ActiveScreen = 'board' | 'my-quests' | 'chats' | 'chat-detail' | 'profile' | 'create-quest' | 'profile-creation' | 'notifications' | 'settings' | 'chat-debug' | 'populate-data' | 'quest-feedback' | 'quest-approval' | 'faq' | 'contact-support' | 'report-bug' | 'privacy-policy' | 'terms-of-service'

// Firebase-powered main app component
function AppContent() {
  const { user, quests, isMockUser } = useFirebase()
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('board')
  const [questToEdit, setQuestToEdit] = useState<any>(null)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeChatTitle, setActiveChatTitle] = useState<string>('')
  const [questFeedbackTitle, setQuestFeedbackTitle] = useState<string>('')
  const [questFeedbackId, setQuestFeedbackId] = useState<string>('')
  const [selectedJoinRequest, setSelectedJoinRequest] = useState<any>(null)
  const [isProfileCompleted, setIsProfileCompleted] = useState(false) // Start with incomplete profile
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Track login state
  const [isGoogleLoginModalOpen, setIsGoogleLoginModalOpen] = useState(false)
  const [pendingQuestCreation, setPendingQuestCreation] = useState(false) // Track if quest creation was requested before login
  const [pendingNavigationTab, setPendingNavigationTab] = useState<'my-quests' | 'chats' | 'profile' | null>(null) // Track which tab user wanted to navigate to
  const [existingProfileData, setExistingProfileData] = useState<any>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [badgesRefreshTrigger, setBadgesRefreshTrigger] = useState(0)
  
  // Update login state when Firebase user changes
  useEffect(() => {
    console.log('🔥 User state changed:', user ? `User logged in: ${user.email}` : 'No user')
    setIsLoggedIn(!!user)
    
    // Check profile completion when user logs in
    if (user) {
      checkUserProfileCompletion().then((isCompleted) => {
        console.log('✅ Profile completion check finished:', isCompleted)
        
        // If profile is not completed, redirect to profile creation
        if (!isCompleted) {
          console.log('📱 Redirecting to profile creation for new/incomplete user')
          setActiveScreen('profile-creation')
        }
      })
    } else {
      setIsProfileCompleted(false)
      setUserProfile(null)
    }
  }, [user])

  // Listen for Google login success events (for first-time users)
  useEffect(() => {
    const handleGoogleLoginSuccess = async (event: any) => {
      const { userId, needsProfile } = event.detail || {}
      
      if (needsProfile && userId) {
        console.log('📱 Google login success - redirecting to profile creation')
        // Wait a moment for auth state to update
        setTimeout(() => {
          setActiveScreen('profile-creation')
        }, 300)
      }
    }

    window.addEventListener('googleLoginSuccess', handleGoogleLoginSuccess as EventListener)
    
    return () => {
      window.removeEventListener('googleLoginSuccess', handleGoogleLoginSuccess as EventListener)
    }
  }, [])

  // Check if user has completed their profile
  const checkUserProfileCompletion = async () => {
    if (!user) {
      setIsProfileCompleted(false)
      setUserProfile(null)
      return false
    }

    try {
      const profile = await getUserProfile(user.uid)
      if (profile && profile.isProfileCompleted) {
        setIsProfileCompleted(true)
        setUserProfile(profile) // Store the full profile including savedQuests
        console.log('✅ User profile is completed')
        return true
      } else {
        setIsProfileCompleted(false)
        setUserProfile(profile) // Store profile even if incomplete
        console.log('⚠️ User profile needs completion')
        return false
      }
    } catch (error) {
      console.error('❌ Error checking user profile completion:', error)
      setIsProfileCompleted(false)
      setUserProfile(null)
      return false
    }
  }

  const handleNavigation = (tab: 'board' | 'my-quests' | 'chats' | 'profile') => {
    // Allow 'board' tab for logged-out users
    if (tab === 'board') {
      setActiveScreen(tab)
      setQuestToEdit(null)
      setActiveChatId(null)
      return
    }
    
    // For profile tab, refresh profile data when navigating
    if (tab === 'profile' && user) {
      // Trigger refresh by updating the refresh trigger
      setBadgesRefreshTrigger(prev => prev + 1)
    }
    
    // For 'my-quests', 'chats', or 'profile', check if user is logged in
    if (!user && (tab === 'my-quests' || tab === 'chats' || tab === 'profile')) {
      // User is logged out, open login modal and store the desired tab
      setPendingNavigationTab(tab)
      setIsGoogleLoginModalOpen(true)
      return
    }
    
    // User is logged in, proceed with navigation
    setActiveScreen(tab)
    setQuestToEdit(null) // Clear edit mode when navigating
    setActiveChatId(null) // Clear chat when navigating
  }

  const handleOpenNotifications = () => {
    setActiveScreen('notifications')
  }

  const handleOpenSettings = () => {
    setActiveScreen('settings')
  }

  const handleOpenChatDebug = () => {
    setActiveScreen('chat-debug')
  }

  const handleOpenPopulateData = () => {
    setActiveScreen('populate-data')
  }

  const handleEditQuest = (quest: any) => {
    setQuestToEdit(quest)
    setActiveScreen('create-quest')
  }

  const handleCreateQuest = () => {
    if (!user) {
      // User not logged in, show Google login modal for quest creation
      setPendingQuestCreation(true) 
      setIsGoogleLoginModalOpen(true)
      setActiveScreen('create-quest') // Navigate to create quest but show login modal
      return
    }
    // User is logged in, proceed to quest creation
    setQuestToEdit(null)
    setActiveScreen('create-quest')
  }

  const handleDiscardQuest = () => {
    if (questToEdit) {
      // If editing, go back to my-quests
      setActiveScreen('my-quests')
    } else {
      // If creating new quest, go back to board
      setActiveScreen('board')
    }
    setQuestToEdit(null)
  }

  const handleQuestSaved = (questData: any) => {
    // Handle deletion case (null data)
    if (questData === null) {
      console.log('🗑️ Quest deleted by user')
      // Navigate to appropriate screen after deletion
      setActiveScreen('my-quests')
      setQuestToEdit(null)
      return
    }

    console.log('✅ Quest operation completed:', questData)
    
    // Navigate to appropriate screen after success
    if (questToEdit) {
      setActiveScreen('my-quests')
    } else {
      setActiveScreen('board')
    }
    setQuestToEdit(null)
  }

  const handleOpenChat = (chatId: string, questTitle: string) => {
    setActiveChatId(chatId)
    setActiveChatTitle(questTitle)
    setActiveScreen('chat-detail')
  }

  const handleBackToChats = () => {
    setActiveScreen('chats')
    setActiveChatId(null)
    setActiveChatTitle('')
  }

  const handleLeaveChat = () => {
    // Navigate back to chats and clear chat state
    setActiveScreen('chats')
    setActiveChatId(null)
    setActiveChatTitle('')
  }

  const handleOpenQuestFeedback = (questTitle: string, questId: string) => {
    setQuestFeedbackTitle(questTitle)
    setQuestFeedbackId(questId)
    setActiveScreen('quest-feedback')
  }

  const handleBackFromQuestFeedback = () => {
    setActiveScreen('my-quests')
    setQuestFeedbackTitle('')
    setQuestFeedbackId('')
  }

  const handleSubmitQuestFeedback = (feedback: any) => {
    console.log('Quest feedback submitted:', feedback)
    toast.success('Feedback submitted successfully! 🎉')
    // Trigger badge refresh in MyQuests component
    setBadgesRefreshTrigger(prev => prev + 1)
    // Navigate back to my-quests after feedback submission
    setActiveScreen('my-quests')
    setQuestFeedbackTitle('')
  }

  const handleViewJoinRequest = (request: any) => {
    setSelectedJoinRequest(request)
    setActiveScreen('quest-approval')
  }

  const handleApproveJoinRequest = (requestId: string) => {
    console.log('Approving join request:', requestId)
    toast.success('Request approved! 🎉')
    setActiveScreen('my-quests')
    setSelectedJoinRequest(null)
  }

  const handleRejectJoinRequest = (requestId: string) => {
    console.log('Rejecting join request:', requestId)
    toast.success('Request declined')
    setActiveScreen('my-quests')
    setSelectedJoinRequest(null)
  }

  const handleProfileComplete = async (profileData: any) => {
    try {
      console.log('Profile created:', profileData)
      
      if (!user) {
        toast.error("No user found. Please log in again.")
        return
      }

      if (!user.uid) {
        toast.error("Invalid user account. Please log in again.")
        console.error('❌ User object missing uid:', user)
        return
      }

      // Validate required profile data
      if (!profileData.username || profileData.username.trim().length < 3) {
        toast.error("Username must be at least 3 characters")
        return
      }

      if (!profileData.age || parseInt(profileData.age) < 13 || parseInt(profileData.age) > 100) {
        toast.error("Please enter a valid age (13-100)")
        return
      }

      if (!profileData.city || !profileData.city.trim()) {
        toast.error("City is required")
        return
      }

      if (!profileData.personalityType) {
        toast.error("Please select your personality type")
        return
      }

      // Upload profile image to Firebase Storage if it's a base64 string
      let profileImageUrl = profileData.profileImage || null
      
      if (profileImageUrl && profileImageUrl.startsWith('data:image')) {
        try {
          console.log('📤 Uploading profile image to Firebase Storage...')
          const { uploadBase64ImageToStorage } = await import('./firebase/storage')
          const imagePath = `profile-images/${user.uid}/${Date.now()}.jpg`
          profileImageUrl = await uploadBase64ImageToStorage(profileImageUrl, imagePath)
          console.log('✅ Profile image uploaded to Storage:', profileImageUrl)
        } catch (uploadError: any) {
          console.error('❌ Error uploading profile image:', uploadError)
          toast.error('Failed to upload profile image. Profile will be saved without image.')
          profileImageUrl = null
        }
      }

      // Save profile to Firebase
      const firebaseProfileData = {
        username: profileData.username.trim() || 'Anonymous',
        displayName: profileData.username.trim() || 'Anonymous User',
        age: parseInt(profileData.age) || 18,
        city: profileData.city.trim() || '',
        gender: profileData.gender || '',
        bio: profileData.bio?.trim() || '',
        personalityType: (profileData.personalityType as 'introvert' | 'extrovert' | 'ambivert' | 'mysterious') || 'introvert',
        interests: profileData.interests || [],
        profileImage: profileImageUrl, // Store URL instead of base64
        isProfileCompleted: true
      }

      console.log('🚀 Step 2: Updating user profile with complete details...')
      console.log('👤 User info:', { uid: user.uid, email: user.email, displayName: user.displayName })
      console.log('📝 Profile data to save:', {
        username: firebaseProfileData.username,
        age: firebaseProfileData.age,
        city: firebaseProfileData.city,
        gender: firebaseProfileData.gender,
        personalityType: firebaseProfileData.personalityType,
        hasProfileImage: !!firebaseProfileData.profileImage
      })
      
      // This will UPDATE the existing document (created in Step 1) using merge: true
      // The document ID is user.uid, so it updates the same document
      const savedProfile = await createUserProfile(user, firebaseProfileData)
      console.log('✅ Step 2 Complete: User profile updated successfully in Firebase')
      console.log('📋 Same document updated (not recreated) - Document ID:', user.uid)
      
      setIsProfileCompleted(true)
      setIsLoggedIn(true) // User is now logged in after profile completion
      setExistingProfileData(null) // Clear existing profile data after save
      
      // Refresh profile data by updating the trigger
      setBadgesRefreshTrigger(prev => prev + 1)
      
      // Also refresh the user profile in App state
      if (user) {
        try {
          const updatedProfile = await getUserProfile(user.uid)
          setUserProfile(updatedProfile)
        } catch (error) {
          console.error('Error refreshing profile after update:', error)
        }
      }
      
      toast.success("Profile completed successfully! 🎉", {
        description: "Welcome to TouchGrass!"
      })
      
      // Check if user originally wanted to create a quest or navigate to a tab
      if (pendingQuestCreation) {
        setPendingQuestCreation(false) // Clear the pending flag
        setActiveScreen('create-quest') // Redirect to quest creation after profile completion
      } else if (pendingNavigationTab) {
        const tab = pendingNavigationTab
        setPendingNavigationTab(null) // Clear the pending flag
        setActiveScreen(tab) // Navigate to the requested tab after profile completion
      } else if (isEditingProfile) {
        setIsEditingProfile(false) // Clear the edit flag
        setActiveScreen('settings') // Navigate back to settings after editing
      } else {
        setActiveScreen('board') // Navigate to main app after profile completion 
      }
    } catch (error: any) {
      console.error('❌ Error saving user profile:', error)
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        user: user ? { uid: user.uid, email: user.email } : null,
        profileData: profileData
      })
      
      // Provide more specific error messages
      let errorMessage = "Failed to save profile"
      if (error.message?.includes('permission')) {
        errorMessage = "Permission denied. Please check your Firebase security rules."
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your internet connection."
      } else if (error.message) {
        errorMessage = `Failed to save profile: ${error.message}`
      }
      
      toast.error(errorMessage)
      // Don't redirect if saving failed
    }
  }

  const handleProfileCreationExit = () => {
    if (isEditingProfile) {
      setIsEditingProfile(false)
      setExistingProfileData(null)
      setActiveScreen('settings') // Navigate back to settings if editing
    } else {
      setActiveScreen('board') // Navigate back to main app
    }
  }

  const handleGoogleSignIn = () => {
    // Open the Google login modal instead of calling signInWithGoogle directly
    // This prevents duplicate popups
    console.log('🔄 Opening Google login modal...')
    setIsGoogleLoginModalOpen(true)
    // Set a handler that will be called after successful login
    // The modal will handle the actual sign-in
  }

  const handleGoogleLoginForQuestCreation = async () => {
    try {
      // Note: signInWithGoogle is now called directly in GoogleLoginModal
      // This handler is called after successful login
      const currentUser = user || (await new Promise((resolve) => {
        // Wait a bit for auth state to update
        setTimeout(() => {
          const { getCurrentUser } = require('./firebase/auth')
          resolve(getCurrentUser())
        }, 300)
      }))
      
      if (currentUser) {
        setIsGoogleLoginModalOpen(false)
        
        // Check if user needs profile completion before quest creation
        setTimeout(async () => {
          const profile = await getUserProfile(currentUser.uid)
          if (!profile || !profile.isProfileCompleted) {
            console.log('📱 User needs profile completion for quest creation')
            setActiveScreen('profile-creation')
          } else {
            console.log('📱 User profile ready, proceeding to quest creation')
            setActiveScreen('create-quest')
          }
        }, 500)
        
        setQuestToEdit(null) // Ensure fresh quest creation
      }
    } catch (error: any) {
      console.error('Error after Google login:', error)
      setIsGoogleLoginModalOpen(false)
    }
  }

  const handleMockLoginForQuestCreation = async () => {
    try {
      console.log('🎭 Mock login success - closing modal and proceeding')
      setIsGoogleLoginModalOpen(false)
      
      // For mock users, we can proceed directly to quest creation
      // since they don't need profile completion
      setActiveScreen('create-quest')
      setQuestToEdit(null)
      
      toast.success('Mock login successful! 🎉')
    } catch (error: any) {
      console.error('Mock login success handler error:', error)
    }
  }

  const handleGoogleLoginForNavigation = async () => {
    try {
      // Note: signInWithGoogle is now called directly in GoogleLoginModal
      // This handler is called after successful login, so user should be available from context
      setIsGoogleLoginModalOpen(false)
      
      // Wait a moment for auth state to update
      setTimeout(async () => {
        if (user) {
          // Check if user needs profile completion before navigation
          const profile = await getUserProfile(user.uid)
          if (!profile || !profile.isProfileCompleted) {
            console.log('📱 User needs profile completion before navigation')
            setActiveScreen('profile-creation')
          } else {
            console.log('📱 User profile ready, navigating to requested tab')
            // Navigate to the tab the user originally wanted
            if (pendingNavigationTab) {
              setActiveScreen(pendingNavigationTab)
              setPendingNavigationTab(null)
            }
          }
        }
      }, 500)
    } catch (error: any) {
      console.error('Error after Google login:', error)
      setIsGoogleLoginModalOpen(false)
    }
  }

  const handleMockLoginForNavigation = async () => {
    try {
      console.log('🎭 Mock login success - closing modal and navigating')
      setIsGoogleLoginModalOpen(false)
      
      // For mock users, navigate directly to the requested tab
      if (pendingNavigationTab) {
        setActiveScreen(pendingNavigationTab)
        setPendingNavigationTab(null)
      }
      
      toast.success('Mock login successful! 🎉')
    } catch (error: any) {
      console.error('Mock login success handler error:', error)
    }
  }

  const handleCloseGoogleLoginModal = () => {
    setIsGoogleLoginModalOpen(false)
    setPendingQuestCreation(false) // Clear pending quest flag if cancelled
    setPendingNavigationTab(null) // Clear pending navigation tab if cancelled
    // Navigate back to board if they cancel
    setActiveScreen('board')
  }



  const renderScreen = () => {
    switch (activeScreen) {
      case 'board':
        return <QuestBoard 
          isProfileCompleted={isProfileCompleted} 
          onStartProfileCreation={() => setActiveScreen('profile-creation')} 
          isLoggedIn={isLoggedIn}
          quests={quests}
          onQuestSaved={handleQuestSaved}
          onGoogleSignIn={handleGoogleSignIn}
          userUid={user?.uid}
          savedQuests={userProfile?.savedQuests || []}
          onQuestSaveToggle={() => checkUserProfileCompletion()}
        />
      case 'my-quests':
        if (!user) {
          // This shouldn't happen since handleNavigation prevents it, but keep as fallback
          return <QuestBoard 
            isProfileCompleted={isProfileCompleted} 
            onStartProfileCreation={() => setActiveScreen('profile-creation')} 
            isLoggedIn={isLoggedIn}
            quests={quests}
            onQuestSaved={handleQuestSaved}
            onGoogleSignIn={handleGoogleSignIn}
            userUid={undefined}
          />
        }
        return <MyQuests 
          onEditQuest={handleEditQuest} 
          onNavigateToChats={() => setActiveScreen('chats')} 
          onOpenChat={handleOpenChat} 
          onOpenQuestFeedback={handleOpenQuestFeedback}
          onViewJoinRequest={handleViewJoinRequest}
          onQuestSaveToggle={() => checkUserProfileCompletion()}
          badgesRefreshTrigger={badgesRefreshTrigger}
        />
      case 'chats':
        if (!user) {
          // This shouldn't happen since handleNavigation prevents it, but keep as fallback
          return <QuestBoard 
            isProfileCompleted={isProfileCompleted} 
            onStartProfileCreation={() => setActiveScreen('profile-creation')} 
            isLoggedIn={isLoggedIn}
            quests={quests}
            onQuestSaved={handleQuestSaved}
            onGoogleSignIn={handleGoogleSignIn}
            userUid={undefined}
          />
        }
        return <Chats onOpenChat={handleOpenChat} userUid={user?.uid} />
      case 'chat-detail':
        if (!user) {
          toast.error('Please log in to view chats')
          setActiveScreen('board')
          return <QuestBoard 
            isProfileCompleted={isProfileCompleted} 
            onStartProfileCreation={() => setActiveScreen('profile-creation')} 
            isLoggedIn={isLoggedIn}
            quests={quests}
            onQuestSaved={handleQuestSaved}
            onGoogleSignIn={handleGoogleSignIn}
            userUid={undefined}
          />
        }
        return activeChatId ? (
          <ChatScreen 
            chatId={activeChatId} 
            questTitle={activeChatTitle}
            onBack={handleBackToChats}
            onLeaveChat={handleLeaveChat}
          />
        ) : <Chats onOpenChat={handleOpenChat} userUid={user?.uid} />
      case 'profile':
        if (!user) {
          // This shouldn't happen since handleNavigation prevents it, but keep as fallback
          return <QuestBoard 
            isProfileCompleted={isProfileCompleted} 
            onStartProfileCreation={() => setActiveScreen('profile-creation')} 
            isLoggedIn={isLoggedIn}
            quests={quests}
            onQuestSaved={handleQuestSaved}
            onGoogleSignIn={handleGoogleSignIn}
            userUid={undefined}
          />
        }
        return <ProfileScreen 
          isProfileCompleted={isProfileCompleted} 
          onStartProfileCreation={() => setActiveScreen('profile-creation')} 
          onEditProfile={() => setActiveScreen('profile-creation')}
          refreshTrigger={badgesRefreshTrigger}
        />
      case 'profile-creation':
        return <ProfileCreationScreen 
          onProfileComplete={handleProfileComplete} 
          onExit={handleProfileCreationExit}
          existingProfile={existingProfileData}
          isEditMode={isEditingProfile}
        />
      case 'create-quest':
        if (!user) {
          // If user not logged in, show login modal overlay only
          return (
            <>
              <GoogleLoginModal
                isOpen={isGoogleLoginModalOpen}
                onClose={handleCloseGoogleLoginModal}
                onLoginSuccess={handleGoogleLoginForQuestCreation}
                onMockLoginSuccess={handleMockLoginForQuestCreation}
                actionType='join'
                questTitle='Create Quest'
              />
              {/* Render a blank screen while modal open - or mini-screen shown to user below modal backdrop */}
              <div className="absolute inset-0 bg-background flex items-center justify-center z-0">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">Login Required</h3>
                  <p className="text-sm text-muted-foreground mt-2">Sign in to create your quest!</p>
                </div>
              </div>
            </>
          )
        }
        return <QuestCreationScreen questToEdit={questToEdit} onQuestSaved={handleQuestSaved} onDiscard={handleDiscardQuest} user={user} />
      case 'notifications':
        return <NotificationScreen 
          onBack={() => setActiveScreen('board')}
          onMarkAllRead={() => {
            // TODO: Implement mark all notifications as read
            toast.success('All notifications marked as read')
          }}
          onNotificationClick={(notification) => {
            // TODO: Handle notification click based on type
            console.log('Notification clicked:', notification)
          }}
        />
      case 'settings':
        return <SettingsScreen 
          onBack={() => setActiveScreen('board')}
          refreshTrigger={badgesRefreshTrigger}
          onEditProfile={async () => {
            if (user) {
              try {
                const profile = await getUserProfile(user.uid)
                if (profile) {
                  // Convert profile to the format expected by ProfileCreationScreen
                  setExistingProfileData({
                    username: profile.username,
                    age: profile.age.toString(),
                    city: profile.city,
                    gender: profile.gender,
                    bio: profile.bio,
                    personalityType: profile.personalityType,
                    interests: profile.interests,
                    profileImage: profile.profileImage || null
                  })
                  setIsEditingProfile(true)
                  setActiveScreen('profile-creation')
                } else {
                  toast.error('Could not load profile data')
                }
              } catch (error) {
                console.error('Error loading profile for editing:', error)
                toast.error('Failed to load profile')
              }
            }
          }}
          onLogout={async () => {
            try {
              await signOutUser()
              setIsLoggedIn(false)
              setIsProfileCompleted(false)
              toast.success('Logged out successfully! 👋')
              setActiveScreen('board')
            } catch (error: any) {
              console.error('Logout error:', error)
              toast.error(error.message || 'Failed to logout')
            }
          }}
          onDeleteAccount={async () => {
            if (!user) {
              toast.error('No user found. Please log in again.')
              return
            }

            try {
              // Show loading toast
              const loadingToast = toast.loading('Deleting account and all associated data...', {
                description: isMockUser ? 'Removing mock user data...' : 'This may take a few moments'
              })

              // Delete the account
              await deleteUserAccount(user.uid, isMockUser || false)
              
              // Dismiss loading toast
              toast.dismiss(loadingToast)
              
              // Clear local state
              setIsLoggedIn(false)
              setIsProfileCompleted(false)
              setUserProfile(null)
              setExistingProfileData(null)
              
              // For mock users, ensure localStorage is cleared and logout event is dispatched
              if (isMockUser) {
                try {
                  localStorage.removeItem('mockUser')
                  window.dispatchEvent(new CustomEvent('mockUserLogout'))
                  console.log('✅ Mock user cleared from localStorage')
                } catch (localError) {
                  console.error('⚠️ Error clearing mock user from localStorage:', localError)
                }
              } else {
                // Sign out real Firebase users
                try {
                  await signOutUser()
                } catch (signOutError) {
                  // If sign out fails, that's okay - account is already deleted
                  console.log('Sign out after deletion:', signOutError)
                }
              }
              
              toast.success('Account deleted successfully', {
                description: isMockUser 
                  ? 'Mock user account removed' 
                  : 'All your data has been permanently removed'
              })
              
              // Navigate to board
              setActiveScreen('board')
            } catch (error: any) {
              console.error('❌ Error deleting account:', error)
              
              // For mock users, even if there's an error, try to clean up localStorage
              if (isMockUser) {
                try {
                  localStorage.removeItem('mockUser')
                  window.dispatchEvent(new CustomEvent('mockUserLogout'))
                  setIsLoggedIn(false)
                  setIsProfileCompleted(false)
                  setUserProfile(null)
                  setActiveScreen('board')
                  
                  toast.success('Mock user account removed', {
                    description: 'Some cleanup steps may have failed, but account is removed'
                  })
                  return
                } catch (localError) {
                  console.error('❌ Failed to clean up mock user:', localError)
                }
              }
              
              toast.error(`Failed to delete account: ${error.message}`)
            }
          }}
          onOpenFAQ={() => {
            console.log('📚 Opening FAQ screen')
            setActiveScreen('faq')
          }}
          onOpenContactSupport={() => {
            console.log('💬 Opening Contact Support screen')
            setActiveScreen('contact-support')
          }}
          onOpenReportBug={() => {
            console.log('🐛 Opening Report Bug screen')
            setActiveScreen('report-bug')
          }}
          onOpenPrivacyPolicy={() => {
            console.log('🔒 Opening Privacy Policy screen')
            setActiveScreen('privacy-policy')
          }}
          onOpenTermsOfService={() => {
            console.log('📜 Opening Terms of Service screen')
            setActiveScreen('terms-of-service')
          }}
        />
      case 'chat-debug':
        return <ChatDebugger />
      case 'populate-data':
        return <PopulateChatData />
      case 'quest-feedback':
        return <QuestFeedbackScreen 
          questTitle={questFeedbackTitle}
          questId={questFeedbackId}
          onBack={handleBackFromQuestFeedback}
          onSubmitFeedback={handleSubmitQuestFeedback}
        />
      case 'quest-approval':
        return selectedJoinRequest ? (
          <QuestApprovalScreen
            joinRequest={selectedJoinRequest}
            onBack={() => setActiveScreen('my-quests')}
            onApprove={handleApproveJoinRequest}
            onReject={handleRejectJoinRequest}
          />
        ) : <MyQuests 
          onEditQuest={handleEditQuest} 
          onNavigateToChats={() => setActiveScreen('chats')} 
          onOpenChat={handleOpenChat} 
          onOpenQuestFeedback={handleOpenQuestFeedback}
          onViewJoinRequest={handleViewJoinRequest}
          onQuestSaveToggle={() => checkUserProfileCompletion()}
          badgesRefreshTrigger={badgesRefreshTrigger}
        />
      case 'faq':
        return <FAQScreen onBack={() => setActiveScreen('settings')} />
      case 'contact-support':
        return <ContactSupportScreen onBack={() => setActiveScreen('settings')} />
      case 'report-bug':
        return <ReportBugScreen onBack={() => setActiveScreen('settings')} />
      case 'privacy-policy':
        return <PrivacyPolicyScreen onBack={() => setActiveScreen('settings')} />
      case 'terms-of-service':
        return <TermsOfServiceScreen onBack={() => setActiveScreen('settings')} />
      default:
        return <QuestBoard />
    }
  }

  return (
    <div className="relative size-full min-h-screen bg-background overflow-x-hidden">
      {/* Mobile viewport meta tag enforced through CSS */}
      <style>{`
        @viewport { width: device-width; initial-scale: 1; }
        html { 
          -webkit-text-size-adjust: 100%; 
          -webkit-tap-highlight-color: transparent;
        }
        body { 
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
      
      {!['chat-detail', 'profile-creation', 'notifications', 'settings', 'chat-debug', 'populate-data', 'quest-feedback', 'quest-approval', 'faq', 'contact-support', 'report-bug', 'privacy-policy', 'terms-of-service'].includes(activeScreen) && <GameHeader onOpenNotifications={handleOpenNotifications} onOpenSettings={handleOpenSettings} />}
      <main 
        className={`${!['chat-detail', 'profile-creation', 'notifications', 'settings', 'chat-debug', 'populate-data', 'quest-feedback', 'quest-approval', 'faq', 'contact-support', 'report-bug', 'privacy-policy', 'terms-of-service'].includes(activeScreen) ? 'pb-24' : 'pb-0'} px-0`}
        style={{
          paddingTop: !['chat-detail', 'profile-creation', 'notifications', 'settings', 'chat-debug', 'populate-data', 'quest-feedback', 'quest-approval', 'faq', 'contact-support', 'report-bug', 'privacy-policy', 'terms-of-service'].includes(activeScreen) 
            ? 'calc(16px + env(safe-area-inset-top) + 64px)' 
            : '0px'
        }}
      >
        {renderScreen()}
      </main>

      {/* Floating Action Button - Only show if profile is completed */}
      {['board', 'my-quests'].includes(activeScreen) && isProfileCompleted && (
        <div 
          className="fixed z-50 touch-manipulation"
          style={{
            bottom: 'calc(112px + env(safe-area-inset-bottom))',
            right: 'max(16px, calc(16px + env(safe-area-inset-right)))',
            width: '56px',
            height: '56px'
          }}
        >
          <button
            onClick={handleCreateQuest}
            className="w-full h-full rounded-full floating-action-button transition-all duration-300 transform active:scale-90 group flex items-center justify-center"
          >
            <Plus 
              size={20} 
              className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform duration-300 group-active:rotate-90 relative z-10" 
            />
            
            {/* Pulse Ring Animation */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-neon-cyan opacity-75"
              style={{
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
          </button>
        </div>
      )}
      
      {/* Hide footer on full-screen experiences */}
      {!['chat-detail', 'profile-creation', 'notifications', 'settings', 'chat-debug', 'populate-data', 'quest-feedback', 'quest-approval', 'faq', 'contact-support', 'report-bug', 'privacy-policy', 'terms-of-service'].includes(activeScreen) && (
        <BottomNavigation 
          activeTab={activeScreen === 'create-quest' ? 'my-quests' : (activeScreen as 'board' | 'my-quests' | 'chats' | 'profile')} 
          onTabChange={handleNavigation}
        />
      )}
      
      {/* Global Login Modal for Navigation (not quest creation) */}
      {isGoogleLoginModalOpen && pendingNavigationTab && !pendingQuestCreation && (
        <GoogleLoginModal
          isOpen={isGoogleLoginModalOpen}
          onClose={handleCloseGoogleLoginModal}
          onLoginSuccess={handleGoogleLoginForNavigation}
          onMockLoginSuccess={handleMockLoginForNavigation}
          actionType='join'
          questTitle={pendingNavigationTab === 'my-quests' ? 'View Quests' : pendingNavigationTab === 'chats' ? 'View Chats' : 'View Profile'}
        />
      )}
      
      {/* Mobile-Optimized Toast notifications */}
      <Toaster 
        position="top-center"
        closeButton
        richColors
        theme="light"
        toastOptions={{
          style: {
            padding: '16px',
            fontSize: '14px'
          }
        }}
      />
    </div>
  )
}

// Main App component with Firebase provider
export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  )
}