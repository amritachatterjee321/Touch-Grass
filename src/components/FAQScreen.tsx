import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface FAQScreenProps {
  onBack: () => void
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is TagAlong?",
    answer: "TagAlong is a social messaging app that gamifies event planning. Users can post 'adventures' (events) they're hosting or seeking companions for, while others can apply to join these quests. We use gaming terminology like 'JOIN QUEST' and 'SQUAD' to make planning social activities more engaging.",
    category: "General"
  },
  {
    id: "2",
    question: "How do I create a quest?",
    answer: "Tap the floating '+' button on the Quest Board or My Quests screen. Fill in your quest details including title, description, date, time, location, and squad size. You can also set the cost per person and add specific requirements for participants.",
    category: "Quests"
  },
  {
    id: "3",
    question: "How do I join a quest?",
    answer: "Browse quests on the Quest Board, tap on any quest that interests you, and hit the 'JOIN QUEST' button. You'll need to write a personal message explaining why you want to join. The quest creator will review your application and either approve or decline it.",
    category: "Quests"
  },
  {
    id: "4",
    question: "What happens after I join a quest?",
    answer: "Once approved by the quest creator, you'll be added to the quest's group chat where you can coordinate details with other squad members. You'll also receive notifications about quest updates and reminders.",
    category: "Quests"
  },
  {
    id: "5",
    question: "How do notifications work?",
    answer: "You'll receive notifications for quest updates, new messages, join requests (if you're a quest creator), quest reminders, and other important activities. You can customize your notification preferences in Settings.",
    category: "Notifications"
  },
  {
    id: "6",
    question: "Is my personal information safe?",
    answer: "Yes, we take privacy seriously. Your phone number and email are only visible to you. Your location shows only your city, not your exact address. You can control your profile visibility and who can message you directly in the Privacy settings.",
    category: "Privacy"
  },
  {
    id: "7",
    question: "Can I cancel or leave a quest?",
    answer: "Yes, you can leave any quest you've joined by going to the quest chat and using the leave option. If you're the quest creator, you can cancel the entire quest from the My Quests screen, but please give your squad members advance notice.",
    category: "Quests"
  },
  {
    id: "8",
    question: "How does payment work?",
    answer: "TagAlong doesn't handle payments directly. Quest creators can specify costs in Indian Rupees (₹), and payment arrangements are made directly between participants. We recommend discussing payment details in the quest chat before meeting up.",
    category: "Payment"
  },
  {
    id: "9",
    question: "What if someone doesn't show up?",
    answer: "While we can't control attendance, we encourage users to communicate clearly in quest chats. If someone consistently doesn't show up, you can report this behavior, and we'll take appropriate action to maintain a trustworthy community.",
    category: "Community"
  },
  {
    id: "10",
    question: "How do I report inappropriate behavior?",
    answer: "You can report users or content through the Report a Bug option in Settings, or by long-pressing on messages/profiles to access report options. We take all reports seriously and will investigate promptly.",
    category: "Community"
  }
]

export function FAQScreen({ onBack }: FAQScreenProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(faqData.map(item => item.category)))]
  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory)

  const toggleExpanded = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hud-card sticky top-0 z-50 p-4 border-b border-border backdrop-blur-md bg-background/90">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="gaming-filter p-2 rounded-lg hover:border-neon-cyan hover:text-neon-cyan transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">FREQUENTLY ASKED QUESTIONS</h1>
            <p className="text-sm text-muted-foreground">Find answers to common questions</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">CATEGORIES</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`gaming-filter px-3 py-1 text-xs ${
                  selectedCategory === category ? 'active' : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="hud-card border border-border overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground text-sm">{item.question}</h3>
                </div>
                <div className="text-neon-cyan">
                  {expandedItem === item.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
              
              {expandedItem === item.id && (
                <div className="px-4 pb-4 border-t border-border bg-muted/20">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No FAQs found for this category.</p>
          </div>
        )}

        {/* Contact Support CTA */}
        <div className="hud-card p-4 border border-neon-green/30 bg-neon-green/5">
          <h3 className="font-medium text-foreground mb-2">Still need help?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button 
            onClick={onBack}
            className="neon-button px-4 py-2 text-sm"
          >
            CONTACT SUPPORT
          </button>
        </div>
      </div>
    </div>
  )
}