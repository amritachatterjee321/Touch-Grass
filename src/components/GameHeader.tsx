import { User, Bell, Send } from "lucide-react"

interface GameHeaderProps {
  onOpenNotifications?: () => void
  onOpenSettings?: () => void
}

export function GameHeader({ onOpenNotifications, onOpenSettings }: GameHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 gaming-panel border-0 rounded-none" style={{
      background: 'linear-gradient(135deg, var(--hud-bg) 0%, rgba(248, 250, 252, 0.95) 100%)',
      borderBottom: '2px solid transparent',
      backgroundImage: 'linear-gradient(var(--hud-bg), var(--hud-bg)), linear-gradient(90deg, var(--neon-cyan), var(--neon-purple), var(--neon-pink), var(--neon-cyan))',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      backdropFilter: 'blur(25px)',
      boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15), inset 0 -1px 0 rgba(2, 132, 199, 0.3), 0 0 0 1px rgba(2, 132, 199, 0.1)',
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }}>
      <div className="flex items-center justify-between px-4 py-3" style={{
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))'
      }}>
        {/* Left - tag along Branding - Mobile Optimized */}
        <div className="flex items-center flex-1">
          <h1 className="font-black text-xl lowercase tracking-wide" style={{
            fontFamily: 'Inter, monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span style={{ color: '#9333EA' }}>tag</span>
            <Send 
              className="w-4 h-4 flex-shrink-0" 
              style={{ 
                color: '#60A5FA',
                marginLeft: '2px',
                marginRight: '2px'
              }} 
            />
            <span style={{ color: '#374151' }}>along</span>
          </h1>
        </div>

        {/* Right Side - Mobile Optimized Notifications and Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications - Mobile Touch-Friendly */}
          <button 
            onClick={onOpenNotifications}
            className="hud-card p-2.5 active:border-neon-cyan group transition-all duration-300 relative touch-manipulation min-w-[35px] min-h-[35px] flex items-center justify-center"
          >
            <Bell className="w-4 h-4 text-muted-foreground group-active:text-neon-cyan transition-colors duration-300" />
            {/* Notification indicator dot - shown when user has unread notifications */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white shadow-lg">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </button>
          
          {/* Profile - Mobile Optimized */}
          <button 
            onClick={onOpenSettings}
            className="hud-card p-2.5 active:border-neon-cyan group transition-all duration-300 touch-manipulation min-w-[35px] min-h-[35px] flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-lg border-2 border-transparent bg-gradient-to-br from-neon-purple via-neon-pink to-neon-orange flex items-center justify-center shadow-lg">
                <User className="w-3 h-3 text-white drop-shadow-sm" />
              </div>
              {/* Online status */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-neon-green rounded-full border border-white">
                <div className="absolute inset-0.5 rounded-full bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Bottom accent with animated gradient */}
      <div className="relative" style={{ height: '3.2px', overflow: 'hidden' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan via-neon-purple to-transparent opacity-80 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-transparent via-neon-green to-neon-cyan opacity-60" style={{
          animation: 'gradient-shift 4s ease-in-out infinite'
        }}></div>
      </div>
      
      {/* Floating scan line effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40" style={{
        animation: 'shimmer 3s ease-in-out infinite'
      }}></div>
    </header>
  )
}