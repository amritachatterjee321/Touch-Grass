import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EventCard } from '../EventCard';
import { Button } from '../ui/button';

// Import the Event interface from the main App
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
}

export const SavedEvents: React.FC = () => {
  const { user, savedEvents, unsaveEvent } = useAuth();

  // Mock events data - in a real app, this would come from your backend
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Jazz Night at Blue Note',
      description: "I'm new to the city and love jazz music. Would be great to meet fellow music lovers!",
      date: 'Tonight',
      time: '8:00 PM',
      location: 'Downtown',
      category: 'Music',
      type: '1-on-1',
      price: 'Free',
      organizer: 'Sarah M.',
      interested: 3,
      genderPreference: 'women',
      eventUrl: 'https://www.eventbrite.com/e/jazz-night-blue-note'
    },
    {
      id: '2',
      title: 'Food Truck Festival',
      description: "Love trying new foods but hate going alone! Join me for an afternoon of amazing food trucks.",
      date: 'Saturday',
      time: '12:00 PM',
      location: 'Central Park',
      category: 'Food',
      type: 'Group',
      price: '15-25 Gold',
      organizer: 'Mike T.',
      interested: 8,
      genderPreference: 'all',
      eventUrl: 'https://www.meetup.com/food-lovers-nyc/events/food-truck-festival'
    }
  ];

  // Filter events to only show saved ones
  const savedEventObjects = mockEvents.filter(event => savedEvents.includes(event.id));

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-[#4682b4] pixel-perfect">Please log in to view your saved events.</p>
      </div>
    );
  }

  if (!savedEvents || savedEvents.length === 0) {
    return (
      <div className="lilac-event-box retro-border p-8 text-center">
        <div className="retro-border bg-white/80 p-6 inline-block mb-6">
          <Bookmark className="h-16 w-16 text-[#87ceeb] mx-auto mb-4 pixel-perfect" />
        </div>
        <h3 className="text-[#ff6347] text-lg sm:text-xl mb-4 tracking-wide pixel-perfect">
          ~ NO SAVED QUESTS ~
        </h3>
        <p className="text-[#4682b4] text-sm sm:text-base mb-6 pixel-perfect">
          You haven't saved any quests yet. Start exploring and save the ones that interest you!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[#ff6347] text-xl sm:text-2xl mb-2 pixel-perfect">
          ~ YOUR SAVED QUESTS ~
        </h2>
        <p className="text-[#4682b4] text-sm pixel-perfect">
          {savedEvents.length} quest{savedEvents.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="grid gap-6">
        {savedEventObjects.map((event) => (
          <div key={event.id} className="relative">
            <EventCard
              event={event}
              isInterested={false}
              isSaved={true}
              onToggleInterest={() => {}}
              onToggleSaved={() => unsaveEvent(event.id)}
            />
            <Button
              onClick={() => unsaveEvent(event.id)}
              className="absolute top-2 right-2 retro-button p-2 text-[#ff6347] bg-[#ffe6e6] border-[#ff6347] hover:bg-[#ffd6d6] transition-all duration-200"
              title="Remove from saved"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
