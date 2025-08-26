import React, { useState } from 'react';
import { MessageSquare, Bookmark, MessageCircle, User, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationMenuProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  unreadCount?: number;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ currentPage, onPageChange, unreadCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'quests',
      label: 'Quest Board',
      icon: MessageSquare,
      description: 'Browse and join quests'
    },
    {
      id: 'saved',
      label: 'Saved Events',
      icon: Bookmark,
      description: 'Your saved quests'
    },
    {
      id: 'chats',
      label: 'Chats',
      icon: MessageCircle,
      description: 'Message your companions'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      description: 'App preferences'
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <div className="flex justify-center mb-4">
        <Button
          onClick={toggleMenu}
          className="retro-button px-4 py-2 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 pixel-perfect" />
          ) : (
            <Menu className="h-5 w-5 pixel-perfect" />
          )}
          <span className="ml-2 pixel-perfect">
            {isMenuOpen ? 'CLOSE MENU' : 'OPEN MENU'}
          </span>
        </Button>
      </div>

      {/* Navigation Menu */}
      {isMenuOpen && (
        <div className="retro-border bg-[#e6e6fa] border-[#87ceeb] p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <div className="relative">
                  <Button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`retro-button p-3 text-[#2d2d2d] transition-all duration-200 flex flex-col items-center gap-2 h-auto min-h-[80px] ${
                      isActive 
                        ? 'bg-[#98fb98] border-[#32cd32] shadow-lg transform scale-105' 
                        : 'bg-[#f0f8ff] border-[#87ceeb] hover:bg-[#98fb98] hover:border-[#32cd32] hover:shadow-lg hover:transform hover:scale-105'
                    }`}
                  >
                    <IconComponent className={`h-6 w-6 ${isActive ? 'text-[#32cd32]' : 'text-[#4682b4]'}`} />
                    <span className="text-xs sm:text-sm font-semibold pixel-perfect">
                      {item.label}
                    </span>
                    <span className="text-xs text-center opacity-75">
                      {item.description}
                    </span>
                  </Button>
                  {/* Notification Badge for Chat */}
                  {item.id === 'chats' && unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-[#ff6347] text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-[#e6e6fa] shadow-lg">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Page Indicator */}
      <div className="text-center mb-4">
        <div className="retro-border bg-[#f0f8ff] border-[#87ceeb] p-2 inline-block">
          <span className="text-[#4682b4] text-sm sm:text-base pixel-perfect">
            ~ {navigationItems.find(item => item.id === currentPage)?.label.toUpperCase()} ~
          </span>
        </div>
      </div>
    </div>
  );
};

