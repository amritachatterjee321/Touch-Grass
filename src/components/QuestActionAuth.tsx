import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Upload, MapPin, Calendar, Heart, FileText, Sparkles } from 'lucide-react';

interface QuestActionAuthProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'create-quest' | 'join-quest' | 'save-event';
}

interface UserSignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  age: string;
  city: string;
  bio: string;
  personalityType: string;
}

const personalityTypes = [
  'Adventurous Explorer',
  'Social Butterfly', 
  'Creative Dreamer'
];

export const QuestActionAuth: React.FC<QuestActionAuthProps> = ({ 
  isOpen, 
  onClose, 
  action 
}) => {
  const { signUp, signIn, isLoading } = useAuth();
  const [flow, setFlow] = useState<'choice' | 'existing-user' | 'new-user'>('choice');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState<UserSignUpData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: '',
    city: '',
    bio: '',
    personalityType: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getActionText = () => {
    switch (action) {
      case 'create-quest':
        return 'Create New Quest';
      case 'join-quest':
        return 'Join Quest';
      case 'save-event':
        return 'Save Event';
      default:
        return 'Continue';
    }
  };

  const handleExistingUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(loginData.email, loginData.password);
      setSuccess('Welcome back! Redirecting...');
      setTimeout(() => {
        onClose();
        // The user can now perform the action
      }, 1500);
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!signupData.name || !signupData.email || !signupData.password || 
        !signupData.gender || !signupData.age || !signupData.city || 
        !signupData.bio || !signupData.personalityType) {
      setError('Please fill in all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(signupData.email, signupData.password, signupData.name);
      setSuccess('Account created successfully! Welcome to the adventure!');
      setIsCompleted(true);
      setTimeout(() => {
        onClose();
        // The user can now perform the action
      }, 3000);
    } catch (error) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UserSignUpData, value: string) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFlow = () => {
    setFlow('choice');
    setError('');
    setSuccess('');
    setLoginData({ email: '', password: '' });
    setSignupData({
      name: '', email: '', password: '', confirmPassword: '',
      gender: '', age: '', city: '', bio: '', personalityType: ''
    });
    setPreviewImage(null);
  };

  // Show completion state
  if (isCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="retro-border bg-[#e6e6fa] border-[#87ceeb] text-[#2d2d2d] max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="mx-auto w-20 h-20 retro-border bg-[#32cd32] p-3 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#ff6347] pixel-perfect">
                ~ ACCOUNT CREATED! ~
              </h2>
              <p className="text-[#4682b4] text-sm pixel-perfect">
                🎉 Welcome to the adventure, Hero! 🎉
              </p>
              <p className="text-[#4682b4] text-xs pixel-perfect">
                You can now {getActionText().toLowerCase()} and start your epic journey!
              </p>
            </div>

            <div className="w-8 h-8 border-4 border-[#87ceeb] border-t-[#32cd32] rounded-full animate-spin mx-auto"></div>
            <p className="text-[#4682b4] text-xs pixel-perfect">
              Redirecting...
            </p>
          </CardContent>
        </DialogContent>
      </Dialog>
    );
  }

  // Show choice between existing user and new user
  if (flow === 'choice') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="retro-border bg-[#e6e6fa] border-[#87ceeb] text-[#2d2d2d] max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="retro-border bg-[#f0f8ff] p-4 mb-6">
            <DialogTitle className="text-[#ff6347] text-center text-lg pixel-perfect">
              ~ {getActionText().toUpperCase()} ~
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 retro-border bg-[#ff6347] p-2 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-4">
              <h3 className="text-[#2d2d2d] text-lg font-bold pixel-perfect">
                Ready to {getActionText()}?
              </h3>
              <p className="text-[#4682b4] text-sm pixel-perfect">
                Choose your path to continue the adventure!
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setFlow('existing-user')}
                className="retro-button w-full h-14 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="pixel-perfect">▶ I'M A RETURNING HERO ◀</span>
              </Button>

              <Button
                onClick={() => setFlow('new-user')}
                variant="ghost"
                className="w-full h-14 text-[#4682b4] hover:text-[#2d2d2d] hover:bg-[#f0f8ff] border-[#87ceeb] hover:border-[#32cd32] transition-all duration-200 text-base font-bold"
              >
                <span className="pixel-perfect">▶ I'M A NEW HERO ◀</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show existing user login form
  if (flow === 'existing-user') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="retro-border bg-[#e6e6fa] border-[#87ceeb] text-[#2d2d2d] max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="retro-border bg-[#f0f8ff] p-4 mb-6">
            <DialogTitle className="text-[#ff6347] text-center text-lg pixel-perfect">
              ~ WELCOME BACK, HERO! ~
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleExistingUserLogin} className="space-y-5">
            {error && (
              <Alert className="retro-border bg-[#f8d7da] border-[#f5c6cb] text-[#721c24]">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs pixel-perfect">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="retro-border bg-[#d4edda] border-[#c3e6cb] text-[#155724]">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-xs pixel-perfect">{success}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="login-email" className="text-[#4682b4] text-xs pixel-perfect">
                <Mail className="inline w-3 h-3 mr-1" />
                Email Address:
              </Label>
              <Input
                id="login-email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                required
              />
            </div>

            <div>
              <Label htmlFor="login-password" className="text-[#4682b4] text-xs pixel-perfect">
                <Lock className="inline w-3 h-3 mr-1" />
                Password:
              </Label>
              <Input
                id="login-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                required
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="retro-button w-full h-14 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#2d2d2d] border-t-transparent rounded-full animate-spin"></div>
                    <span className="pixel-perfect">Signing In...</span>
                  </div>
                ) : (
                  <span className="pixel-perfect">▶ SIGN IN & {getActionText().toUpperCase()} ◀</span>
                )}
              </Button>

              <Button
                type="button"
                onClick={resetFlow}
                variant="ghost"
                className="w-full h-10 text-[#4682b4] hover:text-[#2d2d2d] hover:bg-[#f0f8ff] border-[#87ceeb] hover:border-[#32cd32] transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="pixel-perfect">Back to choices</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Show new user signup form
  if (flow === 'new-user') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="retro-border bg-[#e6e6fa] border-[#87ceeb] text-[#2d2d2d] max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="retro-border bg-[#f0f8ff] p-4 mb-6">
            <DialogTitle className="text-[#ff6347] text-center text-lg pixel-perfect">
              ~ JOIN THE ADVENTURE! ~
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleNewUserSignup} className="space-y-5">
            {error && (
              <Alert className="retro-border bg-[#f8d7da] border-[#f5c6cb] text-[#721c24]">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs pixel-perfect">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="retro-border bg-[#d4edda] border-[#c3e6cb] text-[#155724]">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-xs pixel-perfect">{success}</AlertDescription>
              </Alert>
            )}

            {/* Basic Info Section */}
            <div className="retro-border bg-[#f0f8ff] p-4">
              <h3 className="text-[#4682b4] text-sm font-bold pixel-perfect mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-[#4682b4] text-xs pixel-perfect">Hero Name:</Label>
                  <Input
                    id="name"
                    value={signupData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your heroic name"
                    className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-[#4682b4] text-xs pixel-perfect">Email:</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="password" className="text-[#4682b4] text-xs pixel-perfect">Password:</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password"
                    className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-[#4682b4] text-xs pixel-perfect">Confirm Password:</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="retro-border bg-[#f0f8ff] p-4">
              <h3 className="text-[#4682b4] text-sm font-bold pixel-perfect mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Hero Profile Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender" className="text-[#4682b4] text-xs pixel-perfect">Gender:</Label>
                  <Select value={signupData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm">
                      <SelectValue placeholder="Choose gender" />
                    </SelectTrigger>
                    <SelectContent className="retro-border bg-[#e6e6fa] border-[#87ceeb]">
                      <SelectItem value="male" className="text-[#2d2d2d] hover:bg-[#87ceeb] text-sm">Male</SelectItem>
                      <SelectItem value="female" className="text-[#2d2d2d] hover:bg-[#87ceeb] text-sm">Female</SelectItem>
                      <SelectItem value="non-binary" className="text-[#2d2d2d] hover:bg-[#87ceeb] text-sm">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say" className="text-[#2d2d2d] hover:bg-[#87ceeb] text-sm">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="age" className="text-[#4682b4] text-xs pixel-perfect">Age:</Label>
                  <Input
                    id="age"
                    type="number"
                    value={signupData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Your age"
                    min="13"
                    max="120"
                    className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="city" className="text-[#4682b4] text-xs pixel-perfect flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  City:
                </Label>
                <Input
                  id="city"
                  value={signupData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Your city"
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm"
                  required
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="bio" className="text-[#4682b4] text-xs pixel-perfect flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Hero Bio:
                </Label>
                <Textarea
                  id="bio"
                  value={signupData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about your heroic adventures and interests..."
                  rows={3}
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 text-sm"
                  required
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="personalityType" className="text-[#4682b4] text-xs pixel-perfect flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  Personality Type:
                </Label>
                <Select value={signupData.personalityType} onValueChange={(value) => handleInputChange('personalityType', value)}>
                  <SelectTrigger className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm">
                    <SelectValue placeholder="Choose your personality" />
                  </SelectTrigger>
                  <SelectContent className="retro-border bg-[#e6e6fa] border-[#87ceeb]">
                    {personalityTypes.map(type => (
                      <SelectItem key={type} value={type} className="text-[#2d2d2d] hover:bg-[#87ceeb] text-sm">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <Label htmlFor="avatar" className="text-[#4682b4] text-xs pixel-perfect flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  Hero Portrait (Optional):
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="retro-border bg-[#ffffff] text-[#2d2d2d] border-[#87ceeb] mt-2 h-12 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#98fb98] file:text-[#2d2d2d] hover:file:bg-[#90ee90]"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg retro-border border-[#87ceeb]"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="retro-button w-full h-14 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#2d2d2d] border-t-transparent rounded-full animate-spin"></div>
                    <span className="pixel-perfect">Creating Account...</span>
                  </div>
                ) : (
                  <span className="pixel-perfect">▶ CREATE ACCOUNT & {getActionText().toUpperCase()} ◀</span>
                )}
              </Button>

              <Button
                type="button"
                onClick={resetFlow}
                variant="ghost"
                className="w-full h-10 text-[#4682b4] hover:text-[#2d2d2d] hover:bg-[#f0f8ff] border-[#87ceeb] hover:border-[#32cd32] transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="pixel-perfect">Back to choices</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};
