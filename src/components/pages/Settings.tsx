import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    language: 'en',
    privacyLevel: 'friends'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSignOut = () => {
    signOut();
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-[#4682b4] pixel-perfect">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-[#ff6347] text-xl sm:text-2xl mb-2 pixel-perfect">
          ~ ADVENTURE SETTINGS ~
        </h2>
        <p className="text-[#4682b4] text-sm pixel-perfect">
          Customize your quest companion experience
        </p>
      </div>

      {/* Notifications Settings */}
      <div className="retro-border bg-[#f0f8ff] border-[#87ceeb] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-[#4682b4]" />
          <h3 className="text-[#4682b4] text-lg font-semibold pixel-perfect">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#2d2d2d] text-sm font-semibold pixel-perfect">Push Notifications</Label>
              <p className="text-[#666666] text-xs pixel-perfect">Get notified about new quests and messages</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#2d2d2d] text-sm font-semibold pixel-perfect">Email Updates</Label>
              <p className="text-[#666666] text-xs pixel-perfect">Receive weekly quest summaries</p>
            </div>
            <Switch
              checked={settings.emailUpdates}
              onCheckedChange={(checked) => handleSettingChange('emailUpdates', checked)}
            />
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="retro-border bg-[#f0f8ff] border-[#87ceeb] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-5 w-5 text-[#4682b4]" />
          <h3 className="text-[#4682b4] text-lg font-semibold pixel-perfect">Appearance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#2d2d2d] text-sm font-semibold pixel-perfect">Dark Mode</Label>
              <p className="text-[#666666] text-xs pixel-perfect">Switch to dark theme</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
          
          <div>
            <Label className="text-[#2d2d2d] text-sm font-semibold pixel-perfect">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange('language', value)}
            >
              <SelectTrigger className="retro-border bg-white border-[#87ceeb] mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="retro-border bg-[#e6e6fa] border-[#87ceeb]">
                <SelectItem value="en" className="text-[#2d2d2d] hover:bg-[#87ceeb]">English</SelectItem>
                <SelectItem value="es" className="text-[#2d2d2d] hover:bg-[#87ceeb]">Español</SelectItem>
                <SelectItem value="fr" className="text-[#2d2d2d] hover:bg-[#87ceeb]">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="retro-border bg-[#f0f8ff] border-[#87ceeb] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-[#4682b4]" />
          <h3 className="text-[#4682b4] text-lg font-semibold pixel-perfect">Privacy</h3>
        </div>
        
        <div>
          <Label className="text-[#2d2d2d] text-sm font-semibold pixel-perfect">Profile Visibility</Label>
          <Select
            value={settings.privacyLevel}
            onValueChange={(value) => handleSettingChange('privacyLevel', value)}
          >
            <SelectTrigger className="retro-border bg-white border-[#87ceeb] mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="retro-border bg-[#e6e6fa] border-[#87ceeb]">
              <SelectItem value="public" className="text-[#2d2d2d] hover:bg-[#87ceeb]">Public - Everyone can see my profile</SelectItem>
              <SelectItem value="friends" className="text-[#2d2d2d] hover:bg-[#87ceeb]">Friends Only - Only quest companions can see</SelectItem>
              <SelectItem value="private" className="text-[#2d2d2d] hover:bg-[#87ceeb]">Private - Only I can see my profile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Account Actions */}
      <div className="retro-border bg-[#fff3cd] border-[#ffc107] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-[#856404]" />
          <h3 className="text-[#856404] text-lg font-semibold pixel-perfect">Account</h3>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={handleSignOut}
            className="retro-button w-full px-4 py-2 text-[#2d2d2d] bg-[#ffe6e6] border-[#ff6347] hover:bg-[#ffd6d6]"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="pixel-perfect">SIGN OUT</span>
          </Button>
          
          <div className="text-center">
            <p className="text-[#856404] text-xs pixel-perfect">
              Signed in as: {user.email || user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="text-center">
        <Button
          onClick={() => console.log('Saving settings:', settings)}
          className="retro-button px-6 py-3 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90]"
        >
          <SettingsIcon className="h-4 w-4 mr-2" />
          <span className="pixel-perfect">SAVE SETTINGS</span>
        </Button>
      </div>
    </div>
  );
};
