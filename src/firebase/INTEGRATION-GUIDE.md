# EventBuddy Database Integration Guide

## Quick Setup Dashboard Database Schema in Your App

### 1. **Initialize Database Once** (App StartUp)

Add this to your main App component or where you initialize Firebase:

```typescript
import { initializeAppDatabase } from './firebase/init-db'

// Initialize database on app startup
useEffect(() => {
  initializeAppDatabase()
}, [])
```

### 2. **Enhanced User Profile Management**

Replace your current user creation logic:

```typescript
import { createUserProfile, getUserProfile, updateUserProfile } from './firebase/users'
import { useFirebase } from './contexts/FirebaseContext'

function AppContent() {
  const { user } = useFirebase()
  
  // Auto-create user profile on first login
  useEffect(() => {
    if (user) {
      createUserProfile(user, {
        city: 'Bangalore',
        personalityType: 'extrovert',
        interests: ['adventure', 'social']
      })
    }
  }, [user])
}
```

### 3. **Enhanced Quest Management**

Update your quest creation:

```typescript
import { createEnhancedQuest, getPublishedQuests, sendJoinQuestRequest } from './firebase/enhanced-quests'

// Replace your current quest creation
const handleQuestSaved = async (questData: any) => {
  try {
    const enhancedQuestData = {
      ...questData,
      organizerUid: user?.uid,
      organizerName: user?.displayName || 'Anonymous',
      city: 'Bangalore',
      category: 'Social',
      participants: [],
      joinRequests: {},
      isEpic: true,
      status: 'published',
      isPublished: true,
      publishedAt: new Date()
    }
    
    await createEnhancedQuest(enhancedQuestData)
    toast.success("Epic quest launched! 🚀")
  } catch (error) {
    toast.error("Failed to create quest")
  }
}
```

### 4. **Set Firebase Rules** 

Copy and paste this into your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/update their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quests public read, auth write
    match /quests/{questId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categories and cities public
    match /categories/{categoryId} {
      allow read: if true;
    }
    match /cities/{cityId} {
      allow read: if true; 
    }
    match /achievements/{achievementId} {
      allow read: if true;
    }
  }
}
```

### 5. **Create Required Indexes**

In Firebase Console → Firestore → Indexes → Create Index:

**Required Composite Indexes:**
```
Collection group: quests
Fields: city (Ascending), status (Ascending), publishedAt (Descending)

Collection group: quests  
Fields: category (Ascending), status (Ascending), publishedAt (Descending)

Collection group: quests
Fields: status (Ascending), isEpic (Ascending), publishedAt (Descending)
```

### 6. **Test Database Connectivity**

```typescript
// Test database in your component
const testDatabase = async () => {
  try {
    const quests = await getPublishedQuests({ city: 'Bangalore' })
    console.log('Database working:', quests.length, 'quests found')
  } catch (error) {
    console.error('Database not ready:', error)
  }
}
```

---

## Your New Database Structure

✅ **Collections Created:**
- `users` - User profiles with gamification 
- `quests` - Enhanced quest/event management
- `chats` - Real-time messaging 
- `messages` - Individual chat messages
- `notifications` - User notifications
- `categories` - Quest categories
- `cities` - Location management  
- `achievements` - Gamification system

✅ **Features Ready:**
- User profiles with personality types
- Enhanced quest filtering 
- Real-time notifications
- Gamification with tokens and achievements
- Location-based quest discovery
- Comprehensive join request system

Your database is ready to support all EventBuddy features! 🎯
