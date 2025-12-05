# 🔑 User Authentication & Profile Linking

## Overview
This document explains how user profiles are linked to Firebase Authentication UIDs and Google accounts in the TagAlong application.

---

## 🎯 Primary User Identifier

### Firebase Authentication UID
- **Document ID**: Each user profile document in Firestore uses the Firebase Authentication UID as its document ID
- **Format**: `users/{firebaseAuthUID}`
- **Example**: `users/xQ8hF9k2LmP1nV5tA3jR7dS6wE4yU0`

### Why Firebase UID?
- **Unique & Permanent**: Firebase assigns a unique UID when a user first authenticates
- **Provider-Agnostic**: The same UID persists even if the user links multiple authentication methods
- **Secure**: UID cannot be guessed or manipulated by users
- **Cross-Platform**: The same UID works across web, iOS, and Android

---

## 🔗 Google Authentication Linking

### Profile Fields for Authentication

```typescript
interface UserProfile {
  id: string              // Firebase Auth UID (PRIMARY IDENTIFIER)
  email: string           // User's Google email
  providerId: string      // 'google.com'
  providerUid: string     // Google User ID
  displayName: string     // Google account display name
  photoURL: string        // Google profile photo URL
  // ... other profile fields
}
```

### Field Descriptions

| Field | Description | Example | Source |
|-------|-------------|---------|--------|
| `id` | Firebase Authentication UID | `xQ8hF9k2LmP1nV5tA3jR7dS6wE4yU0` | Firebase Auth |
| `email` | User's Google account email | `john.doe@gmail.com` | Google OAuth |
| `providerId` | Authentication provider identifier | `google.com` | Firebase Auth |
| `providerUid` | Google-specific User ID | `107123456789012345678` | Google OAuth |
| `displayName` | User's name from Google | `John Doe` | Google OAuth |
| `photoURL` | Profile photo URL from Google | `https://lh3.googleusercontent.com/...` | Google OAuth |

---

## 🔄 Authentication Flow

### 1. User Signs In with Google

```
User clicks "Sign In with Google"
    ↓
signInWithGoogle() is called
    ↓
Google OAuth popup opens
    ↓
User grants permission
    ↓
Firebase creates/retrieves Firebase Auth UID
    ↓
Firebase returns User object with:
    - uid (Firebase UID)
    - email
    - displayName
    - photoURL
    - providerData[] (includes Google info)
```

### 2. Profile Creation/Update

```typescript
// In createUserProfile() function
const userRef = doc(db, 'users', user.uid)  // ← Uses Firebase UID as document ID

// Extract Google provider information
const googleProvider = user.providerData.find(
  provider => provider.providerId === 'google.com'
)

// Save profile with authentication links
await setDoc(userRef, {
  id: user.uid,                              // Firebase UID
  email: user.email,                         // Google email
  providerId: googleProvider?.providerId,    // 'google.com'
  providerUid: googleProvider?.uid,          // Google User ID
  // ... rest of profile data
}, { merge: true })
```

### 3. Data Relationships

All user-related data is linked via the Firebase UID:

```
users/{firebaseUID}                    ← User profile
quests/{questId}
  ├─ organizerUid: {firebaseUID}      ← Quest creator
  └─ participants: [{firebaseUID}]     ← Quest participants
chats/{chatId}
  └─ participants: [{firebaseUID}]     ← Chat members
messages/{messageId}
  └─ senderId: {firebaseUID}           ← Message sender
notifications/{notificationId}
  └─ userId: {firebaseUID}             ← Notification recipient
```

---

## 🛡️ Security & Privacy

### Firestore Security Rules

```javascript
// Users can only read/write their own profile
match /users/{userId} {
  allow read, write: if request.auth != null 
                     && request.auth.uid == userId;
}

// Quests can only be edited by their creator
match /quests/{questId} {
  allow write: if request.auth != null 
               && resource.data.organizerUid == request.auth.uid;
}
```

### Data Protection
- **Firebase UID is the only identifier used in security rules**
- Google-specific IDs (`providerUid`) are stored for reference only
- Email addresses are stored but never used as primary identifiers
- Profile data can only be accessed by the authenticated user

---

## 📝 Implementation Examples

### Creating a User Profile

```typescript
import { signInWithGoogle } from '@/firebase/auth'
import { createUserProfile } from '@/firebase/users'

// 1. User signs in
const { user } = await signInWithGoogle()

// 2. Create/update profile (automatically links to Firebase UID)
await createUserProfile(user, {
  username: 'QuestMaster',
  age: 25,
  city: 'Bangalore',
  // ... other profile data
})

// Profile is saved to: users/{user.uid}
```

### Retrieving a User Profile

```typescript
import { getUserProfile } from '@/firebase/users'

// Get profile using Firebase UID
const profile = await getUserProfile(user.uid)

console.log(profile.id)          // Firebase UID
console.log(profile.providerId)  // 'google.com'
console.log(profile.providerUid) // Google User ID
console.log(profile.email)       // Google email
```

### Updating Profile Information

```typescript
import { updateUserProfile } from '@/firebase/users'

// Update profile (Firebase UID is preserved)
await updateUserProfile(user.uid, {
  bio: 'Updated bio text',
  interests: ['Gaming', 'Hiking', 'Photography']
})
```

---

## 🔍 Why Two IDs?

### Firebase UID (`id`)
- **Purpose**: Primary identifier for all app functionality
- **Persistence**: Never changes, even if user updates Google account
- **Usage**: Database keys, security rules, relationships
- **Visibility**: Used throughout the application

### Google User ID (`providerUid`)
- **Purpose**: Reference to Google account for OAuth/integration
- **Persistence**: Tied to the specific Google account
- **Usage**: Analytics, support, debugging, Google API integration
- **Visibility**: Stored but rarely displayed to users

---

## 🚀 Best Practices

### Always Use Firebase UID
✅ **DO**: Use `user.uid` or `profile.id` for all database operations
❌ **DON'T**: Use email addresses or Google IDs as primary keys

### Profile Creation
✅ **DO**: Always create profile after successful authentication
✅ **DO**: Use `merge: true` to preserve existing data on updates
❌ **DON'T**: Overwrite authentication fields (providerId, providerUid)

### Data Queries
✅ **DO**: Query by Firebase UID: `where('organizerUid', '==', user.uid)`
❌ **DON'T**: Query by email or Google ID

---

## 📊 Database Structure

```
Firestore Database
└── users (collection)
    ├── xQ8hF9k2LmP1nV5tA3jR7dS6wE4yU0 (document - Firebase UID)
    │   ├── id: "xQ8hF9k2LmP1nV5tA3jR7dS6wE4yU0"
    │   ├── email: "user1@gmail.com"
    │   ├── providerId: "google.com"
    │   ├── providerUid: "107123456789012345678"
    │   ├── username: "QuestMaster"
    │   └── ... (other profile fields)
    │
    └── yR7kG8m3NqO2pW6uB4lS8eT7xF5zA1 (document - Another user)
        ├── id: "yR7kG8m3NqO2pW6uB4lS8eT7xF5zA1"
        ├── email: "user2@gmail.com"
        ├── providerId: "google.com"
        ├── providerUid: "108987654321098765432"
        └── ... (other profile fields)
```

---

## 🔧 Troubleshooting

### User Profile Not Found
**Symptom**: `getUserProfile()` returns null
**Solution**: Ensure profile was created after authentication with `createUserProfile()`

### Authentication UID Mismatch
**Symptom**: User can't access their own profile
**Solution**: Verify `request.auth.uid` matches document ID in security rules

### Provider Information Missing
**Symptom**: `providerId` or `providerUid` is null/undefined
**Solution**: Check that user signed in with Google (not anonymous or email/password)

---

## 📚 Related Documentation
- [Database Schema](./database-schema.md)
- [Authentication Flow](./AUTHENTICATION-QUEST-FLOW.md)
- [Security Rules](./security-rules.md)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)

---

**Last Updated**: October 2, 2025
**Maintained By**: TagAlong Development Team

