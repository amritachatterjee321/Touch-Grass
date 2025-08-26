import React, { useState } from 'react';
import { MapPin, Users, User, ExternalLink, Star, Crown } from 'lucide-react';
import { FloppyDiskIcon } from './FloppyDiskIcon';
import { AuthGuard } from './AuthGuard';

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

interface EventCardProps {
  event: Event;
  isInterested: boolean;
  isSaved: boolean;
  onToggleInterest: (eventId: string) => void;
  onToggleSaved: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isInterested,
  isSaved,
  onToggleInterest,
  onToggleSaved
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleJoinQuest = () => {
    if (!isInterested) {
      setShowAnimation(true);
      // Animation will be hidden automatically when video ends
    }
    onToggleInterest(event.id);
  };

  const handleSaveEvent = () => {
    onToggleSaved(event.id);
    if (!isSaved) {
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 2000);
    }
  };
  const getCategoryColor = (category: string) => {
    const colors = {
      Music: 'bg-[#dda0dd] text-white border-[#9370db]',
      Sports: 'bg-[#87ceeb] text-white border-[#4682b4]',
      Food: 'bg-[#ffa07a] text-white border-[#ff6347]',
      Outdoor: 'bg-[#98fb98] text-[#2d2d2d] border-[#32cd32]',
      Arts: 'bg-[#ffb6c1] text-white border-[#ff69b4]',
      Social: 'bg-[#f0e68c] text-[#2d2d2d] border-[#daa520]',
      Learning: 'bg-[#e6e6fa] text-[#2d2d2d] border-[#9370db]'
    };
    return colors[category as keyof typeof colors] || 'bg-[#dda0dd] text-white border-[#9370db]';
  };



  const getGenderLabel = (genderPreference: string) => {
    switch (genderPreference) {
      case 'all':
        return 'All Heroes';
      case 'women':
        return 'Princesses Only';
      case 'men':
        return 'Knights Only';
      default:
        return 'All Heroes';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case '1-on-1':
        return <User className="h-4 w-4" />;
      case 'small group':
        return <Users className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <article 
      className="lilac-event-box quest-detail-section retro-border transform hover:scale-[1.02] transition-all duration-200 hover:shadow-xl relative"
      aria-labelledby={`event-title-${event.id}`}
      aria-describedby={`event-description-${event.id}`}
    >
      {/* Sword and Shield Animation Overlay */}
      {showAnimation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white p-4 rounded-lg shadow-2xl">
            <div className="bg-blue-100 p-2 rounded-lg">
              <div className="text-center">
                <video 
                  autoPlay 
                  muted 
                  loop={false}
                  style={{ width: 200, height: 200 }}
                  onEnded={() => setShowAnimation(false)}
                >
                  <source src="/sword-shield.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                                 <div className="mt-3">
                   <p className="text-green-600 font-semibold text-lg pixel-perfect">Request sent</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-3 sm:p-4">
        {/* Event Summary - Nested box */}
        <div className="retro-border bg-white/80 p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 
                  id={`event-title-${event.id}`}
                  className="text-[#ff6347] text-base sm:text-lg flex-1 pixel-perfect"
                >
                  {event.title}
                </h3>

              </div>
              <div 
                className="flex items-center gap-2 text-[#666666] text-xs sm:text-sm mb-2 cursor-pointer hover:text-[#4682b4] transition-colors"
                onClick={handleSaveEvent}
                title={isSaved ? "Remove from saved" : "Save event"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSaveEvent();
                  }
                }}
              >
                <FloppyDiskIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${isSaved ? 'text-[#ff6347]' : ''}`} aria-hidden="true" />
                <span className="font-normal">
                  <time dateTime={`${event.date} ${event.time}`}>
                    {event.date}, {event.time}
                  </time>
                </span>
              </div>
              {showSaveMessage && (
                <div className="text-[#32cd32] text-xs mb-2 font-normal animate-pulse">
                  ✓ Event saved to your account!
                </div>
              )}
              <div className="flex items-center gap-2 text-[#666666] text-xs sm:text-sm">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="font-normal">{event.location}</span>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2">
              {event.eventUrl && (
                <a
                  href={event.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-button p-1.5 sm:p-2 text-[#4682b4] hover:text-[#ff6347] hover:bg-[#f0f8ff] transition-colors flex-shrink-0 min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
                  title="View quest details"
                  aria-label={`Open ${event.title} details in new tab`}
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 pixel-perfect" />
                </a>
              )}
              <AuthGuard 
                action="save-event"
                className={`retro-button p-1.5 sm:p-2 transition-colors flex-shrink-0 min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center ${
                  isSaved 
                    ? 'text-[#ff6347] bg-[#ffe6e6] hover:bg-[#ffd6d6]' 
                    : 'text-[#4682b4] hover:text-[#ff6347] hover:bg-[#f0f8ff]'
                }`}
                onClick={handleSaveEvent}
                title="Save quest"
              >
                <FloppyDiskIcon className={`h-3 w-3 sm:h-4 sm:w-4 pixel-perfect ${isSaved ? 'fill-current' : ''}`} />
              </AuthGuard>
            </div>
          </div>
        </div>

        {/* Event Description - Nested box */}
        <div className="retro-border bg-white/80 p-3 sm:p-4 mb-3 sm:mb-4">
          <p 
            id={`event-description-${event.id}`}
            className="text-[#2d2d2d] text-xs sm:text-sm leading-relaxed pixel-perfect"
            style={{ 
              fontFamily: "'Press Start 2P', monospace",
              lineHeight: '1.8',
              letterSpacing: '0.02em',
              textRendering: 'optimizeLegibility'
            }}
          >
            {event.description}
          </p>
        </div>

        {/* Top Row: Category + Access/Cost Info - Desktop Only */}
        <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
          {/* Left: Category Button */}
          <div className={`retro-border px-2 sm:px-3 py-1 text-xs w-fit ${getCategoryColor(event.category)}`}>
            <span className="sr-only">Category: </span>
            <span className="font-semibold">{event.category.toUpperCase()}</span>
          </div>
          
          {/* Right: Access/Cost Info */}
          <div className="flex flex-col items-start sm:items-end space-y-1">
            <div className="flex items-center gap-1 text-xs sm:text-sm justify-start sm:justify-end">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className={`font-normal ${
                event.genderPreference === 'women' ? 'text-[#ff69b4]' : 
                event.genderPreference === 'men' ? 'text-[#4682b4]' : 
                'text-[#666666]'
              }`}>
                {getGenderLabel(event.genderPreference)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold justify-start sm:justify-end">
              <span className="font-normal">+</span>
              <span className={`font-normal ${
                event.price.toLowerCase() === 'free' ? 'text-[#32cd32]' : 'text-[#ff6347]'
              }`}>
                {event.price.toLowerCase() === 'free' ? 'FREE' : 'PAID'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile: Quest Details in same line as category */}
        <div className="flex flex-col sm:hidden gap-2 mb-3">
          <div className="flex items-center justify-between">
            <div className={`retro-border px-2 py-1 text-xs w-fit ${getCategoryColor(event.category)}`}>
              <span className="font-semibold">{event.category.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-[#9370db] text-xs">
              {getTypeIcon(event.type)}
              <span className="font-semibold">Quest Type:</span> 
              <span className="font-normal">{event.type}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <Users className="h-3 w-3" />
              <span className={`font-normal ${
                event.genderPreference === 'women' ? 'text-[#ff69b4]' : 
                event.genderPreference === 'men' ? 'text-[#4682b4]' : 
                'text-[#666666]'
              }`}>
                {getGenderLabel(event.genderPreference)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#9370db] text-xs">
              <Crown className="h-3 w-3" />
              <span className="font-semibold">Quest Master:</span> 
              <span className="font-normal">{event.organizer}</span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1 text-xs font-semibold">
              <span className="font-normal">+</span>
              <span className={`font-normal ${
                event.price.toLowerCase() === 'free' ? 'text-[#32cd32]' : 'text-[#ff6347]'
              }`}>
                {event.price.toLowerCase() === 'free' ? 'FREE' : 'PAID'}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop: Quest Details in separate section */}
        <div className="hidden sm:grid grid-cols-1 gap-4 mb-3 sm:mb-4">
          {/* Quest Details */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-[#9370db] text-xs sm:text-sm">
              {getTypeIcon(event.type)}
              <span className="font-semibold">Quest Type:</span> 
              <span className="font-normal">{event.type}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#9370db] text-xs sm:text-sm">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-semibold">Quest Master:</span> 
              <span className="font-normal">{event.organizer}</span>
            </div>
          </div>

          {/* Join Quest Button */}
          <div className="flex items-center justify-center sm:justify-end">
            <AuthGuard 
              action="join-quest"
              className={`retro-button h-10 sm:h-12 px-4 sm:px-6 text-[#2d2d2d] text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg min-h-[40px] sm:min-h-[48px] min-w-[100px] sm:min-w-[120px] w-full sm:w-auto ${
                isInterested
                  ? 'bg-[#ffd700] border-[#ffa500] cursor-not-allowed' 
                  : showAnimation
                  ? 'bg-[#4682b4] border-[#4682b4] cursor-not-allowed'
                  : 'bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90]'
              }`}
              onClick={handleJoinQuest}
              disabled={isInterested || showAnimation}
            >
              <span className="pixel-perfect">
                {isInterested 
                  ? "Request Sent" 
                  : showAnimation 
                  ? "Request Sent..." 
                  : "JOIN QUEST"
                }
              </span>
            </AuthGuard>
          </div>
        </div>

        {/* Mobile: Join Quest Button */}
        <div className="flex sm:hidden items-center justify-center mb-3">
          <AuthGuard 
            action="join-quest"
            className={`retro-button h-10 px-4 text-[#2d2d2d] text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg min-h-[40px] min-w-[100px] w-full ${
              isInterested
                ? 'bg-[#ffd700] border-[#ffa500] cursor-not-allowed' 
                : showAnimation
                ? 'bg-[#4682b4] border-[#4682b4] cursor-not-allowed'
                : 'bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90]'
            }`}
            onClick={handleJoinQuest}
            disabled={isInterested || showAnimation}
          >
            <span className="pixel-perfect">
              {isInterested 
                ? "Request Sent" 
                : showAnimation 
                ? "Request Sent..." 
                : "JOIN QUEST"
              }
            </span>
          </AuthGuard>
        </div>

        {/* Bottom Section: Join Status */}
        <div className="mb-3 sm:mb-4">
          {isInterested && (
            <div className="flex items-center gap-1 text-[#ffa500] text-xs sm:text-sm">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
              <span className="pixel-perfect">Request Pending...</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};