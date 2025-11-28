# Fixed Firebase Security Rules

## Copy exactly this text (without markdown code blocks) into Firebase Console → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Match all documents for now (simplified rules)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## OR use this more secure version:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Quests  
    match /quests/{questId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Categories
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Cities
    match /cities/{cityId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Achievements
    match /achievements/{achievementId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```
