import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, User, AlertCircle, Calendar, MapPin, Upload, Image as ImageIcon, CheckCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    hideAuthModal, 
    signUp, 
    isLoading
  } = useAuth();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Profile form states
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    city: '',
    bio: '',
    gender: '',
    personalityType: '',
    profileImage: null as File | null
  });

  // Reset states when modal opens/closes
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setError('');
      setSuccess('');
      setShowProfileForm(false);
      setProfileData({ name: '', age: '', city: '', bio: '', gender: '', personalityType: '', profileImage: null });
    }
  }, [isAuthModalOpen]);

  const handleGoogleAuth = async () => {
    try {
      setError('');
      setSuccess('');
      
      // Simulate Google OAuth - replace with actual Google OAuth implementation
      console.log('Google OAuth initiated');
      setSuccess('Authenticating with Google...');
      
      // Simulate OAuth flow delay
      setTimeout(() => {
        // Check if user exists (simulate API call)
        const existingUser = localStorage.getItem('event-buddy-user');
        
        if (existingUser) {
          // Existing user - sign them in
          setSuccess('Welcome back! Signing you in...');
          
          setTimeout(() => {
            // Simulate successful sign in
            hideAuthModal();
          }, 1500);
        } else {
          // New user - show profile form
          setShowProfileForm(true);
          setSuccess('Welcome! Let\'s set up your profile.');
        }
      }, 2000);
      
    } catch (error) {
      setError('Google authentication failed. Please try again.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      setProfileData({ ...profileData, profileImage: file });
      setError(''); // Clear any previous errors
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!profileData.name || !profileData.age || !profileData.city || !profileData.gender || !profileData.personalityType) {
      setError('Please fill in all required fields (Name, Age, City, Gender, Personality Type)');
      return;
    }

    try {
      // Create new user with Google OAuth data + profile info
      const newUser = {
        id: Date.now().toString(),
        email: 'user@gmail.com', // This would come from Google OAuth
        name: profileData.name,
        age: profileData.age,
        city: profileData.city,
        bio: profileData.bio,
        gender: profileData.gender,
        personalityType: profileData.personalityType,
        createdAt: new Date(),
        profileComplete: true
      };

      // Simulate API call to create user
      await signUp(newUser.email, 'google-oauth-password', newUser.name);
      
      setSuccess('Profile created successfully! Welcome to Event Buddy!');
      
      setTimeout(() => {
        hideAuthModal();
      }, 2000);
      
    } catch (error) {
      setError('Failed to create profile. Please try again.');
    }
  };

  // Show profile form for new Google OAuth users
  if (showProfileForm) {
    return (
      <Dialog open={isAuthModalOpen} onOpenChange={hideAuthModal}>
        <DialogContent className="retro-border bg-[#e6e6fa] border-[#87ceeb] text-[#2d2d2d] max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="retro-border bg-[#f0f8ff] p-3 sm:p-4 mb-4 sm:mb-6">
            <DialogTitle className="text-[#ff6347] text-center text-base sm:text-lg pixel-perfect">
              ~ COMPLETE YOUR HERO PROFILE ~
            </DialogTitle>
            <DialogDescription className="text-[#4682b4] text-xs sm:text-sm pixel-perfect text-center mt-2">
              Tell us about yourself to find the perfect quest companions!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <Alert className="retro-border border-[#ff6347] bg-[#ffe6e6] mb-4">
                <AlertCircle className="h-4 w-4 text-[#ff6347]" />
                <AlertDescription className="text-[#ff6347] text-xs sm:text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#4682b4] text-xs sm:text-sm pixel-perfect flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Hero Name: *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12 text-sm leading-relaxed"
                  required
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-[#4682b4] text-xs sm:text-sm pixel-perfect flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Age: *
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12 text-sm leading-relaxed"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-[#4682b4] text-xs sm:text-sm pixel-perfect flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  City: *
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12 text-sm leading-relaxed"
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender" className="text-[#4682b4] text-xs sm:text-sm pixel-perfect flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Gender: *
                </Label>
                <select
                  id="gender"
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-10 sm:h-12 text-sm leading-relaxed w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#32cd32] focus:border-[#32cd32]"
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <Label htmlFor="personalityType" className="text-[#4682b4] text-xs sm:text-sm pixel-perfect flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Personality Type: *
                </Label>
                <div className="mt-2 space-y-2">
                  {[
                    'Introvert/Borderline Autistic',
                    'Extrovert/Can talk to a wall and make it fun',
                    'Mysterious Enigma/Personality synced with mercury retrogrades'
                  ].map((option) => (
                    <label key={option} className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="personalityType"
                        value={option}
                        checked={profileData.personalityType === option}
                        onChange={(e) => setProfileData({ ...profileData, personalityType: e.target.value })}
                        className="w-4 h-4 text-[#32cd32] border-[#87ceeb] focus:ring-[#32cd32] mt-0.5 flex-shrink-0"
                        required
                      />
                      <span className="text-[#2d2d2d] text-xs sm:text-sm leading-relaxed">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-[#4682b4] text-xs sm:text-sm pixel-perfect flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Bio:
                </Label>
                <textarea
                  id="bio"
                  placeholder="I put the 'pro' in procrastination and the 'mess' in domestic"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-16 sm:h-20 p-2 sm:p-3 text-sm resize-none w-full leading-relaxed placeholder:text-xs placeholder:text-[#999999]"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="profileImage" className="text-[#4682b4] text-xs pixel-perfect flex items-center gap-2">
                  <ImageIcon className="h-3 w-3" />
                  Profile Image:
                </Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="flex items-center justify-center w-full h-10 sm:h-12 px-3 sm:px-4 border-2 border-dashed border-[#87ceeb] rounded-lg cursor-pointer hover:border-[#32cd32] transition-colors"
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4682b4]" />
                    <span className="text-[#4682b4] text-xs sm:text-sm pixel-perfect text-center">
                      {profileData.profileImage ? profileData.profileImage.name : 'Upload your hero portrait (optional)'}
                    </span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="retro-button w-full h-12 sm:h-14 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                ) : (
                  <span className="pixel-perfect">▶ COMPLETE PROFILE ◀</span>
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Google OAuth modal
  return (
    <Dialog open={isAuthModalOpen} onOpenChange={hideAuthModal}>
      <DialogContent className="retro-border bg-[#e6e6fa] border-[#87ceeb] text-[#2d2d2d] max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Google Authentication */}
          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="retro-button w-full h-12 sm:h-16 text-[#2d2d2d] bg-[#4285f4] border-[#1a73e8] hover:bg-[#3367d6] transition-all duration-200 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
              ) : (
                <span className="pixel-perfect">SIGN IN WITH GOOGLE</span>
              )}
            </Button>
          </div>

          {/* Error Messages */}
          {error && (
            <Alert className="retro-border border-[#ff6347] bg-[#ffe6e6]">
              <AlertCircle className="h-4 w-4 text-[#ff6347]" />
              <AlertDescription className="text-[#ff6347] text-xs sm:text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="retro-border border-[#32cd32] bg-[#e6ffe6]">
              <CheckCircle className="h-4 w-4 text-[#32cd32]" />
              <AlertDescription className="text-[#32cd32] text-xs sm:text-sm">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
