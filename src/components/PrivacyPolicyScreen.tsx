import { ArrowLeft, Shield, Eye, Database, Users } from "lucide-react"

interface PrivacyPolicyScreenProps {
  onBack: () => void
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
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
            <h1 className="text-lg font-bold text-foreground">PRIVACY POLICY</h1>
            <p className="text-sm text-muted-foreground">How we protect your data</p>
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

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-neon-cyan" />
            INTRODUCTION
          </h2>
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              TouchGrass ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our mobile 
              application and services. By using TouchGrass, you agree to the collection and use of information 
              in accordance with this policy.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-neon-purple" />
            INFORMATION WE COLLECT
          </h2>
          
          <div className="space-y-3">
            <div className="hud-card p-4">
              <h3 className="font-medium text-foreground mb-2">Personal Information</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Name and profile information</li>
                <li>• Email address and phone number</li>
                <li>• Age, gender, and city location</li>
                <li>• Profile photos and interests</li>
                <li>• Bio and personality type preferences</li>
              </ul>
            </div>

            <div className="hud-card p-4">
              <h3 className="font-medium text-foreground mb-2">Quest & Activity Data</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Quests you create, join, or apply for</li>
                <li>• Messages in quest group chats</li>
                <li>• Quest reviews and ratings</li>
                <li>• Activity history and preferences</li>
              </ul>
            </div>

            <div className="hud-card p-4">
              <h3 className="font-medium text-foreground mb-2">Technical Information</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Device type, operating system, and app version</li>
                <li>• IP address and general location data</li>
                <li>• Usage analytics and app performance data</li>
                <li>• Crash reports and error logs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-neon-green" />
            HOW WE USE YOUR INFORMATION
          </h2>
          
          <div className="hud-card p-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• <span className="font-medium text-foreground">Quest Matching:</span> Connect you with compatible quest participants</li>
              <li>• <span className="font-medium text-foreground">Communication:</span> Enable messaging between quest members</li>
              <li>• <span className="font-medium text-foreground">Safety:</span> Verify profiles and prevent fraudulent activity</li>
              <li>• <span className="font-medium text-foreground">Improvements:</span> Analyze usage to enhance app features</li>
              <li>• <span className="font-medium text-foreground">Notifications:</span> Send quest updates and important information</li>
              <li>• <span className="font-medium text-foreground">Support:</span> Provide customer service and technical assistance</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-orange" />
            INFORMATION SHARING
          </h2>
          
          <div className="space-y-3">
            <div className="hud-card p-4">
              <h3 className="font-medium text-foreground mb-2">What We Share</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Profile information visible to other users (name, age, interests, bio)</li>
                <li>• Quest participation history with other quest members</li>
                <li>• Messages within quest group chats</li>
                <li>• City-level location (never exact address)</li>
              </ul>
            </div>

            <div className="hud-card p-4">
              <h3 className="font-medium text-foreground mb-2">What We DON'T Share</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Your phone number or email address</li>
                <li>• Exact location or home address</li>
                <li>• Private messages outside of quest chats</li>
                <li>• Payment information or financial data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">DATA SECURITY</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Encryption of data in transit and at rest</li>
              <li>• Regular security audits and updates</li>
              <li>• Limited access to personal data by employees</li>
              <li>• Secure servers with industry-standard protection</li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">YOUR RIGHTS</h2>
          
          <div className="hud-card p-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• <span className="font-medium text-foreground">Access:</span> Request a copy of your personal data</li>
              <li>• <span className="font-medium text-foreground">Correction:</span> Update or correct inaccurate information</li>
              <li>• <span className="font-medium text-foreground">Deletion:</span> Request deletion of your account and data</li>
              <li>• <span className="font-medium text-foreground">Portability:</span> Export your data in a machine-readable format</li>
              <li>• <span className="font-medium text-foreground">Opt-out:</span> Unsubscribe from marketing communications</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">CONTACT US</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or how we handle your data, please contact 
              our Privacy Team through the Contact Support option in the app settings, or email us at 
              privacy@touchgrass.app.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">POLICY CHANGES</h2>
          
          <div className="hud-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy in the app and updating the "Last Updated" date. 
              Your continued use of TouchGrass after changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}