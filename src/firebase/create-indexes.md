# Firebase Database Indexes Setup Guide

## All Required Indexes for EventBuddy/QuestBoard App

### 🔥 How to Create Indexes in Firebase Console

1. **Go to**: Firebase Console → Firestore Database → Indexes tab
2. **Click**: "Create Index" for each index below
3. **Copy** the exact field configurations listed below
4. **Wait** for indexes to build (can take a few minutes)

---

## 🎯 **QUEST INDEXES** (Required for App Functionality)

### **Index #1: City-Based Quest Queries**
```
Collection ID: quests
Fields:
- city (Ascending)
- createdAt (Descending)
```

### **Index #2: Quest Category Filtering**
```
Collection ID: quests  
Fields:
- category (Ascending)
- status (Ascending)
- createdAt (Descending)
```

### **Index #3: Epic Quests by Status**
```
Collection ID: quests
Fields:
- status (Ascending)
- isEpic (Ascending)
- createdAt (Descending)
```

### **Index #4: User's Quest Management**
```
Collection ID: quests
Fields:
- organizerUid (Ascending)
- status (Ascending)
- createdAt (Descending)
```

### **Index #5: Quest Status Filtering**
```
Collection ID: quests
Fields:
- status (Ascending)
- createdAt (Descending)
```

---

## 💬 **CHAT INDEXES** (For Real-time Messaging)

### **Index #6: Chat by Quest**
```
Collection ID: chats
Fields:
- questId (Ascending)
```

### **Index #7: Recent Chats**
```
Collection ID: chats
Fields:
- lastMessageAt (Descending)
```

### **Index #7.5: User Chats (CRITICAL - Fixes Current Error)**
```
Collection ID: chats
Fields:
- participants (Arrays)
- lastMessageAt (Descending)
```

---

## 📨 **MESSAGE INDEXES** (For Chat Messaging)

### **Index #8: Messages by Chat (Chronological)**
```
Collection ID: messages
Fields:
- chatId (Ascending)
- timestamp (Ascending)
```

### **Index #9: Messages by Chat (Recent First)**
```
Collection ID: messages
Fields:
- chatId (Ascending)
- createdAt (Descending)
```

---

## 🔔 **NOTIFICATION INDEXES** (For User Alerts)

### **Index #10: User Notifications**
```
Collection ID: notifications
Fields:
- userId (Ascending)
- createdAt (Descending)
```

### **Index #11: Unread Notifications**
```
Collection ID: notifications
Fields:
- userId (Ascending)
- isRead (Ascending)
- createdAt (Descending)
```

---

## 👤 **USER INDEXES** (For User Discovery)

### **Index #12: Users by City**
```
Collection ID: users
Fields:
- city (Ascending)
- isProfileCompleted (Ascending)
```

### **Index #13: Users by Interests**
```
Collection ID: users
Fields:
- city (Ascending)
- interests (Arrays)
```

---

## ✅ Quick Setup Checklist

Copy this checklist for quick reference:

- [ ] Create Index #1 (quests: city, createdAt DESC)
- [ ] Create Index #2 (quests: category, status, createdAt DESC)  
- [ ] Create Index #3 (quests: status, isEpic, createdAt DESC)
- [ ] Create Index #4 (quests: organizerUid, status, createdAt DESC)
- [ ] Create Index #5 (quests: status, createdAt DESC)
- [ ] Create Index #6 (chats: questId)
- [ ] Create Index #7 (chats: lastMessageAt DESC)
- [ ] Create Index #7.5 (chats: participants, lastMessageAt DESC) **CRITICAL**
- [ ] Create Index #8 (messages: chatId, timestamp ASC)
- [ ] Create Index #9 (messages: chatId, createdAt DESC)
- [ ] Create Index #10 (notifications: userId, createdAt DESC)
- [ ] Create Index #11 (notifications: userId, isRead, createdAt DESC)
- [ ] Create Index #12 (users: city, isProfileCompleted)
- [ ] Create Index #13 (users: city, interests)

---

## 🎯 Priority Order

**Start with these 6 indexes (MUST HAVE):**
1. Index #1 (quests by city)
2. Index #2 (quests by category)  
3. Index #3 (epic quests)
4. Index #5 (quest status)
5. Index #7.5 (user chats) **CRITICAL - Fixes current error**
6. Index #10 (notifications)

The rest can be created later as features develop.
