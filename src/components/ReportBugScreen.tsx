import { ArrowLeft, Bug, Send, Camera, Smartphone } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner@2.0.3"

interface ReportBugScreenProps {
  onBack: () => void
}

type BugType = 'crash' | 'ui' | 'performance' | 'feature' | 'other'

export function ReportBugScreen({ onBack }: ReportBugScreenProps) {
  const [bugType, setBugType] = useState<BugType>('other')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stepsToReproduce, setStepsToReproduce] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const bugTypes = [
    { id: 'crash' as BugType, label: 'App Crash/Freeze', description: 'App stops working or becomes unresponsive' },
    { id: 'ui' as BugType, label: 'UI/Display Issue', description: 'Visual glitches, layout problems, or design bugs' },
    { id: 'performance' as BugType, label: 'Performance Issue', description: 'Slow loading, lag, or battery drain' },
    { id: 'feature' as BugType, label: 'Feature Not Working', description: 'Specific functionality not working as expected' },
    { id: 'other' as BugType, label: 'Other Issue', description: 'Any other technical problem' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Bug report submitted successfully! Thank you for helping us improve TagAlong.")
      
      // Reset form
      setTitle('')
      setDescription('')
      setStepsToReproduce('')
      setBugType('other')
      
      // Navigate back after a short delay
      setTimeout(() => {
        onBack()
      }, 2000)
      
    } catch (error) {
      toast.error("Failed to submit bug report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get device info for the report
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    const language = navigator.language
    
    return {
      userAgent,
      platform,
      language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hud-card sticky top-0 z-50 p-4 border-b border-border backdrop-blur-md bg-background/90">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="gaming-filter p-2 rounded-lg hover:border-neon-cyan hover:text-neon-cyan transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">REPORT A BUG</h1>
            <p className="text-sm text-muted-foreground">Help us fix issues and improve the app</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bug Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground uppercase tracking-wider">
              BUG TYPE *
            </label>
            <div className="space-y-2">
              {bugTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setBugType(type.id)}
                  className={`gaming-filter w-full p-3 text-left ${
                    bugType === type.id ? 'active' : ''
                  }`}
                >
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bug Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground uppercase tracking-wider">
              BUG TITLE *
            </label>
            <input
              type="text"
              inputMode="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, descriptive title for the bug"
              className="w-full p-3 bg-input-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:outline-none transition-colors mobile-form-input"
              style={{ fontSize: '16px', pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              maxLength={80}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
            />
            <p className="text-xs text-muted-foreground">{title.length}/80 characters</p>
          </div>

          {/* Bug Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground uppercase tracking-wider">
              DESCRIPTION *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, what you expected to happen, and any error messages you saw."
              rows={4}
              className="w-full p-3 bg-input-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:outline-none transition-colors resize-none mobile-form-input"
              style={{ fontSize: '16px', pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              maxLength={500}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
            />
            <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
          </div>

          {/* Steps to Reproduce */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground uppercase tracking-wider">
              STEPS TO REPRODUCE (OPTIONAL)
            </label>
            <textarea
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              placeholder="1. Go to...&#10;2. Tap on...&#10;3. See error..."
              rows={4}
              className="w-full p-3 bg-input-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:outline-none transition-colors resize-none mobile-form-input"
              style={{ fontSize: '16px', pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              maxLength={400}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
            />
            <p className="text-xs text-muted-foreground">{stepsToReproduce.length}/400 characters</p>
          </div>

          {/* Screenshot Note */}
          <div className="hud-card p-4 border border-neon-orange/30 bg-neon-orange/5">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-neon-orange" />
              Screenshots Help!
            </h3>
            <p className="text-sm text-muted-foreground">
              If possible, take a screenshot of the bug and include it in your device's photos. 
              You can reference it in your description or send it separately to our support team.
            </p>
          </div>

          {/* Device Info */}
          <div className="hud-card p-4 border border-muted">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-neon-cyan" />
              Device Information
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Platform: {navigator.platform}</p>
              <p>Screen Size: {window.screen.width}x{window.screen.height}</p>
              <p>Language: {navigator.language}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This information will be automatically included with your report to help us debug the issue.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="w-full neon-button px-6 py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SUBMITTING REPORT...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                SUBMIT BUG REPORT
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-foreground">Tips for good bug reports:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Be specific about what went wrong</p>
            <p>• Include exact error messages if any</p>
            <p>• Mention what you were trying to do when the bug occurred</p>
            <p>• Note if the bug happens consistently or randomly</p>
          </div>
        </div>
      </div>
    </div>
  )
}