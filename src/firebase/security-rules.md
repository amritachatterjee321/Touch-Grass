# Firebase Security Rules Setup

## Step 3: Copy and paste these Firestore Rules

Go to Firebase Console → Firestore Database → Rules → Replace all content with:

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
    
    // Chats and Messages (for later features)
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
    
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Notifications - User specific  
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```
