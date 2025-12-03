# Firebase Storage Setup Guide

## Issue
Error: `Cross-Origin Request Blocked` with 404 status when uploading images to Firebase Storage.

**Cause**: Firebase Storage is not enabled in your Firebase project.

---

## Solution: Enable Firebase Storage

### Step 1: Enable Storage in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`event-buddy-26a06`)
3. Click **Storage** in the left sidebar
4. Click **Get started**
5. Choose **Start in test mode** (for development)
6. Click **Next**
7. Select your location (same as Firestore for best performance)
8. Click **Done**

### Step 2: Configure Storage Security Rules

After enabling, go to Storage → **Rules** tab:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Profile images - users can upload their own, everyone can read
    match /profile-images/{userId}/{imageId} {
      allow read: if true;  // Public read
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quest images - authenticated users can upload, everyone can read
    match /quest-images/{allPaths=**} {
      allow read: if true;  // Public read
      allow write: if request.auth != null;
    }
    
    // Chat images - authenticated users can upload/read
    match /chat-images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Click **Publish** to save the rules.

### Step 3: Verify Storage Bucket Configuration

Check your `.env` file (or `.env.local`) has the correct storage bucket:

```env
VITE_FIREBASE_STORAGE_BUCKET=event-buddy-26a06.appspot.com
```

**OR** if you don't use `.env` files, check `src/firebase/config.ts`:

```typescript
storageBucket: "event-buddy-26a06.appspot.com"
```

### Step 4: Restart Development Server

After enabling Storage, restart your dev server:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## Verification

After enabling Storage:

1. **Try uploading a profile image**
2. **Check browser console** - should see:
   - `📤 Uploading profile image to Firebase Storage...`
   - `✅ Profile image uploaded to Storage: [URL]`
3. **Check Firebase Console** - Storage section should show uploaded images

---

## Temporary Workaround (If You Can't Enable Storage Now)

The app will now gracefully fallback to using your Google profile photo if Storage upload fails:

- Custom image upload will fail with a warning
- Your Google profile photo will be used instead
- Profile creation will still work

To enable custom image uploads, you **must** enable Firebase Storage.

---

## Production Security Rules (For Later)

For production, use stricter rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Profile images - strict user validation
    match /profile-images/{userId}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null 
                  && request.auth.uid == userId
                  && request.resource.size < 5 * 1024 * 1024  // 5MB limit
                  && request.resource.contentType.matches('image/.*');
    }
    
    // Quest images - with file size limits
    match /quest-images/{questId}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null
                  && request.resource.size < 10 * 1024 * 1024  // 10MB limit
                  && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## Troubleshooting

### Issue: Still getting CORS errors after enabling Storage
**Solution**: 
- Wait 1-2 minutes for Firebase to propagate changes
- Clear browser cache
- Restart dev server

### Issue: "Permission denied" errors
**Solution**: 
- Check Storage Rules are set to test mode or allow authenticated users
- Verify user is logged in before uploading

### Issue: Upload works but image doesn't display
**Solution**: 
- Check Storage Rules allow `read: if true` for public access
- Verify the download URL is being saved correctly in Firestore

---

## Storage Costs

Firebase Storage free tier:
- **5GB stored** per month
- **1GB downloaded** per month
- **20,000 uploads** per day

Typical usage for this app:
- Profile images: ~200KB each (after compression)
- Quest images: ~300KB each (after compression)

**Estimate**: 
- 1000 users = ~200MB storage
- 5000 quests = ~1.5GB storage
- Well within free tier limits!

---

## Next Steps

1. ✅ Enable Firebase Storage (follow Step 1-2 above)
2. ✅ Restart your dev server
3. ✅ Try uploading a profile image
4. ✅ Verify image appears in Firebase Console → Storage

**Need help?** Check the [Firebase Storage Documentation](https://firebase.google.com/docs/storage)

