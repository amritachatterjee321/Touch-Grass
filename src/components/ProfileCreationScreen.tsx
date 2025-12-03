import { useState, useRef } from "react"
import { Camera, ArrowRight, ArrowLeft, User, MapPin, Calendar, Users, FileText, Sparkles, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { toast } from "sonner@2.0.3"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface ProfileCreationScreenProps {
  onProfileComplete: (profileData: ProfileData) => void
  onExit: () => void
  existingProfile?: ProfileData | null
  isEditMode?: boolean
}

interface ProfileData {
  username: string
  age: string
  city: string
  gender: string
  interests: string[]
  bio: string
  profileImage: string | null
  personalityType: string
}

const eventCategories = [
  "Board Games", "Video Games", "Sports", "Outdoor Adventures", "Food & Drinks",
  "Arts & Crafts", "Music & Concerts", "Movies & TV", "Books & Reading", "Tech & Coding",
  "Fitness & Wellness", "Travel & Exploration", "Photography", "Dancing", "Comedy & Entertainment"
]

const personalityTypes = [
  {
    id: "introvert",
    title: "Introvert",
    subtitle: "Borderline Autistic",
    description: "Prefers small groups, thoughtful conversations, and meaningful connections",
    icon: "🧠",
    color: "neon-purple"
  },
  {
    id: "extrovert",
    title: "Extrovert", 
    subtitle: "Can Talk to a Wall and Make it Fun",
    description: "Loves big groups, spontaneous quests, and making everyone laugh",
    icon: "🎭",
    color: "neon-orange"
  },
  {
    id: "mysterious",
    title: "Mysterious",
    subtitle: "Personality Synced with Mercury Retrogrades",
    description: "Unpredictable, deep thinker, probably knows your star sign better than you",
    icon: "🌙",
    color: "neon-cyan"
  }
]

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"]

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Goa',
  'Kochi', 'Chandigarh', 'Indore', 'Nagpur', 'Coimbatore',
  'Lucknow', 'Kanpur', 'Visakhapatnam', 'Bhopal', 'Patna',
  'Vadodara', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi'
]

export function ProfileCreationScreen({ onProfileComplete, onExit, existingProfile, isEditMode = false }: ProfileCreationScreenProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileImage, setProfileImage] = useState<string | null>(existingProfile?.profileImage || null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(existingProfile?.interests || [])
  const [formData, setFormData] = useState({
    username: existingProfile?.username || "",
    age: existingProfile?.age || "",
    city: existingProfile?.city || "",
    gender: existingProfile?.gender || "",
    bio: existingProfile?.bio || "",
    personalityType: existingProfile?.personalityType || ""
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 4

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Disabled until Firebase Storage is enabled
      toast.info("Custom profile images disabled", {
        description: "Using your Google profile photo. Enable Firebase Storage to upload custom images."
      })
      return
      
      // Original code (will work once Storage is enabled):
      // if (file.size > 5 * 1024 * 1024) {
      //   toast.error("Image size should be less than 5MB")
      //   return
      // }
      // const reader = new FileReader()
      // reader.onload = (e) => {
      //   setProfileImage(e.target?.result as string)
      // }
      // reader.readAsDataURL(file)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest)
      } else if (prev.length < 5) {
        return [...prev, interest]
      } else {
        toast.error("You can select up to 5 interests")
        return prev
      }
    })
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.username.trim()) {
          toast.error("Username is required")
          return false
        }
        if (formData.username.length < 3) {
          toast.error("Username must be at least 3 characters")
          return false
        }
        if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 100) {
          toast.error("Please enter a valid age (13-100)")
          return false
        }
        if (!formData.city.trim()) {
          toast.error("City is required")
          return false
        }
        if (!formData.gender) {
          toast.error("Please select your gender")
          return false
        }
        break
      case 2:
        if (selectedInterests.length === 0) {
          toast.error("Please select at least one interest")
          return false
        }
        break
      case 3:
        if (!formData.bio.trim()) {
          toast.error("Bio is required")
          return false
        }
        if (formData.bio.length < 20) {
          toast.error("Bio should be at least 20 characters")
          return false
        }
        break
      case 4:
        if (!formData.personalityType) {
          toast.error("Please select your personality type")
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1)
      } else {
        handleComplete()
      }
    }
  }

  const handleComplete = () => {
    const profileData: ProfileData = {
      ...formData,
      interests: selectedInterests,
      profileImage
    }
    toast.success(isEditMode ? "Profile updated successfully! 🎉" : "Profile created successfully! Welcome to TouchGrass! 🎮", {
      description: isEditMode ? "Your changes have been saved" : "Time to start your first quest!"
    })
    onProfileComplete(profileData)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Let's Get You Started</h2>
              <p className="text-muted-foreground">Tell us about yourself, quest seeker!</p>
            </div>

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-neon-cyan bg-input-background flex items-center justify-center overflow-hidden hover:border-neon-purple transition-colors cursor-pointer"
                >
                  {profileImage ? (
                    <ImageWithFallback 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                    </div>
                  )}
                </button>
              </div>

            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neon-cyan" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Choose your quest name"
                  className="mt-1"
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    e.currentTarget.focus()
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                    e.currentTarget.focus()
                  }}
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neon-green" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    min="13"
                    max="100"
                    className="mt-1"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      e.currentTarget.focus()
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation()
                      e.currentTarget.focus()
                    }}
                    style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neon-orange" />
                    City
                  </Label>
                  <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger 
                      className="mt-1"
                      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                    >
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60" style={{ zIndex: 9999 }}>
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          🏙️ {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neon-purple" />
                  Gender
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger 
                    className="mt-1"
                    style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                  >
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 9999 }}>
                    {genderOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">What Quests Call to You?</h2>
              <p className="text-muted-foreground">Select up to 5 interests (you can change these later)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {eventCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleInterestToggle(category)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedInterests.includes(category)
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white border-neon-cyan shadow-lg'
                      : 'bg-input-background border-border text-foreground hover:border-neon-cyan hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Selected: {selectedInterests.length}/5
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tell Your Story</h2>
              <p className="text-muted-foreground">Let other quest seekers know what makes you unique!</p>
            </div>

            <div>
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neon-pink" />
                Your Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself, your interests, what kind of quests you're looking for, or anything else you'd like fellow quest seekers to know! Be creative - this is your chance to shine! ✨"
                rows={6}
                className="mt-1 resize-none"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.currentTarget.focus()
                }}
                onTouchStart={(e) => {
                  e.stopPropagation()
                  e.currentTarget.focus()
                }}
                style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Minimum 20 characters
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/500
                </p>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">What's Your Vibe?</h2>
              <p className="text-muted-foreground">Choose your social quest style</p>
            </div>

            <RadioGroup 
              value={formData.personalityType} 
              onValueChange={(value) => handleInputChange('personalityType', value)}
              className="space-y-4"
            >
              {personalityTypes.map((type) => (
                <div key={type.id} className="relative">
                  <Label 
                    htmlFor={type.id} 
                    className={`hud-card p-4 cursor-pointer transition-all block ${
                      formData.personalityType === type.id 
                        ? 'border-neon-cyan shadow-lg ring-2 ring-neon-cyan/20' 
                        : 'hover:border-neon-cyan/50'
                    }`}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{type.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-foreground">{type.title}</h3>
                          <Sparkles className={`w-4 h-4 text-${type.color}`} />
                        </div>
                        <p className={`text-sm font-medium text-${type.color} mb-2`}>
                          {type.subtitle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Progress Header */}
        <div className="gaming-panel p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold gradient-text">{isEditMode ? 'Edit Profile' : 'Create Profile'}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <button
                onClick={onExit}
                className="w-8 h-8 rounded-full bg-input-background border border-border hover:border-neon-cyan transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-neon-cyan transition-colors" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="gaming-progress h-2">
            <div 
              className="gaming-progress-fill transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="gaming-panel p-6 mb-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-2 flex-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            className="neon-button flex items-center gap-2 flex-1"
          >
            {currentStep < totalSteps ? (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                {isEditMode ? 'Save Changes' : 'Complete Profile'}
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>


      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}