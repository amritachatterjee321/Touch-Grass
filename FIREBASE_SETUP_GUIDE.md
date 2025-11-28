# Firebase Setup Guide for Chat Functionality

## Issue Identified
The chat functionality is not working because Firebase is not properly configured. The current configuration uses placeholder values instead of actual Firebase credentials.

## Solution Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### 2. Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

### 3. Enable Authentication
1. Go to "Authentication" in your Firebase project
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" as a sign-in provider
5. Add your domain to authorized domains

### 4. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" (</>) to add a web app
4. Register your app with a nickname
5. Copy the Firebase SDK configuration

### 5. Create Environment File
Create a file called `.env.local` in your project root with:

```
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
```

Replace the placeholder values with your actual Firebase configuration values.

### 6. Set Up Security Rules
Go to Firestore Database → Rules and replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - Users can read/update their own profile  
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quests - Public read, authenticated write
    match /quests/{questId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Chats and Messages
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
    
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Categories/Cities/Achievements - Public read
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /cities/{cityId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /achievements/{achievementId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Notifications - User specific  
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 7. Restart Development Server
After creating the `.env.local` file:
1. Stop your development server (Ctrl+C)
2. Run `npm run dev` again

## Verification
Once setup is complete:
1. You should be able to sign in with Google
2. Chat functionality should work properly
3. Messages should be sent and received in real-time

## Troubleshooting
- Check browser console for Firebase configuration warnings
- Ensure all environment variables are correctly set
- Verify Firestore security rules are properly configured
- Make sure authentication is enabled in Firebase Console

