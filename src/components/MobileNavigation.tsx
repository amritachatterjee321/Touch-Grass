import React from 'react';
import { MessageSquare, Bookmark, MessageCircle, User } from 'lucide-react';
import { Button } from './ui/button';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  unreadCount?: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPage, onPageChange, unreadCount = 0 }) => {
  const navigationItems = [
    {
      id: 'quests',
      label: 'QUESTS',
      icon: MessageSquare,
    },
    {
      id: 'saved',
      label: 'SAVED',
      icon: Bookmark,
    },
    {
      id: 'chats',
      label: 'CHAT',
      icon: MessageCircle,
    },
    {
      id: 'profile',
      label: 'PROFILE',
      icon: User,
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#e6e6fa] border-t-4 border-[#87ceeb] shadow-lg">
      <div className="flex justify-around items-center px-2 py-3">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <div key={item.id} className="relative flex-1 mx-1">
              <Button
                onClick={() => onPageChange(item.id)}
                className={`retro-button flex flex-col items-center gap-1 p-2 min-w-0 w-full transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#98fb98] border-[#32cd32] shadow-lg transform scale-105' 
                    : 'bg-[#f0f8ff] border-[#87ceeb] hover:bg-[#98fb98] hover:border-[#32cd32] hover:shadow-lg hover:transform hover:scale-105'
                }`}
              >
                <IconComponent className={`h-5 w-5 ${isActive ? 'text-[#32cd32]' : 'text-[#4682b4]'}`} />
                <span className={`text-xs font-bold pixel-perfect ${isActive ? 'text-[#32cd32]' : 'text-[#4682b4]'}`}>
                  {item.label}
                </span>
              </Button>
              {/* Notification Badge for Chat */}
              {item.id === 'chats' && unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#ff6347] text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-[#e6e6fa] shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
