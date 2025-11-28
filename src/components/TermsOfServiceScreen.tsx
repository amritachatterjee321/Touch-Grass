import { ArrowLeft, FileText, Users, AlertCircle, Gavel } from "lucide-react"

interface TermsOfServiceScreenProps {
  onBack: () => void
}

export function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
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
            <h1 className="text-lg font-bold text-foreground">TERMS OF SERVICE</h1>
            <p className="text-sm text-muted-foreground">Your agreement to use TouchGrass</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Last Updated */}
        <div className="hud-card p-4 border border-neon-green/30 bg-neon-green/5">
          <p className="text-sm text-foreground">
            <span className="font-medium">Last Updated:</span> January 15, 2024
          </p>
        </div>

        {/* Agreement */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-neon-cyan" />
            AGREEMENT TO TERMS
          </h2>
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using TouchGrass ("the App"), you accept and agree to be bound by these 
              Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our service. 
              These Terms apply to all users, including quest creators and participants.
            </p>
          </div>
        </section>

        {/* Service Description */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">SERVICE DESCRIPTION</h2>
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              TouchGrass is a social platform that connects people for real-world activities and adventures. 
              Our service allows users to:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Create and discover local events ("quests")</li>
              <li>• Apply to join activities hosted by other users</li>
              <li>• Communicate with fellow participants</li>
              <li>• Build a community around shared interests</li>
            </ul>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-purple" />
            USER RESPONSIBILITIES
          </h2>
          
          <div className="space-y-3">
            <div className="hud-card p-4">
              <h3 className="font-medium text-foreground mb-2">Account Requirements</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• You must be at least 18 years old to use TouchGrass</li>
                <li>• Provide accurate and truthful profile information</li>
                <li>• Keep your account credentials secure</li>
                <li>• You are responsible for all activity on your account</li>
              </ul>
            </div>

            <div className="hud-card p-4">
              <h3 className="font-medium text-foreground mb-2">Acceptable Use</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Use the service only for lawful purposes</li>
                <li>• Respect other users and their safety</li>
                <li>• Honor commitments when joining quests</li>
                <li>• Communicate respectfully in all interactions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Prohibited Conduct */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-neon-red" />
            PROHIBITED CONDUCT
          </h2>
          
          <div className="hud-card p-4 border border-neon-red/30 bg-neon-red/5">
            <p className="text-sm font-medium text-foreground mb-3">The following activities are strictly prohibited:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Harassment, bullying, or intimidation of other users</li>
              <li>• Creating fake profiles or impersonating others</li>
              <li>• Sharing inappropriate, offensive, or illegal content</li>
              <li>• Requesting or sharing personal contact information publicly</li>
              <li>• Commercial advertising or spam without permission</li>
              <li>• Attempting to access other users' accounts</li>
              <li>• Creating quests for illegal or dangerous activities</li>
              <li>• No-showing repeatedly without communication</li>
            </ul>
          </div>
        </section>

        {/* Safety & Meetings */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">SAFETY & REAL-WORLD MEETINGS</h2>
          
          <div className="hud-card p-4 border border-neon-orange/30 bg-neon-orange/5">
            <h3 className="font-medium text-foreground mb-2">Your Safety is Your Responsibility</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Always meet new people in public places</li>
              <li>• Tell someone where you're going and when you'll return</li>
              <li>• Trust your instincts - leave if you feel uncomfortable</li>
              <li>• TouchGrass does not conduct background checks on users</li>
              <li>• We are not responsible for interactions outside the app</li>
            </ul>
          </div>
        </section>

        {/* Payments & Costs */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">PAYMENTS & COSTS</h2>
          
          <div className="hud-card p-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• TouchGrass does not process payments between users</li>
              <li>• Quest costs are arranged directly between participants</li>
              <li>• Users are responsible for their own expenses and arrangements</li>
              <li>• We may introduce premium features with separate terms</li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">INTELLECTUAL PROPERTY</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              TouchGrass and its content are protected by intellectual property laws. By using our service:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• You grant us rights to use content you post on the platform</li>
              <li>• You retain ownership of your original content</li>
              <li>• You may not copy, modify, or distribute our app or content</li>
              <li>• Our trademarks and logos may not be used without permission</li>
            </ul>
          </div>
        </section>

        {/* Privacy */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">PRIVACY</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and 
              protect your information. By using TouchGrass, you also agree to our Privacy Policy.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Gavel className="w-5 h-5 text-neon-pink" />
            TERMINATION
          </h2>
          
          <div className="hud-card p-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• You may delete your account at any time through app settings</li>
              <li>• We may suspend or terminate accounts that violate these Terms</li>
              <li>• We reserve the right to modify or discontinue the service</li>
              <li>• These Terms remain in effect until terminated</li>
            </ul>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">DISCLAIMERS & LIABILITY</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              TouchGrass is provided "as is" without warranties. We are not liable for:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Actions or conduct of other users</li>
              <li>• Events, activities, or meetings arranged through the app</li>
              <li>• Loss or damage resulting from app use</li>
              <li>• Service interruptions or technical issues</li>
            </ul>
          </div>
        </section>

        {/* Changes */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">CHANGES TO TERMS</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update these Terms from time to time. We will notify users of material changes 
              through the app or email. Continued use after changes constitutes acceptance of the updated Terms.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">CONTACT INFORMATION</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Questions about these Terms? Contact us through the Contact Support option in app settings 
              or email legal@touchgrass.app.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}