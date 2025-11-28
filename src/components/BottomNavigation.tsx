import { Radar, Zap, MessageSquare, Bot } from "lucide-react"

interface BottomNavigationProps {
  activeTab: 'board' | 'my-quests' | 'chats' | 'profile'
  onTabChange: (tab: 'board' | 'my-quests' | 'chats' | 'profile') => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'board', label: 'DISCOVER', icon: Radar },
    { id: 'my-quests', label: 'QUESTS', icon: Zap },
    { id: 'chats', label: 'CHATS', icon: MessageSquare },
    { id: 'profile', label: 'HERO', icon: Bot }
  ] as const

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{
      background: 'var(--hud-bg)',
      borderTop: '1px solid var(--hud-border)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(0, 245, 255, 0.1)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }}>
      <div className="flex justify-around items-center py-4" style={{
        paddingLeft: 'max(8px, env(safe-area-inset-left))',
        paddingRight: 'max(8px, env(safe-area-inset-right))'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center px-2 py-2 transition-all duration-300 transform group touch-manipulation min-w-[64px] min-h-[60px] ${
                isActive 
                  ? 'scale-105 -translate-y-0.5' 
                  : 'active:scale-95'
              }`}
            >
              <div className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                isActive 
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-purple border-2 border-neon-cyan' 
                  : 'bg-hud-bg border border-hud-border active:border-neon-cyan/50'
              }`} style={{
                boxShadow: isActive 
                  ? '0 0 20px rgba(0, 245, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                  : 'none',
                minWidth: '48px',
                minHeight: '48px'
              }}>
                <tab.icon 
                  size={18} 
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'text-background drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]' 
                      : 'text-muted-foreground group-active:text-neon-cyan'
                  }`}
                />
              </div>
              <span 
                className={`text-xs mt-1.5 font-bold uppercase tracking-wider transition-colors duration-300 text-center ${
                  isActive 
                    ? 'text-neon-cyan text-glow-cyan' 
                    : 'text-muted-foreground group-active:text-neon-cyan/80'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}