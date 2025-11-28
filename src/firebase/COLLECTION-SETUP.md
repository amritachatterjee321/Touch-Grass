# 🔥 Firebase Collections Creation Guide

## **THE COLLECTIONS YOUR APP NEEDS:**

Your EventBuddy database requires these **8 collections**:

### **Core Collections:**
1. **`categories`** - Quest categories (Social, Adventure, Learning, etc.)
2. **`cities`** - Location data (Bangalore, Delhi, Mumbai, etc.)
3. **`achievements`** - User gamification rewards
4. **`users`** - User profiles with enhanced data

### **Quest Collections:**
5. **`quests`** - Quest/event listings  
6. **`chats`** - Quest participant discussions
7. **`messages`** - Individual chat messages
8. **`notifications`** - User alerts and reminders

---

## **✅ AUTOMATIC SETUP (Your App Creates These)**

Your app **already configured** to create these collections automatically:

1. **Start your server**: `npm run dev`
2. **Check browser console** - you'll see:
   ```
   🚀 Initializing EventBuddy Database...
   📂 Creating categories collection...
   🏙️ Creating cities collection... 
   🔹 Creating chat collection...
   🔔 Creating notifications collection...
   ✅ All collections created successfully!
   ```

3. **Verify in Firebase Console**: Go to your Firestore Database, you'll see all 8 collections created!

---

## **🔧 MANUAL METHODS (If Automatic Doesn't Work)**

### **Option A: Firebase Console (GUI)**
1. **Open**: Firebase Console → Firestore Database  
2. **Click**: "Start collection" 
3. **Create each collection**:
   - Category ID: `categories` (Collection ID)
   - Category ID: `cities` (Collection ID)  
   - Category ID: `achievements` (Collection ID)
   - Category ID: `users` (Collection ID)
   - Category ID: `quests` (Collection ID)
   - Category ID: `chats` (Collection ID)
   - Category ID: `messages` (Collection ID)
   - Category ID: `notifications` (Collection ID)

### **Option B: Script Method** (Advanced)
```bash
npx ts-node src/firebase/manual-create-collections.ts
```

---

## **📋 Verification Checklist**

After setup, verify in **Firebase Console** → **Firestore Database**:

**✅ You should see these 8 collections:**
- [ ] categories
- [ ] cities  
- [ ] achievements
- [ ] users
- [ ] quests
- [ ] chats
- [ ] messages
- [ ] notifications

**✅ Sample documents** should be created in each collection to establish the data structure.

---

## **🎯 Next Steps After Collections Created:**

1. **Create Firebase Security Rules** (see security-rules.md)
2. **Create Required Indexes** (see create-indexes.md)  
3. **Test your app** - the database will now work!

Your Firebase database is ready! 🚀
