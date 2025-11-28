# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project" 
3. Enter your project name (e.g., "event-buddy")
4. Follow the setup wizard

## 2. Enable Authentication

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable "Google" as a sign-in provider
3. Add your app's domain if needed

## 3. Enable Firestore Database

1. Go to Firestore Database > Create database
2. Choose "Start in test mode" for development
3. Select a location (choose closest to your users)

## 4. Configure Firebase Config

### Option 1: Environment Variables (Recommended)

Create a `.env` file in your project root with your Firebase config:
```bash
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Option 2: Direct Configuration

Or directly replace the placeholder values in `src/firebase/config.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
}
```

## 5. Set Firestore Rules (Optional - for testing)

Go to Firestore Database > Rules and use these test rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users (for development only)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: These rules allow anyone to read/write to your database. Only use for development!

## 6. Firebase Security Rules (Production)

For production, restrict access based on authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quests/{questId} {
      allow read: if true; // Anyone can read quests
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## Features Implemented

- **Authentication**: Google sign-in integration
- **Firestore**: Real-time quest storage and retrieval
- **Quest Management**: Create, read, update quests
- **Real-time Updates**: Automatic sync when quest data changes
- **User Context**: Firebase user state management

## Components Updated

- `src/firebase/` - Firebase configuration and utilities
- `src/contexts/FirebaseContext.tsx` - Global Firebase state
- `src/App.tsx` - Firebase integration
- `src/components/QuestBoard.tsx` - Firebase quest loading
- `src/components/MyQuests.tsx` - Firebase user quest filtering
- `src/components/QuestCard.tsx` - Firebase authentication flow
