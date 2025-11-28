# Loading Dummy Data to Firebase

This document explains how to populate your Firebase Firestore database with dummy data for testing.

## 🎯 **What Dummy Data Will Be Saved:**

### 📋 **Data Files**
- **👥 Users (5 dummy users)** 
- **🎮 Quests (10 dummy quests with different categories)**
- **💬 Chats (3 chat groups)**
- **📮 Messages (5 sample conversations)**
- **📂 Categories (12 activity categories)**
- **🏙️ Cities (50+ Indian tier 1 & tier 2 cities)**
- **🏆 Achievements (3 quest achievements)**

## 🚀 **How Dummy Data Gets Saved**

### **Option 1: Automatic (Recommended)**
Dummy data will automatically be saved when you restart your app:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```
2. **Check browser console** - you should see:
   ```
   🚀 Initiating database...
   🔧 Force creating missing collections...
   📝 Initiating dummy data migration...
   ✅ Users saved: Rahul, Priya, Arjun, etc.
   ✅ Quest saved: Looking for Board Game Buddies!, etc.
   ✅ Chat saved: Board Game Tournament etc.
   📝 All dummy data saved successfully!
   ✅ Database initialization and dummy data migration completed
   ```

### **Option 2: Manual Script Start**
If needed you can manually trigger the dummy data save by:

1. **Inside your browser console, run:**
   ```javascript
   import { saveAllDummyData } from './src/firebase/save-dummy-data.ts'
   saveAllDummyData()
   ```

## 📦 **Migration Data Breakdown**

| Collection | Records Count | Example Sample |
|------------|---------------|----------------|
| **Users** | 5 users | Rahul, Priya, Arjun, Kavya, Current User |
| **Quests** | 10 events | Board Game Tournament, Morning Hike, Italian Cooking... |
| **Chats** | 3 groups | Board Game Tournament, Hike Chat, Cooking Chat |
| **Messages** | 15 total | Text messages and media with locations |
| **Categories** | 12 topics | Social, Adventure, Learning, Creative, Sports |
| **Cities** | ~51 places | Bangalore, Delhi, Mumbai, Chennai, Kochi |
| **Achievements** | 3 unlocks | first_quest, social_butterfly, explorer |

### ✨ **Successful Dummy Data Load Looks Like This:**
```bash
📝 Starting to save all dummy data to Firebase...
```
```
✅ Category saved: Social
✅ Category saved: Adventure
... (12 categories saved)

✅ City saved: Mumbai, Maharashtra
✅ City saved: Delhi, NCR
... (51 cities saved)

✅ Achievement saved: First Quest
... (3 achievements saved)

✅ User saved: Rahul          <— Quest owner
✅ User saved: Priya
... (5 users saved)

✅ Quest saved: Looking for Board Game Buddies!
✅ Quest saved: Early Morning Hike Companion Needed  
... (10 quests saved)

✅ Chat saved: Board Game Tournament       
✅ Messages saved in chats 
📝 All dummy data saved successfully to Firebase!
✅ Database initialization and dummy data migration completed
```

---

## 🛠️ **Troubleshooting Dummy Data Load**

### If Collections Are Missing
1. **Re-open the Firebase Console**
2. Go to **Firestore Database**
3. View the **Data tab** - you'll see all new Collections:
   - users / quests / chats / messages / categories / cities / achievements

### If "Missing Permissions" Still Aren't Resolved
1. **Ensure rule is still open:**
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
2. **Restart the dev server** `npm run dev`

---

## 🔒 **Post-Loading Security Rules**

After dummy data is loaded, change your Firebase rules from open to these secure rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /quests/{questId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
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
      allow write: if request.auth != null;
    }
  }
}
```

- Publish the new secure rules
- Restart your app
- Your Firebase database now populated with test data safely!