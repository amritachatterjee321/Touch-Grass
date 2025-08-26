import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  action: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  title?: string;
}

export const AuthGuard = React.forwardRef<HTMLButtonElement, AuthGuardProps>(({ 
  children, 
  action, 
  className = '', 
  onClick, 
  disabled = false,
  type = 'button',
  title
}, ref) => {
  const { isAuthenticated, showAuthModal } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      
      // Different flows based on action
      if (action === 'create-quest' || action === 'join-quest' || action === 'save-event') {
        // For quest actions, show login flow for existing users, signup for new users
        showAuthModal('quest-action');
      } else {
        // Default to signup for other actions
        showAuthModal('signup');
      }
      return;
    }

    // If user is authenticated and onClick is provided, call it
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      className={className}
      onClick={handleClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
});

AuthGuard.displayName = 'AuthGuard';
