import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { MapPin, Clock, DollarSign, Sparkles, Zap, Trash2, ArrowLeft, Camera, Link, X, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from "sonner"
import { deleteQuest, createQuest, updateQuest } from "../firebase/quests"

const categories = ['Social', 'Adventure', 'Learning', 'Creative']

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Goa',
  'Kochi', 'Chandigarh', 'Indore', 'Nagpur', 'Coimbatore',
  'Lucknow', 'Kanpur', 'Visakhapatnam', 'Bhopal', 'Patna',
  'Vadodara', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi'
]

const funPlaceholders = {
  title: [
    "Hidden Coffee Gems Discovery Mission ☕",
    "Third Wave Coffee Crawl Adventure",
    "Specialty Brew Tasting Quest",
    "Rooftop Coffee & Sunrise Views",
    "Local Roastery Exploration Trail",
    "Midnight Trekking Adventure 🌙", 
    "Board Game Battle Royale 🎲",
    "Street Art Discovery Walk 🎨",
    "Filter Coffee vs Espresso Showdown",
    "Weekend Coffee Shop Hopping",
    "Artisan Coffee & Pastry Hunt",
    "Cold Brew & Conversations"
  ],
  description: [
    "Let's explore the city's best-kept coffee secrets! From hole-in-the-wall roasters to trendy third-wave cafes, we'll taste our way through the local coffee scene.",
    "Calling all coffee enthusiasts! Join me on a quest to discover hidden gems where passionate baristas craft the perfect cup. We'll chat with locals, try unique brewing methods, and maybe find your new favorite spot.",
    "Time to ditch the usual Starbucks and discover what real coffee tastes like! We'll visit 3-4 specialty coffee shops, learn about different beans, and rate each spot's vibe and brew quality.",
    "Let's touch grass and make some memories! Who's ready for an epic adventure?",
    "Warning: May cause excessive caffeine intake and new friendships! We'll spend the day exploring neighborhood coffee culture and supporting local businesses.",
    "Ready to become coffee connoisseurs together? We'll visit places only locals know about - from rooftop cafes with city views to cozy basement spots with board games.",
    "Escape the digital world and join the real-life quest!",
    "Calling all adventurers for some IRL coffee exploration! We'll discover places with the best flat whites, unique single origins, and maybe some killer homemade cookies too."
  ],
  area: [
    "Koramangala 5th Block, Near Sony Signal",
    "Indiranagar 100 Feet Road, CMH Area", 
    "Jayanagar 4th Block, Near Ragigudda Temple",
    "HSR Layout Sector 7, BDA Complex",
    "Whitefield Main Road, Near Forum Mall",
    "Malleswaram 8th Cross, Sampige Road",
    "Commercial Street, Near Brigade Road",
    "Rajajinagar 2nd Block, Near Metro Station",
    "Banashankari 3rd Stage, ISKCON Temple Road",
    "JP Nagar 7th Phase, Near Total Mall"
  ],
  cost: [
    "₹300-400 per person (covers 3-4 coffee tastings)",
    "₹200-250 (coffee + light snacks at each spot)",
    "₹150-200 per cafe (we'll split transport)",
    "₹500 all-inclusive (premium coffee experience)",
    "₹100-150 per person + own transport",
    "FREE (just buy your own coffee at each place!)",
    "₹250 covers coffee + pastries + auto rickshaw",
    "₹350 (includes specialty pour-overs & desserts)"
  ]
}

interface QuestCreationScreenProps {
  questToEdit?: any
  onQuestSaved?: (questData: any) => void
  onDiscard?: () => void
  onClose?: () => void
  user?: any
}

export function QuestCreationScreen({ questToEdit, onQuestSaved, onDiscard, onClose, user }: QuestCreationScreenProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    area: '',
    date: '',
    time: '',
    cost: '',
    externalLinks: ['']
  })
  
  const [questImage, setQuestImage] = useState<string | null>(null)

  const isEditMode = !!questToEdit

  // Pre-populate form when editing
  useEffect(() => {
    if (questToEdit) {
      setFormData({
        title: questToEdit.title || '',
        description: questToEdit.description || '',
        category: questToEdit.category || '',
        city: questToEdit.city || '',
        area: questToEdit.location || '',
        date: questToEdit.date || '',
        time: questToEdit.time || '',
        cost: questToEdit.cost || '',
        externalLinks: questToEdit.externalLinks || ['']
      })
      setQuestImage(questToEdit.image || null)
    }
  }, [questToEdit])

  const getRandomPlaceholder = (field: keyof typeof funPlaceholders) => {
    const options = funPlaceholders[field]
    return options[Math.floor(Math.random() * options.length)]
  }

  const compressImage = (file: File, maxWidth: number = 1200, maxHeight: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target?.result as string
        
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress image
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            
            // Convert to compressed base64
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
            resolve(compressedDataUrl)
          } else {
            reject(new Error('Failed to get canvas context'))
          }
        }
        
        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size must be less than 10MB")
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file")
        return
      }

      try {
        // Compress the image silently
        const compressedImage = await compressImage(file, 1200, 800, 0.8)
        
        setQuestImage(compressedImage)
        
        // Simple success message
        toast.success("Image uploaded successfully! 📸")
      } catch (error) {
        console.error('Error compressing image:', error)
        toast.error("Failed to upload image. Please try another image.")
      }
    }
  }

  const removeImage = () => {
    setQuestImage(null)
    const fileInput = document.getElementById('quest-image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const addExternalLink = () => {
    if (formData.externalLinks.length < 3) {
      setFormData({
        ...formData,
        externalLinks: [...formData.externalLinks, '']
      })
    }
  }

  const removeExternalLink = (index: number) => {
    const newLinks = formData.externalLinks.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      externalLinks: newLinks.length === 0 ? [''] : newLinks
    })
  }

  const updateExternalLink = (index: number, value: string) => {
    const newLinks = [...formData.externalLinks]
    newLinks[index] = value
    setFormData({
      ...formData,
      externalLinks: newLinks
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Please log in to create or update quests")
      return
    }

    try {
      if (isEditMode) {
        // Update existing quest
        console.log('🔄 Updating quest in Firebase:', questToEdit.id, formData)
        
        const questUpdateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.area,
          city: formData.city,
          date: formData.date,
          time: formData.time,
          cost: formData.cost || 'Free',
          image: questImage || undefined,
          externalLinks: formData.externalLinks.filter(link => link.trim() !== '')
        }
        
        await updateQuest(questToEdit.id, questUpdateData)
        console.log('✅ Quest updated successfully in Firebase')
        toast.success("Quest updated successfully! 🎉")
        onQuestSaved?.(questUpdateData)
      } else {
        // Create new quest
        console.log('🚀 Creating new quest in Firebase:', formData)
        
        const questCreateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.area,
          city: formData.city,
          date: formData.date,
          time: formData.time,
          cost: formData.cost || 'Free',
          difficulty: 'Beginner',
          organizerUid: user.uid,
          organizerName: user.displayName || 'Anonymous',
          isEpic: true,
          image: questImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjB0cmVra2luZ3xlbnwwfHx8fDE3NTY0Njg0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          externalLinks: formData.externalLinks.filter(link => link.trim() !== '')
        }
        
        const result = await createQuest(questCreateData)
        console.log('✅ Quest created successfully in Firebase:', result)
        toast.success("Epic quest launched! 🚀")
        onQuestSaved?.(questCreateData)
      }
      
      onClose?.()
    } catch (error: any) {
      console.error('❌ Error saving quest:', error)
      toast.error(error.message || "Failed to save quest")
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this quest? This action cannot be undone.')) {
      if (questToEdit?.id) {
        try {
          console.log('🗑️ Deleting quest from Firebase:', questToEdit.id)
          await deleteQuest(questToEdit.id)
          console.log('✅ Quest deleted successfully from Firebase')
          toast.success("Quest deleted successfully")
          onQuestSaved?.(null) // Pass null to indicate deletion
        } catch (error: any) {
          console.error('❌ Error deleting quest:', error)
          toast.error(error.message || "Failed to delete quest")
        }
      } else {
        toast.error("Quest ID not found")
      }
    }
  }

  const handleDiscard = () => {
    // Check if form has any data
    const hasFormData = formData.title || formData.description || formData.category || 
                       formData.city || formData.area || formData.date || formData.time || 
                       formData.cost || questImage || formData.externalLinks.some(link => link.trim())

    if (hasFormData) {
      if (window.confirm('Are you sure you want to discard your changes? All unsaved changes will be lost.')) {
        onDiscard?.()
      }
    } else {
      onDiscard?.()
    }
  }

  const isFormValid = () => {
    return formData.title && formData.description && formData.category && 
           formData.city && formData.area && formData.date && formData.time
  }

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="hud-card m-4 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10" />
          
          {/* Back Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2 rounded-full hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {isEditMode ? 'EDIT YOUR QUEST' : 'CREATE YOUR OWN QUEST'}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Update your adventure details!' : 'Fill out the deets and let\'s get this adventure started!'}
            </p>
          </div>
        </div>

        <div className="px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quest Basics */}
          <div className="hud-card p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                inputMode="text"
                placeholder={!isEditMode ? getRandomPlaceholder('title') : ''}
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation()
                  setFormData({...formData, title: e.target.value})
                }}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-4 rounded-lg border border-border bg-white text-black placeholder-gray-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all mobile-form-input"
                style={{ fontSize: '16px' }}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Tell us more about the adventure! *
              </label>
              <textarea
                placeholder={!isEditMode ? getRandomPlaceholder('description') : ''}
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  e.stopPropagation()
                  setFormData({...formData, description: e.target.value})
                }}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-4 rounded-lg border border-border bg-white text-black placeholder-gray-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all min-h-[100px] resize-none mobile-form-input"
                style={{ fontSize: '16px' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Pick your quest type *
              </label>
              <Select value={formData.category} onValueChange={(value: string) => setFormData({...formData, category: value})}>
                <SelectTrigger className="w-full p-4 rounded-lg border border-border bg-input-background text-foreground focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all">
                  <SelectValue placeholder="Choose your adventure type..." />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-lg shadow-lg">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer"
                    >
                      <span className="text-lg">
                        {category === 'Social' && '👥'}
                        {category === 'Adventure' && '🗺️'}
                        {category === 'Learning' && '📚'}
                        {category === 'Creative' && '🎨'}
                      </span>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location & Time */}
          <div className="hud-card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-neon-red" />
              <h2 className="text-lg font-bold text-foreground">When & Where</h2>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                City *
              </label>
              <Select value={formData.city} onValueChange={(value: string) => setFormData({...formData, city: value})}>
                <SelectTrigger className="w-full p-4 rounded-lg border border-border bg-input-background text-foreground focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all">
                  <SelectValue placeholder="Select your city..." />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-lg shadow-lg max-h-60">
                  {cities.map((city) => (
                    <SelectItem 
                      key={city} 
                      value={city}
                      className="flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer"
                    >
                      🏙️ {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Area/Location *
              </label>
              <input
                type="text"
                inputMode="text"
                placeholder={!isEditMode ? getRandomPlaceholder('area') : ''}
                value={formData.area}
                onChange={(e) => {
                  e.stopPropagation()
                  setFormData({...formData, area: e.target.value})
                }}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-4 rounded-lg border border-border bg-white text-black placeholder-gray-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all mobile-form-input"
                style={{ fontSize: '16px' }}
                required
                disabled={!formData.city}
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 Be specific! Include landmarks, metro stations, or popular spots
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    e.stopPropagation()
                    setFormData({...formData, date: e.target.value})
                  }}
                  onFocus={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full p-4 rounded-lg border border-border bg-input-background text-foreground focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neon-purple" />
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => {
                    e.stopPropagation()
                    setFormData({...formData, time: e.target.value})
                  }}
                  onFocus={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full p-4 rounded-lg border border-border bg-input-background text-foreground focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cost Details */}
          <div className="hud-card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-neon-green" />
              <h2 className="text-lg font-bold text-foreground">Cost Details</h2>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Cost per person (optional)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={!isEditMode ? getRandomPlaceholder('cost') : ''}
                value={formData.cost}
                onChange={(e) => {
                  e.stopPropagation()
                  setFormData({...formData, cost: e.target.value})
                }}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-4 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all mobile-form-input"
                style={{ fontSize: '16px' }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 Type "FREE" if there's no cost!
              </p>
            </div>
          </div>

          {/* Quest Image */}
          <div className="hud-card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-neon-pink" />
              <h2 className="text-lg font-bold text-foreground">Quest Image</h2>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Add a quest image (optional)
              </label>
              
              {questImage ? (
                <div className="relative">
                  <img 
                    src={questImage} 
                    alt="Quest preview" 
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-destructive hover:bg-destructive/80 text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border hover:border-neon-purple transition-colors rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <label 
                      htmlFor="quest-image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-lg font-medium cursor-pointer transition-all hover:scale-105 active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      Choose Image
                    </label>
                    <input
                      id="quest-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      📷 Max 10MB • JPG, PNG, WEBP supported
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* External Links */}
          <div className="hud-card p-6 space-y-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5 text-neon-orange" />
                <h2 className="text-lg font-bold text-foreground">External Links</h2>
              </div>
              {formData.externalLinks.length < 3 && (
                <button
                  type="button"
                  onClick={addExternalLink}
                  className="px-3 py-1 bg-gradient-to-r from-neon-orange to-neon-red text-white text-sm rounded-full font-medium hover:scale-105 active:scale-95 transition-all"
                >
                  + Add Link
                </button>
              )}
            </div>

            <div className="space-y-3">
              {formData.externalLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder={`External link ${index + 1} (e.g., event page, booking site, etc.)`}
                    value={link}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.stopPropagation()
                      updateExternalLink(index, e.target.value)
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 p-3 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground focus:border-neon-orange focus:ring-2 focus:ring-neon-orange/20 transition-all"
                  />
                  {formData.externalLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExternalLink(index)}
                      className="w-10 h-10 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg flex items-center justify-center transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground">
              🔗 Add useful links like event pages, booking sites, or related content (up to 3 links)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-4">
            {/* Primary Action Buttons Row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="py-4 bg-muted/30 border border-muted-foreground/30 text-muted-foreground font-bold tracking-wider transition-all hover:bg-muted/50 hover:border-muted-foreground/50 hover:scale-[1.02] rounded-lg flex items-center justify-center active:scale-[0.98] touch-manipulation"
                style={{ minHeight: '56px' }}
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={!isFormValid()}
                className={`neon-button py-4 text-center font-bold tracking-wider transition-all ${
                  !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                }`}
                style={{ minHeight: '56px' }}
              >
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4" />
                  {isEditMode ? 'UPDATE' : 'LAUNCH'}
                  <Zap className="w-4 h-4" />
                </div>
              </button>
            </div>
            
            {!isFormValid() && (
              <p className="text-center text-sm text-muted-foreground">
                Fill in all required fields (*) to {isEditMode ? 'update' : 'launch'} your quest! 
              </p>
            )}

            {/* Delete Button - Only show in edit mode */}
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-4 bg-destructive/10 border border-destructive text-destructive font-bold tracking-wider text-lg transition-all hover:bg-destructive/20 hover:scale-[1.02] rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] touch-manipulation"
                style={{ minHeight: '56px' }}
              >
                <Trash2 className="w-5 h-5" />
                DELETE QUEST
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  </div>,
  document.body
)
}