TouchGrass - Product Requirements Document
Table of Contents

Product Overview
Core Features & User Stories
Technical Requirements
Design System
User Flow
Success Metrics
Future Enhancements


1. Product Overview
Product Name: TouchGrass
Vision: A retro gaming-themed social platform that gamifies real-world activities by helping people organize and join local events through a quest-based interface.
Mission Statement: Encourage people to "touch grass" (go outside and socialize) by making event planning fun, engaging, and reminiscent of classic video game adventures.

2. Core Features & User Stories
2.1 Homepage - Quest Discovery
Description: Main message board displaying all available "quests" (events/activities) in a retro gaming interface.
User Stories:

As a user, I want to browse available quests so I can find interesting activities to join
As a user, I want to filter quests by category (Social, Adventure, Creative) so I can find relevant activities
As a user, I want to see quest details including location, time, and organizer info before joining
As a user, I want to join a quest by clicking "JOIN QUEST" and writing an intro message
As a quest organizer, I want to receive join requests with user profiles and intro messages

Key Elements:

Quest cards with Nintendo-style design elements
Category filters (ALL, SOCIAL, ADVENTURE, CREATIVE)
Location-based filtering (e.g., "Bangalore, Karnataka")
Quest details: title, description, location, time, organizer
Heart icon for saving quests
Join Quest button with intro message modal

2.2 Quests Page - Quest Management
Description: Personal dashboard for managing saved quests, joined quests, and organized events.
User Stories:

As a user, I want to view my saved quests so I can decide which ones to join later
As a user, I want to see quests I've joined and their current status
As a quest organizer, I want to manage my created quests and see join requests
As a user, I want to access group chats for approved quests

Key Elements:

Three tabs: "MY QUESTS", "SAVED", "JOINED"
Quest status indicators (SOCIAL, CREATIVE, ADVENTURE)
Management buttons: "MANAGE", "SQUAD CHAT"
Quest scheduling information (date, time, location)
Color-coded quest categories

2.3 Active Quests - Real-time Updates
Description: Live updates and chat functionality for ongoing quests.
User Stories:

As a quest participant, I want to receive real-time updates about my active quests
As a quest organizer, I want to send updates to all participants
As a user, I want to see which quests are currently active vs completed

Key Elements:

"ACTIVE" and "COMPLETED" status tabs
Real-time quest updates with timestamps
Notification badges for new messages
Quest progress indicators

2.4 Chat System - Group Communication
Description: Group chat functionality for approved quest participants.
User Stories:

As a quest participant, I want to chat with other approved members
As a user, I want to see all my active and past group chats
As a user, I want to receive notifications for new messages

Key Elements:

List of all group chats
Message previews and timestamps
Unread message indicators
Group chat access from quest management

2.5 Hero Dashboard - Gamified Statistics
Description: Personal statistics and achievements in a retro gaming style.
User Stories:

As a user, I want to see my "level" and progress as a hero
As a user, I want to track how many adventures I've completed
As a user, I want to see my achievements and badges
As a user, I want to view my "grass touching" statistics

Key Elements:

Hero level display (e.g., "Level 15 Hero")
Statistics: Adventures Done (28), Led Adventures (12)
Achievement badges (First, Social, Adventure, Grass)
Hero journey messaging
Recent heroics activity feed
XP rewards for completed activities

2.6 Profile Creation & Management
Description: User onboarding with multiple authentication options and profile customization.
User Stories:

As a new user, I want to create my account using Google for quick signup
As a new user, I want to create my hero profile after authentication
As a user, I want to customize my hero persona with gaming elements
As a user, I want to add interests and preferences to match with relevant quests
As a user, I want to set my location for local quest discovery
As a returning user, I want to edit my profile information anytime


Profile Creation Flow:

Authentication Step:

Google OAuth signup
Terms of service and privacy policy acceptance


Hero Creation Step:

Import Google profile photo or upload custom avatar
Choose hero name (defaults to Google display name if available)
Select gaming-style avatar customization options


Profile Details Step:

Bio/introduction text
Interest tags and categories selection
Location setting (city/region)



Verification & Completion:

Profile preview
Welcome message with first quest suggestions




Technical Implementation:

Google OAuth 2.0 integration
Secure token storage
Profile data sync with Google account (optional)
Account linking capabilities
Privacy controls for Google data usage


3. Technical Requirements
3.1 Platform

Type: Progressive Web App (PWA)
Framework: React.js with modern hooks
Styling: CSS-in-JS or Styled Components
State Management: Context API or Redux Toolkit
Database: Firebase Firestore or PostgreSQL
Authentication: Firebase Auth with Google OAuth provider
Real-time: WebSockets or Firebase Realtime Database

3.2 Authentication & Security

Google OAuth 2.0: Official Google Sign-In integration
Firebase Auth: Handles multiple auth providers seamlessly
JWT Tokens: Secure session management
Privacy Compliance: GDPR/CCPA compliant data handling


3.3 Core Functionality

Responsive Design: Mobile-first approach
Real-time Updates: Live chat and quest status updates
Geolocation: Location-based quest discovery
Push Notifications: Quest updates and messages
Image Upload: Profile photos and quest images
Search & Filter: Quest discovery optimization


4. Design System
4.1 Visual Theme

Style: Retro Nintendo/8-bit gaming aesthetic
Typography: Gaming-inspired fonts
Icons: Pixel art style icons and badges

4.2 UI Components

Quest Cards: Rounded corners with category color coding
Buttons: Pill-shaped with gaming-style hover effects
Navigation: Bottom tab bar with gaming icons
Modals: Layered design with retro borders
Achievement Badges: Pixel art style rewards
Auth Buttons: Google branding compliance with gaming aesthetic

4.3 Gamification Elements

XP System: Points for joining and organizing quests
Levels: Hero progression based on activity
Achievements: Unlockable badges for milestones
Statistics: Dashboard tracking various metrics
Quest Language: Gaming terminology throughout


5. User Flow
5.1 New User Onboarding (Enhanced)

Landing/Welcome Screen

App introduction with retro gaming visuals
"Continue with Google" button

Authentication Flow:

Google OAuth Path:

Click "Continue with Google"
Google consent screen
Automatic return to app with profile data



Hero Profile Creation:

upload phto 
Set hero name 
Gaming-style character customization
Bio and interests selection
Location 
Personality type - introvert, extrovert, other
Gender
Age




5.2 Quest Discovery & Joining

Browse quest feed on homepage
Filter by category/location if desired
Click on quest card to view details
Click "JOIN QUEST" button
Write introduction message
Wait for organizer approval
Receive notification when approved
Access group chat to coordinate

5.3 Quest Organization

Click create quest button (+ icon)
Fill out quest details form
Set category, location, time, participant limit
Publish quest to feed
Review join requests as they come in
Approve/decline participants
Manage group chat and quest updates




