# EventBuddy/QuestBoard Database Schema

## Overview
This document defines the complete Firebase Firestore database schema for the EventBuddy/QuestBoard application. The schema supports quest management, user profiles, social interactions, and real-time chat functionality.

---

## Collections

### 1. `users` Collection

Stores comprehensive user profile data extending Firebase Authentication.

**Authentication Linking:**
- The document ID (`id`) is the Firebase Authentication UID - this is the **primary unique identifier** for each user
- When a user signs in with Google, Firebase creates a unique UID for that user
- The `providerId` field stores the authentication method (e.g., 'google.com')
- The `providerUid` field stores the Google User ID from the Google account
- All user data, quests, chats, and activities are linked via the Firebase UID (`id`)
- This ensures that profile information is permanently linked to the user's Google authentication

```typescript
interface UserProfile {
  id: string // Document ID = Firebase Auth UID (Primary unique identifier)
  // Basic Info (from Firebase Auth)
  email: string
  username: string
  displayName: string
  photoURL?: string
  providerId?: string // Authentication provider (e.g., 'google.com')
  providerUid?: string // Provider-specific UID (Google User ID)
  
  // Profile Details
  age: number
  city: string
  gender: string
  bio: string
  personalityType: 'introvert' | 'extrovert' | 'ambivert'
  interests: string[] // Array of interest strings
  
  // Profile Management
  profileImage?: string
  isProfileCompleted: boolean
  
  // Activity Tracking
  questsCreated: string[] // Array of quest IDs
  questsJoined: string[] // Array of quest IDs
  totalQuestsCreated: number
  totalQuestsJoined: number
  
  // Tokens/Achievements
  tokens: number
  level: number
  achievements: string[] // Array of achievement IDs
  
  // Timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
  lastActiveAt: Timestamp
}
```

### 2. `quests` Collection

Primary collection for quest/event management.

```typescript
interface Quest {
  id: string // Auto-generated Firestore ID
  // Basic Quest Info
  title: string
  description: string
  category: string // 'Social', 'Adventure', 'Learning', 'Creative', 'Sports', etc.
  
  // Location & Timing
  location: string
  address?: string // Optional specific address
  latitude?: number
  longitude?: number
  city: string
  date: string // ISO date string
  time: string // HH:MM format
  
  // Event Details
  cost: string // e.g., "Free", "₹500", "Indoor Climbing"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  maxParticipants?: number
  currentParticipants: number
  
  // Visual & Media
  image?: string
  thumbnail?: string
  
  // Status & Publication
  isPublished: boolean
  isEpic: boolean // Featured quests
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  
  // Organizer Info
  organizerUid: string
  organizerName: string
  organizerPhotoURL?: string
  
  // Participants & Requests
  participants: string[] // Array of user UIDs
  joinRequests: {
    [uid: string]: {
      name: string
      message: string
      timestamp: Timestamp
    }
  }
  
  // Quest Management
  isPrivate: boolean // Private vs public quests
  tags: string[] // Search tags
  
  // Timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp
  completedAt?: Timestamp
}
```

### 3. `chats` Collection

Real-time chat functionality for quest participants.

```typescript
interface Chat {
  id: string // Auto-generated Firestore ID
  // Chat Identification
  questId: string // Reference to quest
  questTitle: string // Cached quest title
  
  // Participant Management
  participants: string[] // Array of user UIDs
  admins: string[] // Quest organizer + moderators
  creatorUid: string // Quest organizer
  
  // Chat Status
  isActive: boolean
  createdBy: string
  
  // Timestamps
  createdAt: Timestamp
  lastMessageAt: Timestamp
  lastActivityAt: Timestamp
}
```

### 4. `messages` Collection

Individual chat messages within quests.

```typescript
interface Message {
  id: string // Auto-generated Firestore ID
  // Message Identification
  chatId: string // Reference to chat
  senderId: string // Firebase Auth UID
  senderName: string
  senderPhotoURL?: string
  
  // Message Content
  content: string
  type: 'text' | 'image' | 'location' | 'system' | 'join_request'
  
  // Rich Media
  imageUrl?: string
  location?: {
    name: string
    latitude: number
    longitude: number
  }
  
  // Reply System
  replyTo?: {
    messageId: string
    senderName: string
    content: string
  }
  
  // Status & Moderation
  isEdited: boolean
  editedAt?: Timestamp
  isDeleted: boolean
  deletedAt?: Timestamp
  
  // System Messages
  systemData?: {
    type: 'user_joined' | 'quest_updated' | 'quest_cancelled'
    metadata?: any
  }
  
  // Timestamps
  timestamp: Timestamp
  createdAt: Timestamp
}
```

### 5. `notifications` Collection

User notification management.

```typescript
interface Notification {
  id: string // Auto-generated Firestore ID
  // Notification Target
  userId: string // Recipient UID
  
  // Notification Details
  type: 'quest_invite' | 'join_request' | 'message_reply' | 'quest_reminder' | 'level_up'
  title: string
  message: string
  
  // Source Reference
  questId?: string
  senderId?: string
  chatId?: string
  
  // Notification Status
  isRead: boolean
  isActionable: boolean // Can user take action?
  actionUrl?: string
  
  // Timestamps
  createdAt: Timestamp
  readAt?: Timestamp
  expiresAt?: Timestamp
}
```

### 6. `achievements` Collection

User progression and gamification.

```typescript
interface Achievement {
  id: string // Achievement identifier
  // Achievement Details
  name: string
  description: string
  icon: string // Icon identifier
  
  // Requirements & Rewards
  requirement: {
    type: 'quests_completed' | 'quests_created' | 'messages_sent' | 'days_active'
    value: number
  }
  rewardTokens: number
  rewardExperience: number
  
  // Display & Category
  category: 'social' | 'creator' | 'explorer' | 'achiever'
  isSecret: boolean // Hidden achievements
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  
  // Validation
  isActive: boolean
  sortOrder: number
  createdAt: Timestamp
}
```

### 7. `cities` Collection

Location data and city management.

```typescript
interface City {
  id: string // City identifier (e.g., "bangalore", "delhi")
  // Location Details
  name: string // Display name
  state: string
  country: string
  
  // Geographic Data
  latitude: number
  longitude: number
  timezone: string
  
  // Activity & Usage
  activeQuestsCount: number
  activeUsers: number
  isPopular: boolean
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 8. `categories` Collection

Quest categorization and metadata.

```typescript
interface Category {
  id: string // Category slug
  // Category Details
  name: string
  description: string
  icon: string
  color: string
  
  // Statistics
  totalQuests: number
  activeQuests: number
  
  // Settings
  isActive: boolean
  sortOrder: number
  
  // Timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Subcollection: Quest Categories**
For complex querying of quests by category and location:
```
/categories/{categoryId}/quests/{questId}
```

---

## Database Rules (Security)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profiles - only own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quests - read public, write authenticated
    match /quests/{questId} {
      allow read: if true; // Public reading
      allow write: if request.auth != null && 
        (
          // Creator can write
          resource.data.organizerUid == request.auth.uid ||
          // Authentication required for updates
          !request.resource.data.diff(resource.data).affectedKeys().hasOnly(['joinRequests'])
        );
    }
    
    // Chat access - participants only
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
    }
    
    // Messages in chats
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
    }
    
    // Notifications - user specific
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
    
    // Public collections
    match /cities/{cityId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /achievements/{achievementId} {
      allow read: if true;
      allow write: if false; // Admin managed
    }
  }
}
```

---

## Indexes Required

### Composite Indexes for Quests
```
/quests: [city, createdAt DESC]
/quests: [category, status, createdAt DESC]  
/quests: [status, isEpic, createdAt DESC]
/quests: [organizerUid, status, createdAt DESC]
```

### Composite Indexes for Chats
```
/chats: [questId]
/chats: [lastMessageAt DESC]
```

### Composite Indexes for Messages
```
/messages: [chatId, timestamp ASC]
/messages: [chatId, createdAt DESC]
```

---

## Sample Collection Queries

### Get Published Quests by City
```javascript
const questsRef = collection(db, 'quests');
const q = query(
  questsRef,
  where('city', '==', 'Bangalore'),
  where('status', '==', 'published'),
  orderBy('createdAt', 'desc'),
  limit(20)
);
```

### Get User Notifications
```javascript
const notificationsRef = collection(db, 'notifications');
const q = query(
  notificationsRef,
  where('userId', '==', uid),
  orderBy('createdAt', 'desc')
);
```

### Get Quest Chat Messages
```javascript
const messagesRef = collection(db, 'messages');
const q = query(
  messagesRef,
  where('chatId', '==', chatId),
  orderBy('timestamp', 'asc')
);
```

---

This schema provides comprehensive support for your EventBuddy app's core features including quest management, social interactions, real-time messaging, user profiles, and gamification.
se function