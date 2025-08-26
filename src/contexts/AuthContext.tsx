import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  savedEvents?: string[];
  // Profile fields
  gender?: string;
  age?: string;
  city?: string;
  bio?: string;
  personalityType?: string;
  profileComplete?: boolean;
  // Quest counters
  questsJoined?: number;
  questsCreated?: number;
  // Monthly goals
  monthlyQuestsJoinedGoal?: number;
  monthlyQuestsCreatedGoal?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  showAuthModal: (type: 'signup' | 'login' | 'quest-action') => void;
  hideAuthModal: () => void;
  authModalType: 'signup' | 'login' | 'quest-action' | null;
  isAuthModalOpen: boolean;
  saveEvent: (eventId: string) => void;
  unsaveEvent: (eventId: string) => void;
  isEventSaved: (eventId: string) => boolean;
  savedEvents: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalType, setAuthModalType] = useState<'signup' | 'login' | 'quest-action' | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for existing session
        const savedUser = localStorage.getItem('event-buddy-user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - replace with actual Supabase auth
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: { name }
      //   }
      // });

      // For now, create a mock user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('event-buddy-user', JSON.stringify(newUser));
      hideAuthModal();
      
      // Show success message
      console.log('User signed up successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - replace with actual Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password
      // });

      // For now, check if user exists in localStorage
      const savedUser = localStorage.getItem('event-buddy-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.email === email) {
          setUser(userData);
          hideAuthModal();
          console.log('User signed in successfully!');
          return;
        }
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('event-buddy-user');
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Simulate API call - replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .update(profileData)
      //   .eq('id', user.id);

      const updatedUser = {
        ...user,
        ...profileData,
        profileComplete: true
      };
      
      setUser(updatedUser);
      localStorage.setItem('event-buddy-user', JSON.stringify(updatedUser));
      
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveEvent = (eventId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      savedEvents: [...(user.savedEvents || []), eventId]
    };
    
    setUser(updatedUser);
    localStorage.setItem('event-buddy-user', JSON.stringify(updatedUser));
  };

  const unsaveEvent = (eventId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      savedEvents: (user.savedEvents || []).filter(id => id !== eventId)
    };
    
    setUser(updatedUser);
    localStorage.setItem('event-buddy-user', JSON.stringify(updatedUser));
  };

  const isEventSaved = (eventId: string) => {
    if (!user) return false;
    return (user.savedEvents || []).includes(eventId);
  };

  const showAuthModal = (type: 'signup' | 'login' | 'quest-action') => {
    console.log('showAuthModal called with type:', type);
    console.log('Current state - authModalType:', authModalType, 'isAuthModalOpen:', isAuthModalOpen);
    // Always show the combined auth modal regardless of type
    setAuthModalType('signup');
    setIsAuthModalOpen(true);
    console.log('State updated - new authModalType: signup, new isAuthModalOpen: true');
  };

  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalType(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    showAuthModal,
    hideAuthModal,
    authModalType,
    isAuthModalOpen,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    savedEvents: user?.savedEvents || [],
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
