# Mock Authentication System Guide

## Overview
The mock authentication system allows you to test the app without requiring actual Google authentication. This is perfect for development and testing scenarios.

## Features

### 🧪 Mock User Login
- Login as any of the predefined mock users
- No Google authentication required
- Persistent login across browser sessions
- Full Firebase User object compatibility

### 👥 Available Mock Users

#### Basic Mock Users (@gmail.com domain):
1. **Alex Gaming** - `alex.gamer@gmail.com`
2. **Sarah Lens** - `sarah.photographer@gmail.com`
3. **Mike Volleyball** - `mike.sports@gmail.com`
4. **Priya Foodie** - `priya.foodie@gmail.com`
5. **David Code** - `david.coder@gmail.com`
6. **Emma Zen** - `emma.yoga@gmail.com`

#### Advanced Mock Users (@mockuser.com domain):
1. **Alex Gaming** - `alex.gaming@mockuser.com`
2. **Sarah Lens** - `sarah.lens@mockuser.com`
3. **Mike Volleyball** - `mike.volleyball@mockuser.com`
4. **Priya Foodie** - `priya.foodie@mockuser.com`
5. **David Code** - `david.coder@mockuser.com`
6. **Emma Zen** - `emma.yoga@mockuser.com`

## How to Use

### Method 1: Chat Debugger (Recommended)
1. Navigate to the Chat Debugger section
2. Find the "Mock User Login" component
3. Click on any mock user card to select them
4. Click "Login as this user" button
5. You're now logged in as that mock user!

### Method 2: Quick Mock Login Button
1. Look for the "🧪 Mock Login" button in the UI
2. Click it to instantly login as a test user
3. Use "🧪 Logout Mock User" to logout

### Method 3: Programmatic Login
```javascript
// Create mock user object
const mockUser = {
  uid: 'your_mock_uid',
  email: 'your_mock_email@gmail.com',
  displayName: 'Your Mock Name',
  photoURL: 'your_photo_url',
  // ... other Firebase User properties
}

// Store in localStorage
localStorage.setItem('mockUser', JSON.stringify(mockUser))

// Trigger login event
window.dispatchEvent(new CustomEvent('mockUserLogin', { 
  detail: mockUser 
}))
```

## Technical Details

### Storage
- Mock user data is stored in `localStorage` with key `'mockUser'`
- Persists across browser sessions
- Automatically restored on app reload

### Events
- `mockUserLogin`: Triggered when mock user logs in
- `mockUserLogout`: Triggered when mock user logs out

### Context Integration
- `useFirebase()` hook provides `isMockUser` boolean
- Mock users are treated as regular Firebase users throughout the app
- All existing components work seamlessly with mock users

## Testing Scenarios

### 1. Chat Functionality
- Login as different mock users
- Create chats and send messages
- Test real-time message updates
- Verify user profiles and avatars

### 2. Quest Management
- Create quests as different users
- Join quests with mock users
- Test quest chat integration
- Verify user-specific data

### 3. UI/UX Testing
- Test responsive design with different user profiles
- Verify avatar display and user information
- Test navigation and user flows
- Check loading states and error handling

## Benefits

✅ **No Google Setup Required**: Test without configuring Google OAuth
✅ **Multiple User Testing**: Switch between different user profiles instantly
✅ **Persistent Sessions**: Mock login persists across browser refreshes
✅ **Real Firebase Integration**: Mock users work with real Firebase database
✅ **Full Feature Testing**: All app features work with mock users
✅ **Development Friendly**: Perfect for development and debugging

## Security Note

⚠️ **Development Only**: This mock authentication system is designed for development and testing purposes only. It should NOT be used in production environments.

## Troubleshooting

### Mock User Not Persisting
- Check if localStorage is enabled in your browser
- Verify the mock user data is properly stored
- Clear localStorage and try logging in again

### Mock User Not Recognized
- Ensure the mock user object has all required Firebase User properties
- Check browser console for any parsing errors
- Verify the custom events are being dispatched correctly

### Firebase Context Issues
- Make sure `FirebaseContext` is properly wrapped around your app
- Check if `useFirebase` hook is being used within the context provider
- Verify the mock user state is being updated correctly

## Integration with Existing Components

All existing components that use `useFirebase()` will automatically work with mock users:

```typescript
const { user, isMockUser } = useFirebase()

// Check if current user is a mock user
if (isMockUser) {
  console.log('Testing with mock user:', user?.displayName)
}

// Use user data normally (works for both real and mock users)
console.log('Current user:', user?.email)
```

This makes the mock authentication system completely transparent to your existing codebase!






