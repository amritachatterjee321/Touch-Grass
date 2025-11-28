# 🔽 Remove Test Quest Data from Firebase

This document guides you through removing the dummy quest test data that was added to your Firebase project.

## 🎯 **What needs to be cleared:**

### **Collections to Clean:**
- **🗑️ Quests** - Remove all 10 test quests
- **🗑️ Chats** - Remove 3 chat groups
- **🗑️ Messages** - Remove 15 message documents  
- **🗑️ Test Users** (optional) - Remove 5 dummy user profiles

## 🚀 **Quick Options to Use**

### **⏩ Option 1: Manual Console Removal (Fastest)**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Navigate to **Firestore Database**
4. Click on the Data tab
5. **Delete the following collections manually:**
   - Click on `quests` collection → delete all 10 documents  
   - Click on `chats` collection → delete all 3 documents  
   - Click on `messages` collection → delete all 15 documents
   - (Optional) Delete test users from `users` collection

### **⚡ Option 2: Code-based Removal (Automatic)**
1. In your VS Code/Cursor editor, add this temporary script:

```typescript
// In src/utils/temp-clear-code.ts  
import { clearTestQuestData, clearTestChatData } from '../firebase/clear-test-data'

// Quick function to remove test data
await clearTestQuestData()   // Removes quest data
await clearTestChatData()    // Removes chats and messages
```

2. Import this and run the function:
   - In App.tsx or main.tsx temporarily call this function
   - The cleanup script is already created in `src/firebase/clear-test-data.ts`

## 📝 **Step-by-Step Script Method**

You can also use the included cleanup scripts:

### **To run the cleanup from the terminal:**

```bash
# Method A: Import and run
npx ts-node src/firebase/clear-quests.ts
```

### **To run manually in browser:**

```javascript
import { clearTestQuestData } from './firebase/clear-test-data'
import { clearTestChatData } from './firebase/clear-test-data'

await clearTestQuestData()
await clearTestChatData()
```

## ✨ **Success Confirmation**

When the removal succeeds, you'll see:

```
🧹 Starting to clear test quest data from Firebase...
📊 Found 10 quest documents to delete
🗑️ Deleted quest: Looking for Board Game Buddies!
🗑️ Deleted quest: Early Morning Hike Companion Needed
... (and more)
✅ All test quest data cleared successfully!
```

---

## 🔒 **Keep/Don't Delete These Collections:**

**SAFE** to remove:
- ✅ Dummy quests, chats, messages

**DO NOT delete** (keep):  
- ❌ Categories (needed for app)
- ❌ Cities (needed for app)  
- ❌ Achievements (needed for app)  
- ❌ Real user accounts added by real users

## 📋 **After Cleanup Verification**

1. Go to **Firebase Console → Firestore → Data tab**
2. **Confirm cleaned:** 
   - `quests` collection should now be **empty**
   - `chats` collection should now be **empty** 
   - `messages` collection should now be **empty**
3. **Verify retained:**
   - ✅ `categories` should show 12 entries  
   - ✅ `cities` should show ~51 entries  
   - ✅ `achievements` should show 3 entries  
   - ✅ Real users should remain un-touched

The test quest data is now cleared from your Firebase Firestore project! 🎉
