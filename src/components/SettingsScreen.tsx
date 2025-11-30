import { useState } from "react"
import { ArrowLeft, User, Settings, Bell, HelpCircle, LogOut, Trash2, Edit, Camera } from "lucide-react"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { toast } from "sonner"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useFirebase } from "../contexts/FirebaseContext"

interface SettingsScreenProps {
  onBack: () => void
  onEditProfile: () => void
  onLogout: () => void
  onDeleteAccount: () => void
  onOpenFAQ: () => void
  onOpenContactSupport: () => void
  onOpenReportBug: () => void
  onOpenPrivacyPolicy: () => void
  onOpenTermsOfService: () => void
}

// Mock user data - in real app this would come from user context/state
const mockUserData = {
  username: "QuestMaster_Arjun",
  fullName: "Arjun Kumar",
  email: "arjun.kumar@example.com",
  phone: "+91 98765 43210",
  age: 28,
  gender: "Male",
  city: "Bangalore",
  joinedDate: "2024-01-15",
  bio: "Adventure enthusiast and coffee lover! Always looking for new experiences and great people to share them with. Love exploring hidden gems around the city! 🌟",
  profileImage: null,
  interests: ["Adventure", "Coffee", "Photography", "Gaming", "Food & Drinks"],
  completedQuests: 47,
  organizedQuests: 12,
  rating: 4.8,
  level: "Explorer"
}

export function SettingsScreen({ onBack, onEditProfile, onLogout, onDeleteAccount, onOpenFAQ, onOpenContactSupport, onOpenReportBug, onOpenPrivacyPolicy, onOpenTermsOfService }: SettingsScreenProps) {
  const { isMockUser } = useFirebase()
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    questUpdates: true,
    messages: true,
    joinRequests: true,
    questReminders: true
  })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    toast.success("Notification preference updated")
  }

  const handleLogout = async () => {
    try {
      // Handle mock user logout
      if (isMockUser) {
        // Remove mock user from localStorage
        localStorage.removeItem('mockUser')
        // Dispatch logout event to update Firebase context
        window.dispatchEvent(new CustomEvent('mockUserLogout'))
        // Call onLogout to update app state (it will show success toast)
        // Note: onLogout will try to sign out from Firebase, which is safe even for mock users
        await onLogout()
      } else {
        // For real Firebase users, call the onLogout prop which handles Firebase sign out
        await onLogout()
      }
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error(error.message || 'Failed to logout')
    }
  }

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false)
    toast.success("Account deletion request submitted")
    setTimeout(() => {
      onDeleteAccount()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hud-card m-4 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-green/10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-input-background border border-border hover:border-neon-cyan transition-colors flex items-center justify-center touch-manipulation active:scale-[0.95]"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-neon-cyan transition-colors" />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-5 h-5 text-neon-cyan" />
                <h1 className="text-lg font-bold text-foreground">ACCOUNT & SETTINGS</h1>
              </div>
              <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-8">
        {/* Profile Section */}
        <div className="hud-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-neon-cyan bg-input-background flex items-center justify-center overflow-hidden">
                {mockUserData.profileImage ? (
                  <ImageWithFallback 
                    src={mockUserData.profileImage} 
                    alt={mockUserData.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-neon-cyan" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-neon-orange hover:bg-neon-orange/80 transition-colors flex items-center justify-center border-2 border-white touch-manipulation active:scale-[0.95]"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1">{mockUserData.username}</h3>
              <p className="text-sm text-muted-foreground mb-2">{mockUserData.fullName}</p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 rounded-full">
                  <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">{mockUserData.level}</span>
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green/30 rounded-full">
                  <span className="text-xs font-bold text-neon-green">⭐ {mockUserData.rating}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEditProfile}
              className="gaming-filter px-4 py-2 font-bold hover:border-neon-cyan hover:text-neon-cyan transition-all uppercase tracking-wider flex items-center justify-center gap-2 touch-manipulation active:scale-[0.98]"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <Edit className="w-4 h-4" />
              EDIT
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{mockUserData.completedQuests}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{mockUserData.organizedQuests}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Organized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {new Date().getFullYear() - new Date(mockUserData.joinedDate).getFullYear()}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Years</div>
            </div>
          </div>
        </div>



        {/* Notification Settings */}
        <div className="hud-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-neon-cyan" />
            NOTIFICATIONS
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about important updates</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={() => handleNotificationToggle('pushNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Quest Updates</p>
                <p className="text-xs text-muted-foreground">Changes to quests you've joined</p>
              </div>
              <Switch
                checked={notifications.questUpdates}
                onCheckedChange={() => handleNotificationToggle('questUpdates')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Messages</p>
                <p className="text-xs text-muted-foreground">New messages and chat notifications</p>
              </div>
              <Switch
                checked={notifications.messages}
                onCheckedChange={() => handleNotificationToggle('messages')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Join Requests</p>
                <p className="text-xs text-muted-foreground">When someone wants to join your quest</p>
              </div>
              <Switch
                checked={notifications.joinRequests}
                onCheckedChange={() => handleNotificationToggle('joinRequests')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Quest Reminders</p>
                <p className="text-xs text-muted-foreground">Reminders before quest start time</p>
              </div>
              <Switch
                checked={notifications.questReminders}
                onCheckedChange={() => handleNotificationToggle('questReminders')}
              />
            </div>
            

          </div>
        </div>



        {/* Help & Support */}
        <div className="hud-card p-6 relative z-10">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-neon-purple" />
            HELP & SUPPORT
          </h2>
          
          <div className="space-y-3 relative z-10">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('FAQ button clicked')
                onOpenFAQ()
              }}
              className="w-full text-left p-3 bg-input-background hover:bg-muted rounded-lg border border-border hover:border-neon-purple transition-colors cursor-pointer relative z-10 touch-manipulation active:scale-[0.98]"
              style={{ pointerEvents: 'auto' }}
            >
              <p className="text-sm font-medium text-foreground pointer-events-none">FAQ & Help Center</p>
              <p className="text-xs text-muted-foreground pointer-events-none">Common questions and guides</p>
            </button>
            
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Contact Support button clicked')
                onOpenContactSupport()
              }}
              className="w-full text-left p-3 bg-input-background hover:bg-muted rounded-lg border border-border hover:border-neon-purple transition-colors cursor-pointer relative z-10 touch-manipulation active:scale-[0.98]"
              style={{ pointerEvents: 'auto' }}
            >
              <p className="text-sm font-medium text-foreground pointer-events-none">Contact Support</p>
              <p className="text-xs text-muted-foreground pointer-events-none">Get help from our team</p>
            </button>
            
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Report Bug button clicked')
                onOpenReportBug()
              }}
              className="w-full text-left p-3 bg-input-background hover:bg-muted rounded-lg border border-border hover:border-neon-purple transition-colors cursor-pointer relative z-10 touch-manipulation active:scale-[0.98]"
              style={{ pointerEvents: 'auto' }}
            >
              <p className="text-sm font-medium text-foreground pointer-events-none">Report a Problem</p>
              <p className="text-xs text-muted-foreground pointer-events-none">Report bugs or issues</p>
            </button>
            
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Privacy Policy button clicked')
                onOpenPrivacyPolicy()
              }}
              className="w-full text-left p-3 bg-input-background hover:bg-muted rounded-lg border border-border hover:border-neon-purple transition-colors cursor-pointer relative z-10 touch-manipulation active:scale-[0.98]"
              style={{ pointerEvents: 'auto' }}
            >
              <p className="text-sm font-medium text-foreground pointer-events-none">Privacy Policy</p>
              <p className="text-xs text-muted-foreground pointer-events-none">How we protect your data</p>
            </button>
            
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Terms of Service button clicked')
                onOpenTermsOfService()
              }}
              className="w-full text-left p-3 bg-input-background hover:bg-muted rounded-lg border border-border hover:border-neon-purple transition-colors cursor-pointer relative z-10 touch-manipulation active:scale-[0.98]"
              style={{ pointerEvents: 'auto' }}
            >
              <p className="text-sm font-medium text-foreground pointer-events-none">Terms of Service</p>
              <p className="text-xs text-muted-foreground pointer-events-none">Your agreement to use TouchGrass</p>
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full py-4 border-neon-orange text-neon-orange hover:bg-neon-orange/10 flex items-center justify-center gap-2 font-bold"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </Button>
          
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            variant="outline"
            className="w-full py-4 border-destructive text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2 font-bold"
          >
            <Trash2 className="w-4 h-4" />
            DELETE ACCOUNT
          </Button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="hud-card w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">DELETE ACCOUNT</h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All your quests, messages, and profile data will be permanently deleted.
              </p>
            </div>

            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-destructive font-medium mb-2">⚠️ You will lose:</p>
              <ul className="text-xs text-destructive space-y-1">
                <li>• All your organized and joined quests</li>
                <li>• Chat history and messages</li>
                <li>• Profile data and achievements</li>
                <li>• Connections and friend list</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                className="flex-1 py-3 font-bold"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-destructive hover:bg-destructive/80 text-white font-bold"
              >
                DELETE PERMANENTLY
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}