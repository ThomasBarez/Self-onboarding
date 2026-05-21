'use client';

import { useState, useEffect } from 'react';
import { FormField } from '@/components/FormField';
import { MobilityServiceSelector } from '@/components/MobilityServiceSelector';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SHEET_DEFINITIONS, TEMPLATE_PRESETS } from '@/lib/types';
import { CheckCircle2, FileText, Rocket, Megaphone, User, LogOut } from 'lucide-react';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ClientPortal({ params }: PageProps) {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('client-information');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  const clientTabs = SHEET_DEFINITIONS.filter(sheet => sheet.visibleToClient);

  const tabIcons: Record<string, any> = {
    'client-information': FileText,
    'mobility-programs': Rocket,
    'go-live-planning': Megaphone,
  };

  useEffect(() => {
    params.then(p => {
      setSessionId(p.sessionId);
    });
  }, [params]);

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const fetchSession = async () => {
    if (!sessionId) return;
    try {
      const response = await fetch(`/api/session?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);

        const values: Record<string, string> = {};
        data.session.fields?.forEach((field: any) => {
          values[`${field.sheetName}-${field.fieldKey}`] = field.fieldValue || '';
        });
        setFieldValues(values);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSave = (sheetName: string, fieldKey: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [`${sheetName}-${fieldKey}`]: value,
    }));

    // Auto-fill services when template is selected
    if (sheetName === 'mobility-programs' && fieldKey === 'program_template') {
      const preset = TEMPLATE_PRESETS[value];
      if (preset) {
        // Apply all service presets
        const updatedValues: Record<string, string> = { [`${sheetName}-${fieldKey}`]: value };

        Object.entries(preset).forEach(([serviceKey, serviceValue]) => {
          updatedValues[`${sheetName}-${serviceKey}`] = serviceValue;

          // Save each service field to database
          fetch('/api/autosave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              sheetName,
              fieldKey: serviceKey,
              fieldValue: serviceValue,
              fieldType: 'select',
            }),
          });
        });

        setFieldValues(prev => ({
          ...prev,
          ...updatedValues,
        }));
      }
    }
  };

  const getSheetProgress = (sheetName: string) => {
    const sheet = SHEET_DEFINITIONS.find(s => s.name === sheetName);
    if (!sheet) return { completed: 0, total: 0 };

    const allFields = sheet.sections.flatMap(section => section.fields);
    const completed = allFields.filter(field => {
      const value = fieldValues[`${sheetName}-${field.key}`];
      return value && value.length > 0;
    }).length;

    return { completed, total: allFields.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Session not found</p>
          <a href="/" className="text-sm text-primary hover:underline">Return home</a>
        </div>
      </div>
    );
  }

  const activeSheet = SHEET_DEFINITIONS.find(s => s.name === activeTab);
  const progress = getSheetProgress(activeTab);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 flex flex-col">
        {/* Logo & User */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div className="font-semibold text-foreground">Skipr</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {session.user?.name || session.user?.email}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {clientTabs.map((tab) => {
            const Icon = tabIcons[tab.name] || FileText;
            const tabProgress = getSheetProgress(tab.name);
            const isActive = activeTab === tab.name;
            const isComplete = tabProgress.completed === tabProgress.total && tabProgress.total > 0;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground hover:bg-accent'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{tab.title}</span>
                {isComplete && !isActive && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                {!isComplete && tabProgress.total > 0 && (
                  <span className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {tabProgress.completed}/{tabProgress.total}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Exit Session
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8 animate-slide-in">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{activeSheet?.emoji}</span>
              <h1 className="text-3xl font-bold text-foreground">{activeSheet?.title}</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              Complete the fields below. Your progress is automatically saved.
            </p>
            <ProgressIndicator
              completed={progress.completed}
              total={progress.total}
              label="Section Progress"
            />
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            {activeSheet?.sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-card border border-border rounded-xl p-8 shadow-sm card-hover animate-slide-in"
                style={{ animationDelay: `${sectionIndex * 50}ms` }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-1">{section.title}</h2>
                  {section.description && (
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  )}
                </div>
                <div className="space-y-5">
                  {section.title === 'Allowed Mobility Services' ? (
                    <MobilityServiceSelector
                      services={section.fields}
                      sheetName={activeTab}
                      sessionId={sessionId}
                      fieldValues={fieldValues}
                      onSave={(fieldKey, value) => handleFieldSave(activeTab, fieldKey, value)}
                    />
                  ) : (
                    section.fields.map((field) => (
                      <FormField
                        key={field.key}
                        field={field}
                        sheetName={activeTab}
                        sessionId={sessionId}
                        initialValue={fieldValues[`${activeTab}-${field.key}`] || ''}
                        onSave={(value) => handleFieldSave(activeTab, field.key, value)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Help Footer */}
          <div className="mt-8 p-4 bg-accent/50 border border-border rounded-lg text-sm text-muted-foreground flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-xs">💡</span>
            </div>
            <p>
              Your progress is automatically saved as you type. You can safely leave and come back later to complete the remaining fields.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
