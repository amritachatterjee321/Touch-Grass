// Indian Cities Data - Tier 1 and Tier 2 Cities
export interface City {
  name: string
  state: string
  tier: 1 | 2
  displayName: string
}

export const indianCities: City[] = [
  // Tier 1 Cities
  { name: "Mumbai", state: "Maharashtra", tier: 1, displayName: "Mumbai, Maharashtra" },
  { name: "Delhi", state: "Delhi", tier: 1, displayName: "Delhi, NCR" },
  { name: "Bangalore", state: "Karnataka", tier: 1, displayName: "Bangalore, Karnataka" },
  { name: "Hyderabad", state: "Telangana", tier: 1, displayName: "Hyderabad, Telangana" },
  { name: "Chennai", state: "Tamil Nadu", tier: 1, displayName: "Chennai, Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal", tier: 1, displayName: "Kolkata, West Bengal" },
  { name: "Pune", state: "Maharashtra", tier: 1, displayName: "Pune, Maharashtra" },
  { name: "Ahmedabad", state: "Gujarat", tier: 1, displayName: "Ahmedabad, Gujarat" },

  // Tier 2 Cities
  { name: "Gurgaon", state: "Haryana", tier: 2, displayName: "Gurgaon, Haryana" },
  { name: "Noida", state: "Uttar Pradesh", tier: 2, displayName: "Noida, Uttar Pradesh" },
  { name: "Kochi", state: "Kerala", tier: 2, displayName: "Kochi, Kerala" },
  { name: "Jaipur", state: "Rajasthan", tier: 2, displayName: "Jaipur, Rajasthan" },
  { name: "Indore", state: "Madhya Pradesh", tier: 2, displayName: "Indore, Madhya Pradesh" },
  { name: "Chandigarh", state: "Chandigarh", tier: 2, displayName: "Chandigarh, Punjab" },
  { name: "Coimbatore", state: "Tamil Nadu", tier: 2, displayName: "Coimbatore, Tamil Nadu" },
  { name: "Vadodara", state: "Gujarat", tier: 2, displayName: "Vadodara, Gujarat" },
  { name: "Nashik", state: "Maharashtra", tier: 2, displayName: "Nashik, Maharashtra" },
  { name: "Lucknow", state: "Uttar Pradesh", tier: 2, displayName: "Lucknow, Uttar Pradesh" },
  { name: "Nagpur", state: "Maharashtra", tier: 2, displayName: "Nagpur, Maharashtra" },
  { name: "Visakhapatnam", state: "Andhra Pradesh", tier: 2, displayName: "Visakhapatnam, Andhra Pradesh" },
  { name: "Bhubaneswar", state: "Odisha", tier: 2, displayName: "Bhubaneswar, Odisha" },
  { name: "Patna", state: "Bihar", tier: 2, displayName: "Patna, Bihar" },
  { name: "Thiruvananthapuram", state: "Kerala", tier: 2, displayName: "Thiruvananthapuram, Kerala" },
  { name: "Agra", state: "Uttar Pradesh", tier: 2, displayName: "Agra, Uttar Pradesh" },
  { name: "Mysore", state: "Karnataka", tier: 2, displayName: "Mysore, Karnataka" },
  { name: "Surat", state: "Gujarat", tier: 2, displayName: "Surat, Gujarat" },
  { name: "Mangalore", state: "Karnataka", tier: 2, displayName: "Mangalore, Karnataka" },
  { name: "Dehradun", state: "Uttarakhand", tier: 2, displayName: "Dehradun, Uttarakhand" },
  { name: "Varanasi", state: "Uttar Pradesh", tier: 2, displayName: "Varanasi, Uttar Pradesh" },
  { name: "Amritsar", state: "Punjab", tier: 2, displayName: "Amritsar, Punjab" },
  { name: "Allahabad", state: "Uttar Pradesh", tier: 2, displayName: "Allahabad, Uttar Pradesh" },
  { name: "Ranchi", state: "Jharkhand", tier: 2, displayName: "Ranchi, Jharkhand" },
  { name: "Guwahati", state: "Assam", tier: 2, displayName: "Guwahati, Assam" },
  { name: "Pondicherry", state: "Puducherry", tier: 2, displayName: "Pondicherry, Puducherry" },
  { name: "Jalandhar", state: "Punjab", tier: 2, displayName: "Jalandhar, Punjab" },
  { name: "Madurai", state: "Tamil Nadu", tier: 2, displayName: "Madurai, Tamil Nadu" },
  { name: "Rajkot", state: "Gujarat", tier: 2, displayName: "Rajkot, Gujarat" },
  { name: "Kanpur", state: "Uttar Pradesh", tier: 2, displayName: "Kanpur, Uttar Pradesh" },
]

// Group cities by tier for easy filtering
export const getTier1Cities = () => indianCities.filter(city => city.tier === 1)
export const getTier2Cities = () => indianCities.filter(city => city.tier === 2)
export const getAllCities = () => indianCities
