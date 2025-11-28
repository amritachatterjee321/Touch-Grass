import { useState } from 'react'
import { updateQuestCurrency } from '../firebase/update-currency'
import { toast } from 'sonner'

export function UpdateCurrency() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [result, setResult] = useState<{ updated: number, skipped: number } | null>(null)

  const handleUpdateCurrency = async () => {
    if (!confirm('This will update ALL quests in the database to use ₹ instead of $. Continue?')) {
      return
    }

    setIsUpdating(true)
    try {
      const migrationResult = await updateQuestCurrency()
      setResult({ updated: migrationResult.updated, skipped: migrationResult.skipped })
      toast.success(`✅ Currency updated! ${migrationResult.updated} quests updated, ${migrationResult.skipped} skipped.`)
    } catch (error: any) {
      console.error('Migration failed:', error)
      toast.error(`Failed to update currency: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <h3 className="font-bold text-lg mb-2">💱 Update Currency</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Update all quest costs from $ to ₹ in the database
      </p>
      
      <button
        onClick={handleUpdateCurrency}
        disabled={isUpdating}
        className={`px-4 py-2 rounded-lg font-bold ${
          isUpdating 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-neon-purple text-white hover:bg-neon-purple/80'
        }`}
      >
        {isUpdating ? '⏳ Updating...' : '🔄 Update Currency'}
      </button>

      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-bold text-green-800">✅ Migration Complete!</p>
          <p className="text-xs text-green-700 mt-1">
            Updated: {result.updated} quests | Skipped: {result.skipped} quests
          </p>
        </div>
      )}
    </div>
  )
}

