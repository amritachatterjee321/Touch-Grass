import { ArrowLeft, Send, Mail, MessageCircle, Bug } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner@2.0.3"

interface ContactSupportScreenProps {
  onBack: () => void
}

type SupportCategory = 'general' | 'technical' | 'account' | 'payment' | 'report'

export function ContactSupportScreen({ onBack }: ContactSupportScreenProps) {
  const [category, setCategory] = useState<SupportCategory>('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { id: 'general' as SupportCategory, label: 'General Inquiry', icon: MessageCircle },
    { id: 'technical' as SupportCategory, label: 'Technical Issue', icon: Bug },
    { id: 'account' as SupportCategory, label: 'Account Help', icon: Mail },
    { id: 'payment' as SupportCategory, label: 'Payment Issue', icon: Mail },
    { id: 'report' as SupportCategory, label: 'Report User/Content', icon: Mail }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Support request submitted successfully! We'll get back to you within 24 hours.")
      
      // Reset form
      setSubject('')
      setMessage('')
      setCategory('general')
      
      // Navigate back after a short delay
      setTimeout(() => {
        onBack()
      }, 2000)
      
    } catch (error) {
      toast.error("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
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
            <h1 className="text-lg font-bold text-foreground">CONTACT SUPPORT</h1>
            <p className="text-sm text-muted-foreground">Get help from our team</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Support Category */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground uppercase tracking-wider">
              SUPPORT CATEGORY *
            </label>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`gaming-filter p-3 text-left flex items-center gap-3 ${
                    category === cat.id ? 'active' : ''
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground uppercase tracking-wider">
              SUBJECT *
            </label>
            <input
              type="text"
              inputMode="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full p-3 bg-input-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:outline-none transition-colors mobile-form-input"
              style={{ fontSize: '16px', pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              maxLength={100}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
            />
            <p className="text-xs text-muted-foreground">{subject.length}/100 characters</p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground uppercase tracking-wider">
              MESSAGE *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide detailed information about your issue or question. Include any relevant quest IDs, usernames, or error messages."
              rows={6}
              className="w-full p-3 bg-input-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:outline-none transition-colors resize-none mobile-form-input"
              style={{ fontSize: '16px', pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              maxLength={1000}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
            />
            <p className="text-xs text-muted-foreground">{message.length}/1000 characters</p>
          </div>

          {/* Support Info */}
          <div className="hud-card p-4 border border-neon-purple/30 bg-neon-purple/5">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-neon-purple" />
              Response Time
            </h3>
            <p className="text-sm text-muted-foreground">
              We typically respond to support requests within 24 hours during business days. 
              For urgent issues, please include "URGENT" in your subject line.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !subject.trim() || !message.trim()}
            className="w-full neon-button px-6 py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SUBMITTING...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                SEND SUPPORT REQUEST
              </>
            )}
          </button>
        </form>

        {/* Additional Help */}
        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-foreground">Before contacting support:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Check our FAQ section for common questions</p>
            <p>• Try logging out and logging back in</p>
            <p>• Make sure you have the latest version of the app</p>
            <p>• Include screenshot or error messages when reporting bugs</p>
          </div>
        </div>
      </div>
    </div>
  )
}