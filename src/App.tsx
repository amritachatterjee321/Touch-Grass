import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button
} from './components/ui';
import { Gamepad2, Sword, User, CheckCircle } from 'lucide-react';
import { EventCard } from './components/EventCard';
import { CategoryFilter } from './components/CategoryFilter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { AuthGuard } from './components/AuthGuard';
import { NavigationMenu } from './components/NavigationMenu';
import { MobileNavigation } from './components/MobileNavigation';
import { SavedEvents } from './components/pages/SavedEvents';
import { Chats } from './components/pages/Chats';
import { Profile } from './components/pages/Profile';
import { Settings } from './components/pages/Settings';
import { useIsMobile } from './components/ui/use-mobile';
import { useUnreadMessages } from './hooks/useUnreadMessages';
import { ImageUpload } from './components/ImageUpload';

// Add custom styles for form consistency
const formStyles = `
  .form-input, .form-textarea, .form-select {
    font-size: 12px !important;
    font-weight: normal !important;
    font-family: 'Press Start 2P', monospace !important;
    line-height: 1.4 !important;
  }
  
  .form-input::placeholder, .form-textarea::placeholder {
    font-size: 10px !important;
    font-weight: normal !important;
    color: #9ca3af !important;
  }
  
  .form-select option {
    font-size: 12px !important;
    font-weight: normal !important;
  }
  
  /* Ensure all select options are not bold */
  select option {
    font-weight: normal !important;
    font-size: 12px !important;
  }
  
  /* Ensure all select elements have consistent text size */
  select {
    font-size: 10px !important;
    font-weight: normal !important;
    font-family: 'Press Start 2P', monospace !important;
  }
  
  /* Ensure placeholder text in all inputs is small */
  input::placeholder, textarea::placeholder {
    font-size: 10px !important;
    font-weight: normal !important;
    color: #9ca3af !important;
  }
  
  /* Ensure date and time inputs work properly */
  input[type="date"], input[type="time"] {
    font-size: 12px !important;
    font-weight: normal !important;
    font-family: 'Press Start 2P', monospace !important;
    line-height: 1.4 !important;
    color: #2d2d2d !important;
    background: #ffffff !important;
    border: 4px solid #87ceeb !important;
    border-style: outset !important;
    padding: 8px 12px !important;
    border-radius: 0 !important;
    cursor: pointer !important;
    position: relative !important;
    z-index: 10 !important;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    cursor: pointer !important;
    filter: invert(0.5) !important;
    position: relative !important;
    z-index: 20 !important;
  }
  
  input[type="date"]:focus, input[type="time"]:focus {
    outline: 3px solid #ff6347 !important;
    outline-offset: 2px !important;
    border-color: #ff6347 !important;
    z-index: 30 !important;
  }
  
  /* Ensure the date/time picker popup appears above other elements */
  input[type="date"]::-webkit-datetime-edit,
  input[type="time"]::-webkit-datetime-edit {
    color: #2d2d2d !important;
    font-size: 12px !important;
    font-weight: normal !important;
  }
  
  /* Ensure date picker popup appears above modal */
  input[type="date"]::-webkit-calendar-picker-indicator {
    z-index: 1000 !important;
  }
  
  /* Override any modal z-index issues */
  .DialogContent {
    z-index: 50 !important;
  }
  
  input[type="date"] {
    z-index: 100 !important;
  }
`;


interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  type: string;
  price: string;
  organizer: string;
  interested: number;
  genderPreference: 'all' | 'women' | 'men';
  eventUrl?: string;
  imageUrl?: string;
}



const categories = ['All', 'Music', 'Sports', 'Food', 'Outdoor', 'Arts', 'Social', 'Learning'];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Jazz Night at Blue Note',
    description: "I'm new to the city and love jazz music. Would be great to meet fellow music lovers! Looking for 1-2 people to join me for this amazing night out.",
    date: 'Tonight',
    time: '8:00 PM',
    location: 'Downtown',
    category: 'Music',
    type: '1-on-1',
    price: 'Free',
    organizer: 'Sarah M.',
    interested: 3,
    genderPreference: 'women',
    eventUrl: 'https://www.eventbrite.com/e/jazz-night-blue-note',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Food Truck Festival',
    description: "Love trying new foods but hate going alone! Join me for an afternoon of amazing food trucks and good vibes. Let's discover some hidden gems together!",
    date: 'Saturday',
    time: '12:00 PM',
    location: 'Central Park',
    category: 'Food',
    type: 'Group',
    price: '15-25 Gold',
    organizer: 'Mike T.',
    interested: 8,
    genderPreference: 'all',
    eventUrl: 'https://www.meetup.com/food-lovers-nyc/events/food-truck-festival',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Morning Hiking Trail',
    description: "Early bird looking for hiking companions! Beautiful 5-mile trail with amazing city views. Perfect for intermediate hikers who love sunrise adventures.",
    date: 'Sunday',
    time: '6:30 AM',
    location: 'Mountain View Trail',
    category: 'Outdoor',
    type: 'Group',
    price: 'Free',
    organizer: 'Alex K.',
    interested: 5,
    genderPreference: 'all',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'
  },
  {
    id: '4',
    title: 'Art Museum Exhibition',
    description: "Contemporary art enthusiast seeking culture buddies! New exhibition opening this week. Great opportunity to discuss art and grab coffee afterward.",
    date: 'Friday',
    time: '2:00 PM',
    location: 'Metropolitan Museum',
    category: 'Arts',
    type: 'Small Group',
    price: '25 Gold',
    organizer: 'Emma L.',
    interested: 4,
    genderPreference: 'women',
    eventUrl: 'https://www.facebook.com/events/contemporary-art-exhibition',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop'
  },
  {
    id: '5',
    title: 'Pickup Basketball Game',
    description: "Weekly basketball game needs more players! All skill levels welcome. We play for fun and fitness. Great way to stay active and meet new people.",
    date: 'Wednesday',
    time: '7:00 PM',
    location: 'Community Center',
    category: 'Sports',
    type: 'Group',
    price: 'Free',
    organizer: 'Jordan P.',
    interested: 12,
    genderPreference: 'men',
    eventUrl: 'https://www.meetup.com/basketball-pickup-games',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop'
  }
];

function AppContent() {
  const { saveEvent, unsaveEvent, isEventSaved, user, showAuthModal } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [interestedEvents, setInterestedEvents] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('quests');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  // Form state for creating new events
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 'Free',
    eventUrl: ''
  });

  const isMobile = useIsMobile();
  const { getTotalUnreadCount } = useUnreadMessages();


  const filteredEvents = events.filter(event => {
    return selectedCategory === 'All' || event.category === selectedCategory;
  });

  const toggleInterest = (eventId: string) => {
    const newInterestedEvents = new Set(interestedEvents);
    if (newInterestedEvents.has(eventId)) {
      newInterestedEvents.delete(eventId);
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, interested: event.interested - 1 }
          : event
      ));
    } else {
      newInterestedEvents.add(eventId);
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, interested: event.interested + 1 }
          : event
      ));
    }
    setInterestedEvents(newInterestedEvents);
  };

  const toggleSaved = (eventId: string) => {
    if (isEventSaved(eventId)) {
      unsaveEvent(eventId);
    } else {
      saveEvent(eventId);
    }
  };

  const handleCreateEvent = (e?: React.MouseEvent) => {
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.date || !formData.time || !formData.location.trim()) {
      alert('Please fill in all required fields: Quest Name, Description, Date, Time, and Location');
      return;
    }

    const createEvent = (imageUrl?: string) => {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: 'Social', // Default category
        type: 'Group',
        price: formData.price || 'Free',
        organizer: user?.name || 'Anonymous',
        interested: 0,
        genderPreference: 'all', // Default to all heroes
        eventUrl: formData.eventUrl || undefined,
        imageUrl: imageUrl
      };
      
      setEvents([newEvent, ...events]);
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        price: 'Free',
        eventUrl: ''
      });
      setSelectedImage(null);
      setIsCreateDialogOpen(false);
    };

    // Handle image upload if present
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        createEvent(e.target?.result as string);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      createEvent();
    }
  };

  // Check if user profile is complete
  const isProfileComplete = user?.profileComplete && user?.gender && user?.age && user?.city && user?.bio && user?.personalityType;

  return (
    <div className="min-h-screen bg-[#f5f5dc]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <style dangerouslySetInnerHTML={{ __html: formStyles }} />
      {/* Header Section - TOUCHGRASS */}
      <header className="lilac-header p-2 sm:p-4">
        <div className="retro-border p-2 sm:p-4">
          {/* Top row with logo and sign in button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            {/* Logo and title section */}
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4">
              <div className="retro-border bg-[#ff6347] p-1 sm:p-2">
                <Sword className="h-6 w-6 sm:h-8 sm:w-8 text-white pixel-perfect" />
              </div>
              <h1 className="text-2xl sm:text-4xl text-[#ff6347] drop-shadow-lg tracking-wider pixel-perfect">
                TOUCHGRASS
              </h1>
              <div className="retro-border bg-[#ff6347] p-1 sm:p-2">
                <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8 text-white pixel-perfect" />
              </div>
            </div>
            
            {/* Sign In/Sign Up Buttons - Top Right */}
            {!user && (
              <div className="flex items-center justify-center sm:justify-end">
                <Button
                  onClick={() => showAuthModal('signup')}
                  className="retro-button px-4 sm:px-6 py-2 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                >
                  <span className="pixel-perfect">LOG IN</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={`max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 ${user && isMobile ? 'pb-20' : ''}`}>
        {/* Welcome Message for New Users */}
        {user && isProfileComplete && user.createdAt && (
          <div className="mb-6 sm:mb-8">
            <div className="retro-border bg-[#d4edda] border-[#28a745] p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-[#155724]" />
                <h3 className="text-[#155724] text-lg sm:text-xl font-bold pixel-perfect">
                  ~ WELCOME TO THE ADVENTURE! ~
                </h3>
              </div>
              <p className="text-[#155724] text-sm sm:text-base mb-4 pixel-perfect">
                Your hero profile is complete! You're now ready to find quest companions and start your adventures.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#155724] pixel-perfect">
                <span>Member since:</span>
                <span className="font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu for Logged-in Users */}
        {user && !isMobile && (
          <NavigationMenu 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            unreadCount={getTotalUnreadCount()}
          />
        )}

        {/* Page Content */}
        {user ? (
          <>
            {currentPage === 'quests' && (
              <>
                {/* Start New Quest Button */}
                <div className="mb-6 sm:mb-8">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <AuthGuard 
                        action="create-quest"
                        className="retro-button w-full h-12 sm:h-16 text-[#2d2d2d] text-base sm:text-xl bg-[#98fb98] border-4 border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="pixel-perfect">▶</span>
                        <span className="pixel-perfect">START NEW QUEST</span>
                        <span className="pixel-perfect">◀</span>
                      </AuthGuard>
                    </DialogTrigger>
                    <DialogContent className="retro-border bg-[#e6e6fa] border-[#87ceeb] text-[#2d2d2d] max-w-[95vw] sm:max-w-lg max-h-[90vh]">
                      <DialogHeader className="retro-border bg-[#f0f8ff] p-3 sm:p-4 mb-4 sm:mb-6">
                        <DialogTitle className="text-[#ff6347] text-center text-base sm:text-lg pixel-perfect">~ CREATE NEW QUEST ~</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 sm:space-y-5 text-sm overflow-y-auto max-h-[70vh]">
                        <div>
                          <Label htmlFor="title" className="text-[#4682b4] text-xs pixel-perfect">Quest Name:</Label>
                          <Input 
                            id="title" 
                            placeholder="What's your adventure?" 
                            className="form-input retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-[#4682b4] text-xs pixel-perfect">Quest Description:</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Tell heroes about your quest..." 
                            rows={3} 
                            className="form-textarea retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 min-h-[80px] sm:min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="date" className="text-[#4682b4] text-xs pixel-perfect">Date:</Label>
                            <div className="flex gap-1">
                              <select 
                                value={formData.date.split('-')[2] || '01'}
                                onChange={(e) => {
                                  const currentDate = formData.date || '2025-01-01';
                                  const [year, month] = currentDate.split('-');
                                  const newDate = `${year || '2025'}-${month || '01'}-${e.target.value}`;
                                  console.log('Day changed to:', newDate);
                                  setFormData({...formData, date: newDate});
                                }}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'normal',
                                  fontFamily: "'Press Start 2P', monospace",
                                  lineHeight: '1.4',
                                  color: '#2d2d2d',
                                  background: '#ffffff',
                                  border: '4px solid #87ceeb',
                                  borderStyle: 'outset',
                                  padding: '8px 12px',
                                  borderRadius: '0',
                                  width: '25%',
                                  height: '32px',
                                  marginTop: '8px'
                                }}
                              >
                                {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                                  <option key={day} value={day.toString().padStart(2, '0')}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                              <span style={{ marginTop: '8px', fontSize: '12px', color: '#2d2d2d' }}>/</span>
                              <select 
                                value={formData.date.split('-')[1] || '01'}
                                onChange={(e) => {
                                  const currentDate = formData.date || '2025-01-01';
                                  const [year, _, day] = currentDate.split('-');
                                  const newDate = `${year || '2025'}-${e.target.value}-${day || '01'}`;
                                  console.log('Month changed to:', newDate);
                                  setFormData({...formData, date: newDate});
                                }}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'normal',
                                  fontFamily: "'Press Start 2P', monospace",
                                  lineHeight: '1.4',
                                  color: '#2d2d2d',
                                  background: '#ffffff',
                                  border: '4px solid #87ceeb',
                                  borderStyle: 'outset',
                                  padding: '8px 12px',
                                  borderRadius: '0',
                                  width: '25%',
                                  height: '32px',
                                  marginTop: '8px'
                                }}
                              >
                                {[
                                  {value: '01', label: 'Jan'},
                                  {value: '02', label: 'Feb'},
                                  {value: '03', label: 'Mar'},
                                  {value: '04', label: 'Apr'},
                                  {value: '05', label: 'May'},
                                  {value: '06', label: 'Jun'},
                                  {value: '07', label: 'Jul'},
                                  {value: '08', label: 'Aug'},
                                  {value: '09', label: 'Sep'},
                                  {value: '10', label: 'Oct'},
                                  {value: '11', label: 'Nov'},
                                  {value: '12', label: 'Dec'}
                                ].map(month => (
                                  <option key={month.value} value={month.value}>
                                    {month.label}
                                  </option>
                                ))}
                              </select>
                              <span style={{ marginTop: '8px', fontSize: '12px', color: '#2d2d2d' }}>/</span>
                              <select 
                                value={formData.date.split('-')[0] || '2025'}
                                onChange={(e) => {
                                  const currentDate = formData.date || '2025-01-01';
                                  const [_, month, day] = currentDate.split('-');
                                  const newDate = `${e.target.value}-${month || '01'}-${day || '01'}`;
                                  console.log('Year changed to:', newDate);
                                  setFormData({...formData, date: newDate});
                                }}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'normal',
                                  fontFamily: "'Press Start 2P', monospace",
                                  lineHeight: '1.4',
                                  color: '#2d2d2d',
                                  background: '#ffffff',
                                  border: '4px solid #87ceeb',
                                  borderStyle: 'outset',
                                  padding: '8px 12px',
                                  borderRadius: '0',
                                  width: '35%',
                                  height: '32px',
                                  marginTop: '8px'
                                }}
                              >
                                {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="time" className="text-[#4682b4] text-xs pixel-perfect">Time:</Label>
                            <div className="flex gap-1">
                              <select 
                                value={(() => {
                                  const currentTime = formData.time || '12:00';
                                  const [hours] = currentTime.split(':');
                                  const hour = parseInt(hours);
                                  return hour === 0 ? '12' : (hour > 12 ? (hour - 12).toString() : hour.toString());
                                })()}
                                onChange={(e) => {
                                  const currentTime = formData.time || '12:00';
                                  const [hours, minutes] = currentTime.split(':');
                                  const currentHour = parseInt(hours);
                                  const isPM = currentHour >= 12;
                                  let newHour = parseInt(e.target.value);
                                  if (isPM && newHour !== 12) {
                                    newHour += 12;
                                  } else if (!isPM && newHour === 12) {
                                    newHour = 0;
                                  }
                                  const newTime = `${newHour.toString().padStart(2, '0')}:${minutes || '00'}`;
                                  console.log('Hour changed to:', newTime);
                                  setFormData({...formData, time: newTime});
                                }}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'normal',
                                  fontFamily: "'Press Start 2P', monospace",
                                  lineHeight: '1.4',
                                  color: '#2d2d2d',
                                  background: '#ffffff',
                                  border: '4px solid #87ceeb',
                                  borderStyle: 'outset',
                                  padding: '8px 12px',
                                  borderRadius: '0',
                                  width: '25%',
                                  height: '32px',
                                  marginTop: '8px'
                                }}
                              >
                                {Array.from({length: 12}, (_, i) => i + 1).map(hour => (
                                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                                    {hour}
                                  </option>
                                ))}
                              </select>
                              <span style={{ marginTop: '8px', fontSize: '12px', color: '#2d2d2d' }}>:</span>
                              <select 
                                value={formData.time.split(':')[1] || '00'}
                                onChange={(e) => {
                                  const currentTime = formData.time || '12:00';
                                  const [hours] = currentTime.split(':');
                                  const newTime = `${hours || '12'}:${e.target.value}`;
                                  console.log('Minutes changed to:', newTime);
                                  setFormData({...formData, time: newTime});
                                }}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'normal',
                                  fontFamily: "'Press Start 2P', monospace",
                                  lineHeight: '1.4',
                                  color: '#2d2d2d',
                                  background: '#ffffff',
                                  border: '4px solid #87ceeb',
                                  borderStyle: 'outset',
                                  padding: '8px 12px',
                                  borderRadius: '0',
                                  width: '25%',
                                  height: '32px',
                                  marginTop: '8px'
                                }}
                              >
                                {Array.from({length: 60}, (_, i) => i).map(minute => (
                                  <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              <select 
                                value={(() => {
                                  const currentTime = formData.time || '12:00';
                                  const [hours] = currentTime.split(':');
                                  const hour = parseInt(hours);
                                  return hour >= 12 ? 'PM' : 'AM';
                                })()}
                                onChange={(e) => {
                                  const currentTime = formData.time || '12:00';
                                  const [hours, minutes] = currentTime.split(':');
                                  let hour = parseInt(hours);
                                  if (e.target.value === 'PM' && hour < 12) {
                                    hour += 12;
                                  } else if (e.target.value === 'AM' && hour >= 12) {
                                    hour -= 12;
                                  }
                                  const newTime = `${hour.toString().padStart(2, '0')}:${minutes || '00'}`;
                                  console.log('AM/PM changed to:', newTime);
                                  setFormData({...formData, time: newTime});
                                }}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'normal',
                                  fontFamily: "'Press Start 2P', monospace",
                                  lineHeight: '1.4',
                                  color: '#2d2d2d',
                                  background: '#ffffff',
                                  border: '4px solid #87ceeb',
                                  borderStyle: 'outset',
                                  padding: '8px 12px',
                                  borderRadius: '0',
                                  width: '20%',
                                  height: '32px',
                                  marginTop: '8px'
                                }}
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="location" className="text-[#4682b4] text-xs pixel-perfect">Location:</Label>
                          <Input 
                            id="location" 
                            placeholder="Where is the quest?" 
                            className="form-input retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="price" className="text-[#4682b4] text-xs pixel-perfect">Cost:</Label>
                          <select 
                            id="price"
                            value={formData.price}
                            onChange={(e) => {
                              console.log('Price changed to:', e.target.value);
                              setFormData({...formData, price: e.target.value});
                            }}
                            className="form-select retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#87ceeb]"
                          >
                            <option value="Free" className="text-xs">Free</option>
                            <option value="Paid" className="text-xs">Paid</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="eventUrl" className="text-[#4682b4] text-xs pixel-perfect">Quest Link (Optional):</Label>
                          <Input 
                            id="eventUrl" 
                            placeholder="https://..." 
                            className="form-input retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12"
                            value={formData.eventUrl}
                            onChange={(e) => setFormData({...formData, eventUrl: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label className="text-[#4682b4] text-xs pixel-perfect">Quest Image (Optional):</Label>
                          <ImageUpload 
                            onImageChange={setSelectedImage}
                            className="mt-2"
                          />
                        </div>
                        <AuthGuard 
                          action="create-quest"
                          className="retro-button w-full h-12 sm:h-14 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                          onClick={handleCreateEvent}
                        >
                          <span className="pixel-perfect">▶ CREATE QUEST ◀</span>
                        </AuthGuard>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Quest Categories Section */}
                <div className="mb-8">
                  <CategoryFilter 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>

                {/* Quest/Event List Section */}
                {filteredEvents.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid gap-6">
                      {filteredEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          isInterested={interestedEvents.has(event.id)}
                          isSaved={isEventSaved(event.id)}
                          onToggleInterest={toggleInterest}
                          onToggleSaved={toggleSaved}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="lilac-event-box retro-border p-4 sm:p-8 text-center">
                    <div className="retro-border bg-white/80 p-4 sm:p-6 inline-block mb-4 sm:mb-6">
                      <Sword className="h-16 w-16 sm:h-20 sm:w-20 text-[#87ceeb] mx-auto mb-4 pixel-perfect" />
                    </div>
                    <h3 className="text-[#ff6347] text-lg sm:text-xl mb-4 tracking-wide pixel-perfect">~ NO QUESTS FOUND ~</h3>
                    <p className="text-[#4682b4] text-sm sm:text-base mb-4 sm:mb-6 pixel-perfect">Try selecting a different category or create your own quest!</p>
                    <AuthGuard 
                      action="create-quest"
                      className="retro-button px-4 sm:px-6 py-2 sm:py-3 text-sm bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <span className="pixel-perfect">CREATE QUEST</span>
                    </AuthGuard>
                  </div>
                )}
              </>
            )}

            {currentPage === 'saved' && <SavedEvents />}
            {currentPage === 'chats' && <Chats />}
            {currentPage === 'profile' && <Profile />}
            {currentPage === 'settings' && <Settings />}
          </>
        ) : (
          <>
            {/* Quest Categories Section */}
            <div className="mb-8">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Quest/Event List Section */}
            {filteredEvents.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isInterested={interestedEvents.has(event.id)}
                      isSaved={isEventSaved(event.id)}
                      onToggleInterest={toggleInterest}
                      onToggleSaved={toggleSaved}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="lilac-event-box retro-border p-4 sm:p-8 text-center">
                <div className="retro-border bg-white/80 p-4 sm:p-6 inline-block mb-4 sm:mb-6">
                  <Sword className="h-16 w-16 sm:h-20 sm:w-20 text-[#87ceeb] mx-auto mb-4 pixel-perfect" />
                </div>
                <h3 className="text-[#ff6347] text-lg sm:text-xl mb-4 tracking-wide pixel-perfect">~ NO QUESTS FOUND ~</h3>
                <p className="text-[#4682b4] text-sm sm:text-base mb-4 sm:mb-6 pixel-perfect">Try selecting a different category or sign up to create your own quest!</p>
                <Button
                  onClick={() => showAuthModal('signup')}
                  className="retro-button px-4 sm:px-6 py-2 sm:py-3 text-sm bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                >
                  <span className="pixel-perfect">SIGN UP TO CREATE QUESTS</span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Mobile Navigation for Logged-in Users */}
      {user && isMobile && (
        <MobileNavigation 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          unreadCount={getTotalUnreadCount()}
        />
      )}
      
      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
}

// Wrap the app with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}