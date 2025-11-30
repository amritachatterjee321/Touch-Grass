import { useState } from "react"
import { MapPin, ChevronDown, Check } from "lucide-react"
import { indianCities, getTier1Cities, getTier2Cities, type City } from "../data/cities"

interface CitySelectorProps {
  selectedCity: string
  onCityChange: (city: string) => void
}

export function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const tier1Cities = getTier1Cities()
  const tier2Cities = getTier2Cities()

  const filteredTier1 = tier1Cities.filter(city => 
    city.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTier2 = tier2Cities.filter(city => 
    city.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCitySelect = (city: City) => {
    console.log('City selected:', city.displayName)
    onCityChange(city.displayName)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="relative">
      {/* City Selector Button */}
      <button 
        className="flex items-center gap-3 w-full p-4 hud-card active:border-neon-cyan group transition-all touch-manipulation"
        style={{ minHeight: '60px' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MapPin className="w-5 h-5 text-neon-cyan flex-shrink-0" />
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">LOCATION</div>
          <div className="font-bold text-foreground truncate">{selectedCity}</div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-neon-cyan transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Overlay */}
      {isOpen && (
        <>
          {/* Background Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div className="gaming-panel border-2 border-neon-cyan/50 bg-background/95 backdrop-blur-md max-h-[70vh] overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-muted/20">
                <input
                  type="text"
                  inputMode="search"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 bg-input-background border border-input rounded-md text-foreground placeholder-muted-foreground focus:border-neon-cyan focus:outline-none transition-colors mobile-form-input"
                  style={{ fontSize: '16px' }}
                  autoFocus
                />
              </div>

              {/* Cities List */}
              <div className="overflow-y-auto max-h-[50vh] mobile-scroll">
                {/* All Cities */}
                <div className="p-4">
                  <div className="space-y-1">
                    {/* Tier 1 Cities */}
                    {filteredTier1.map((city) => (
                      <button
                        key={city.displayName}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full p-3 text-left rounded-lg transition-all group flex items-center justify-between hover:bg-neon-cyan/10 ${
                          selectedCity === city.displayName 
                            ? 'bg-neon-cyan/20 border border-neon-cyan/50' 
                            : 'hover:border hover:border-neon-cyan/30'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-foreground">{city.name}</div>
                          <div className="text-xs text-muted-foreground">{city.state}</div>
                        </div>
                        {selectedCity === city.displayName && (
                          <Check className="w-4 h-4 text-neon-cyan" />
                        )}
                      </button>
                    ))}

                    {/* Tier 2 Cities */}
                    {filteredTier2.map((city) => (
                      <button
                        key={city.displayName}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full p-3 text-left rounded-lg transition-all group flex items-center justify-between hover:bg-neon-purple/10 ${
                          selectedCity === city.displayName 
                            ? 'bg-neon-purple/20 border border-neon-purple/50' 
                            : 'hover:border hover:border-neon-purple/30'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-foreground">{city.name}</div>
                          <div className="text-xs text-muted-foreground">{city.state}</div>
                        </div>
                        {selectedCity === city.displayName && (
                          <Check className="w-4 h-4 text-neon-purple" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* No Results */}
                {filteredTier1.length === 0 && filteredTier2.length === 0 && searchQuery && (
                  <div className="p-8 text-center">
                    <div className="text-muted-foreground">
                      No cities found matching "{searchQuery}"
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-neon-cyan text-sm hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
