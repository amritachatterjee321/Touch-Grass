import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const UserProfile: React.FC = () => {
  const { user, signOut, showAuthModal } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 retro-border bg-[#f0f8ff] border-[#87ceeb] rounded-lg">
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-[#87ceeb] text-[#2d2d2d] text-xs sm:text-sm font-bold">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="text-[#2d2d2d] text-xs sm:text-sm font-semibold pixel-perfect truncate">
          {user.name}
        </div>
        <div className="text-[#4682b4] text-xs pixel-perfect truncate">
          {user.city}
        </div>
      </div>
      
      <div className="flex gap-1 sm:gap-2">
        <Button
          onClick={() => showAuthModal('signup')}
          variant="ghost"
          size="sm"
          className="p-1 sm:p-2 text-[#4682b4] hover:text-[#2d2d2d] hover:bg-[#f0f8ff] transition-all duration-200"
          title="Edit Profile"
        >
          <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="p-1 sm:p-2 text-[#ff6347] hover:text-[#2d2d2d] hover:bg-[#ffe6e6] transition-all duration-200"
          title="Sign Out"
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
};
