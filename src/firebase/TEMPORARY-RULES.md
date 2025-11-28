# TEMPORARY PERMISSIVE FIREBASE RULES

## ⚠️ COPY THESE RULES NOW

Go to Firebase Console → Firestore Database → Rules → Replace ALL content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**CLICK "PUBLISH"**

This will temporarily allow all operations so collections can be created.
