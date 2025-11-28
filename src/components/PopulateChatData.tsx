import { useState } from 'react'
import { Button } from './ui/button'
import { populateChatData, populateChatDataForUser } from '../firebase/populate-chat-data'
import { populateQuestDataForUser, populateUserQuestData } from '../firebase/quests'
import { useFirebase } from '../contexts/FirebaseContext'
import { toast } from 'sonner'
import { UpdateCurrency } from './UpdateCurrency'

export function PopulateChatData() {
  const { user } = useFirebase()
  const [loading, setLoading] = useState(false)

  const handlePopulateData = async () => {
    if (!user) {
      toast.error('Please log in first to populate data')
      return
    }

    setLoading(true)
    try {
      const result = await populateChatDataForUser(user.uid)
      
      if (result.success) {
        toast.success(`Successfully created ${result.chatCount} chats with messages!`, {
          description: `Mock chat data has been added to Firebase for user: ${user.uid}`
        })
      } else {
        toast.error('Failed to populate chat data')
      }
    } catch (error: any) {
      console.error('Error populating chat data:', error)
      toast.error(`Error populating chat data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePopulateQuestData = async () => {
    if (!user) {
      toast.error('Please log in first to populate data')
      return
    }

    setLoading(true)
    try {
      const result = await populateQuestDataForUser(user.uid, user.displayName || 'Test User')
      
      if (result.success) {
        toast.success(`Successfully created ${result.questCount} quests!`, {
          description: `Mock quest data has been added to Firebase for user: ${user.uid}`
        })
      } else {
        toast.error('Failed to populate quest data')
      }
    } catch (error: any) {
      console.error('Error populating quest data:', error)
      toast.error(`Error populating quest data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePopulateSavedJoinedQuests = async () => {
    if (!user) {
      toast.error('Please log in first to populate data')
      return
    }

    setLoading(true)
    try {
      const result = await populateUserQuestData(user.uid)
      
      if (result.success) {
        toast.success(`Successfully created ${result.otherQuestCount} other quests and updated user profile!`, {
          description: `User now has ${result.savedQuestCount} saved quests and ${result.joinedQuestCount} joined quests`
        })
      } else {
        toast.error('Failed to populate saved/joined quest data')
      }
    } catch (error: any) {
      console.error('Error populating saved/joined quest data:', error)
      toast.error(`Error populating saved/joined quest data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="gaming-panel p-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">Populate Test Data</h2>
        <p className="text-muted-foreground mb-4">
          This will add sample data to Firebase for testing purposes.
        </p>
        
        {!user && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-600 text-sm">
              ⚠️ Please log in first to populate data
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Button 
            onClick={handlePopulateData}
            disabled={loading || !user}
            className="neon-button w-full"
          >
            {loading ? 'Populating...' : 'Populate Chat Data'}
          </Button>
          
          <Button 
            onClick={handlePopulateQuestData}
            disabled={loading || !user}
            className="gaming-filter w-full"
          >
            {loading ? 'Populating...' : 'Populate Quest Data'}
          </Button>
          
          <Button 
            onClick={handlePopulateSavedJoinedQuests}
            disabled={loading || !user}
            className="gaming-filter w-full"
          >
            {loading ? 'Populating...' : 'Populate Saved/Joined Quests'}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p><strong>User Status:</strong> {user ? `Logged in as ${user.email}` : 'Not logged in'}</p>
        </div>
      </div>

      <div className="mt-4">
        <UpdateCurrency />
      </div>
    </div>
  )
}
