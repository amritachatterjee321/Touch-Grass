import { useState } from "react"
import { ArrowLeft, Users, MessageCircle, Trophy, Clock, MapPin, Star, Heart, Zap, Check, X, Bell } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface Notification {
  id: string
  type: 'quest_join_request' | 'quest_accepted' | 'quest_rejected' | 'quest_reminder' | 'new_message' | 'quest_completed' | 'rating_received'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  questId?: string
  questTitle?: string
  fromUser?: {
    username: string
    profileImage?: string
  }
  metadata?: any
}

interface NotificationScreenProps {
  onBack: () => void
  onMarkAllRead?: () => void
  onNotificationClick?: (notification: Notification) => void
}

const notificationIcons = {
  quest_join_request: Users,
  quest_accepted: Check,
  quest_rejected: X,
  quest_reminder: Clock,
  new_message: MessageCircle,
  quest_completed: Trophy,
  rating_received: Star
}

const notificationColors = {
  quest_join_request: "neon-cyan",
  quest_accepted: "neon-green", 
  quest_rejected: "neon-red",
  quest_reminder: "neon-orange",
  new_message: "neon-purple",
  quest_completed: "neon-pink",
  rating_received: "neon-orange"
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    type: "quest_join_request",
    title: "New Squad Member Request",
    message: "AdventureSeeker_Raj wants to join your Hidden Coffee Gems Discovery Mission",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    questId: "quest_001",
    questTitle: "Hidden Coffee Gems Discovery Mission ☕",
    fromUser: {
      username: "AdventureSeeker_Raj"
    }
  },
  {
    id: "notif_002", 
    type: "new_message",
    title: "New Message in Squad Chat",
    message: "FoodiePal_Shreya: \"Can't wait to try that new cafe you mentioned!\"",
    timestamp: "2024-01-15T09:45:00Z",
    isRead: false,
    questId: "quest_002",
    questTitle: "Bangalore Food Crawl Adventure",
    fromUser: {
      username: "FoodiePal_Shreya"
    }
  },
  {
    id: "notif_003",
    type: "quest_accepted",
    title: "Quest Application Approved! 🎉",
    message: "You've been accepted for the Trekking Adventure in Nandi Hills",
    timestamp: "2024-01-15T08:20:00Z",
    isRead: false,
    questId: "quest_003",
    questTitle: "Nandi Hills Sunrise Trek",
    fromUser: {
      username: "TrekMaster_Priya"
    }
  },
  {
    id: "notif_004",
    type: "quest_reminder",
    title: "Quest Starting Soon!",
    message: "Your Photography Workshop starts in 2 hours. Don't forget your camera!",
    timestamp: "2024-01-15T07:00:00Z",
    isRead: true,
    questId: "quest_004",
    questTitle: "Street Photography Workshop"
  },
  {
    id: "notif_005",
    type: "rating_received",
    title: "New Rating Received ⭐",
    message: "CoffeeLover_Ankit rated you 5 stars: \"Amazing guide! Great company!\"",
    timestamp: "2024-01-14T20:15:00Z",
    isRead: true,
    fromUser: {
      username: "CoffeeLover_Ankit"
    }
  },
  {
    id: "notif_006",
    type: "quest_completed",
    title: "Quest Completed! 🏆",
    message: "You successfully completed the Mysore Palace Heritage Walk with 4 squad members",
    timestamp: "2024-01-14T18:30:00Z",
    isRead: true,
    questId: "quest_005",
    questTitle: "Mysore Palace Heritage Walk"
  },
  {
    id: "notif_007",
    type: "quest_rejected",
    title: "Quest Application Update",
    message: "Your application for Goa Beach Volleyball Tournament wasn't selected this time",
    timestamp: "2024-01-14T16:45:00Z",
    isRead: true,
    questId: "quest_006",
    questTitle: "Goa Beach Volleyball Tournament"
  }
]

export function NotificationScreen({ 
  onBack, 
  onMarkAllRead,
  onNotificationClick 
}: NotificationScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notifTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notifTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return notifTime.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
    onMarkAllRead?.()
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notification.id ? { ...notif, isRead: true } : notif
      )
    )
    onNotificationClick?.(notification)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hud-card m-4 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-cyan/10 to-neon-pink/10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-input-background border border-border hover:border-neon-cyan transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-neon-cyan transition-colors" />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-5 h-5 text-neon-cyan" />
                <h1 className="text-lg font-bold text-foreground">NOTIFICATIONS</h1>
                {unreadCount > 0 && (
                  <Badge variant="outline" className="border-neon-orange text-neon-orange font-bold">
                    {unreadCount} NEW
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Your recent activity updates</p>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="border-neon-green text-neon-green hover:bg-neon-green/10"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 pb-32">
        {notifications.length === 0 ? (
          <div className="hud-card p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No Notifications</h3>
            <p className="text-muted-foreground">You're all caught up! New activity will appear here.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const IconComponent = notificationIcons[notification.type]
            const iconColor = notificationColors[notification.type]
            
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`hud-card p-4 cursor-pointer transition-all duration-300 relative ${
                  !notification.isRead 
                    ? 'border-neon-cyan bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5' 
                    : 'hover:border-border'
                }`}
              >
                {!notification.isRead && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full">
                    <div className="absolute inset-0 bg-neon-cyan rounded-full animate-ping opacity-75" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${iconColor}/20 to-${iconColor}/10 border border-${iconColor}/30 flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-5 h-5 text-${iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-bold text-foreground ${!notification.isRead ? 'text-neon-cyan' : ''}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {notification.message}
                    </p>

                    {/* Quest Context */}
                    {notification.questTitle && (
                      <div className="bg-input-background rounded-lg p-2 border border-border">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-3 h-3 text-neon-orange" />
                          <span className="text-xs font-medium text-foreground">
                            {notification.questTitle}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* User Context */}
                    {notification.fromUser && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-input-background border border-border flex items-center justify-center overflow-hidden">
                          {notification.fromUser.profileImage ? (
                            <ImageWithFallback 
                              src={notification.fromUser.profileImage} 
                              alt={notification.fromUser.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          from @{notification.fromUser.username}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-lg" />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}