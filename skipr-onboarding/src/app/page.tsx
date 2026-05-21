'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Shield, ArrowRight, Sparkles, User, Mail } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState<'client' | 'backoffice'>('client');

  const handleCreateSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email,
          userName: name,
          role: portalType === 'client' ? 'CLIENT' : 'INTERNAL',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const sessionId = data.session.id;

        if (portalType === 'client') {
          router.push(`/client/${sessionId}`);
        } else {
          router.push(`/backoffice/${sessionId}`);
        }
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Skipr Onboarding</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Streamline your mobility program setup with our intelligent onboarding platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 px-8 py-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Create New Session
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Get started by creating your personalized onboarding session
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateSession} className="p-8 space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 text-sm border border-input bg-background rounded-lg input-focus hover:border-primary/50"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@company.com"
                className="w-full px-4 py-3 text-sm border border-input bg-background rounded-lg input-focus hover:border-primary/50"
              />
            </div>

            {/* Portal Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Portal Type <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPortalType('client')}
                  className={`
                    relative flex flex-col items-center gap-3 p-6 border-2 rounded-xl transition-all
                    ${portalType === 'client'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                    }
                  `}
                >
                  {portalType === 'client' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    portalType === 'client'
                      ? 'bg-gradient-to-br from-primary to-purple-600'
                      : 'bg-muted'
                  }`}>
                    <Rocket className={`w-6 h-6 ${portalType === 'client' ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground mb-1">Client Portal</div>
                    <div className="text-xs text-muted-foreground">3 client-facing tabs</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPortalType('backoffice')}
                  className={`
                    relative flex flex-col items-center gap-3 p-6 border-2 rounded-xl transition-all
                    ${portalType === 'backoffice'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                    }
                  `}
                >
                  {portalType === 'backoffice' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    portalType === 'backoffice'
                      ? 'bg-gradient-to-br from-primary to-purple-600'
                      : 'bg-muted'
                  }`}>
                    <Shield className={`w-6 h-6 ${portalType === 'backoffice' ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground mb-1">Backoffice</div>
                    <div className="text-xs text-muted-foreground">All tabs + internal</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Session...
                </>
              ) : (
                <>
                  Start Onboarding
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Auto-save enabled
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            Progress tracked
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
            Return anytime
          </div>
        </div>
      </div>
    </div>
  );
}
