import { User, Bell } from "lucide-react"
import { MockAuthButton } from "./MockAuthButton"

interface GameHeaderProps {
  onOpenNotifications?: () => void
  onOpenSettings?: () => void
  onOpenChatDebug?: () => void
  onOpenPopulateData?: () => void
}

export function GameHeader({ onOpenNotifications, onOpenSettings, onOpenChatDebug, onOpenPopulateData }: GameHeaderProps) {
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
      <div className="flex items-center justify-between px-4 py-4" style={{
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))'
      }}>
        {/* Left - TouchGrass Branding - Mobile Optimized */}
        <div className="flex items-center flex-1">
          <h1 className="font-black text-2xl uppercase tracking-wider gradient-text" style={{
            fontFamily: 'Inter, monospace'
          }}>
            TOUCH<span className="text-neon-green">GRASS</span>
          </h1>
        </div>

        {/* Right Side - Mobile Optimized Notifications and Profile */}
        <div className="flex items-center gap-2">
          {/* Mock Auth Button - Testing */}
          <MockAuthButton />
          
          {/* Chat Debug Button - Temporary */}
          <button 
            onClick={onOpenChatDebug}
            className="hud-card p-2 active:border-neon-cyan group transition-all duration-300 relative touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center text-xs font-bold"
          >
            🐛
          </button>
          
          {/* Populate Data Button - Temporary */}
          <button 
            onClick={onOpenPopulateData}
            className="hud-card p-2 active:border-neon-cyan group transition-all duration-300 relative touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center text-xs font-bold"
          >
            📊
          </button>
          
          {/* Notifications - Mobile Touch-Friendly */}
          <button 
            onClick={onOpenNotifications}
            className="hud-card p-3 active:border-neon-cyan group transition-all duration-300 relative touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-muted-foreground group-active:text-neon-cyan transition-colors duration-300" />
            {/* Notification badge */}
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-neon-pink to-neon-orange rounded-full flex items-center justify-center border border-white">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </button>
          
          {/* Profile - Mobile Optimized */}
          <button 
            onClick={onOpenSettings}
            className="hud-card p-3 active:border-neon-cyan group transition-all duration-300 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg border-2 border-transparent bg-gradient-to-br from-neon-purple via-neon-pink to-neon-orange flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
              {/* Online status */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-neon-green rounded-full border border-white">
                <div className="absolute inset-0.5 rounded-full bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Bottom accent with animated gradient */}
      <div className="relative h-1 overflow-hidden">
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