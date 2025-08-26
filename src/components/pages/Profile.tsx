import React, { useState } from 'react';
import { User, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Profile: React.FC = () => {
  const { user, showAuthModal } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    city: user?.city || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
    personalityType: user?.personalityType || ''
  });

  const handleSave = () => {
    // In a real app, you would save this to your backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      age: user?.age || '',
      city: user?.city || '',
      bio: user?.bio || '',
      gender: user?.gender || '',
      personalityType: user?.personalityType || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-[#4682b4] pixel-perfect">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[#ff6347] text-xl sm:text-2xl mb-2 pixel-perfect">
          ~ HERO PROFILE ~
        </h2>
        <p className="text-[#4682b4] text-sm pixel-perfect">
          Manage your adventure companion profile
        </p>
      </div>

      <div className="retro-border bg-[#f0f8ff] border-[#87ceeb] p-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-[#87ceeb] text-[#2d2d2d] text-lg font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'H'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-[#2d2d2d] text-lg font-semibold pixel-perfect">
                {user.name || 'Hero'}
              </h3>
              <p className="text-[#4682b4] text-sm pixel-perfect">
                Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="retro-button p-2 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90]"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#4682b4] text-sm pixel-perfect">Hero Name</Label>
            {isEditing ? (
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="retro-border bg-white border-[#87ceeb] mt-1"
              />
            ) : (
              <p className="text-[#2d2d2d] mt-1 pixel-perfect">{user.name || 'Not set'}</p>
            )}
          </div>

          <div>
            <Label className="text-[#4682b4] text-sm pixel-perfect">Age</Label>
            {isEditing ? (
              <Input
                type="number"
                value={profileData.age}
                onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                className="retro-border bg-white border-[#87ceeb] mt-1"
              />
            ) : (
              <p className="text-[#2d2d2d] mt-1 pixel-perfect">{user.age || 'Not set'}</p>
            )}
          </div>

          <div>
            <Label className="text-[#4682b4] text-sm pixel-perfect">City</Label>
            {isEditing ? (
              <Input
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                className="retro-border bg-white border-[#87ceeb] mt-1"
              />
            ) : (
              <p className="text-[#2d2d2d] mt-1 pixel-perfect">{user.city || 'Not set'}</p>
            )}
          </div>

          <div>
            <Label className="text-[#4682b4] text-sm pixel-perfect">Gender</Label>
            {isEditing ? (
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                className="retro-border bg-white border-[#87ceeb] mt-1 w-full p-2"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-[#2d2d2d] mt-1 pixel-perfect">{user.gender || 'Not set'}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label className="text-[#4682b4] text-sm pixel-perfect">Personality Type</Label>
            {isEditing ? (
              <select
                value={profileData.personalityType}
                onChange={(e) => setProfileData({ ...profileData, personalityType: e.target.value })}
                className="retro-border bg-white border-[#87ceeb] mt-1 w-full p-2"
              >
                <option value="">Select personality type</option>
                <option value="Introvert/Borderline Autistic">Introvert/Borderline Autistic</option>
                <option value="Extrovert/Can talk to a wall and make it fun">Extrovert/Can talk to a wall and make it fun</option>
                <option value="Mysterious Enigma/Personality synced with mercury retrogrades">Mysterious Enigma/Personality synced with mercury retrogrades</option>
              </select>
            ) : (
              <p className="text-[#2d2d2d] mt-1 pixel-perfect">{user.personalityType || 'Not set'}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label className="text-[#4682b4] text-sm pixel-perfect">Bio</Label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={3}
                className="retro-border bg-white border-[#87ceeb] mt-1 w-full p-2 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-[#2d2d2d] mt-1 pixel-perfect">{user.bio || 'No bio yet'}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSave}
              className="retro-button px-4 py-2 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90]"
            >
              <Save className="h-4 w-4 mr-2" />
              <span className="pixel-perfect">SAVE CHANGES</span>
            </Button>
            <Button
              onClick={handleCancel}
              className="retro-button px-4 py-2 text-[#2d2d2d] bg-[#ffe6e6] border-[#ff6347] hover:bg-[#ffd6d6]"
            >
              <X className="h-4 w-4 mr-2" />
              <span className="pixel-perfect">CANCEL</span>
            </Button>
          </div>
        )}
      </div>

      {/* Profile Completion Status */}
      <div className="retro-border bg-[#fff3cd] border-[#ffc107] p-4">
        <h4 className="text-[#856404] text-sm font-semibold mb-2 pixel-perfect">Profile Completion</h4>
        <div className="w-full bg-[#ffeaa7] rounded-full h-2 mb-2">
          <div 
            className="bg-[#fdcb6e] h-2 rounded-full transition-all duration-300"
            style={{ width: `${user.profileComplete ? 100 : 60}%` }}
          ></div>
        </div>
        <p className="text-[#856404] text-xs pixel-perfect">
          {user.profileComplete ? 'Profile complete!' : 'Complete your profile for better quest matching'}
        </p>
      </div>
    </div>
  );
};

