'use client';

import { useState, useEffect } from 'react';
import { FormField } from '@/components/FormField';
import { MobilityServiceSelector } from '@/components/MobilityServiceSelector';
import { GroupManager } from '@/components/GroupManager';
import { EmployeeManager } from '@/components/EmployeeManager';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SHEET_DEFINITIONS, TEMPLATE_PRESETS } from '@/lib/types';
import { CheckCircle2, FileText, Rocket, Megaphone, User, LogOut, Menu, X, Users, ArrowRight } from 'lucide-react';
import type { BudgetGroup } from '@/types/configurator';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ClientPortal({ params }: PageProps) {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('client-information');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [budgetGroups, setBudgetGroups] = useState<BudgetGroup[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const clientTabs = SHEET_DEFINITIONS.filter(sheet => sheet.visibleToClient);

  const tabIcons: Record<string, any> = {
    'client-information': FileText,
    'mobility-programs': Rocket,
    'employees': Users,
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

          // Load budget groups if found
          if (field.fieldKey === 'budget_groups_default-program' && field.fieldValue) {
            try {
              const groups = JSON.parse(field.fieldValue);
              setBudgetGroups(groups);
            } catch (e) {
              console.error('Failed to parse budget groups:', e);
            }
          }
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

    // Only count required fields for progress
    const allFields = sheet.sections.flatMap(section => section.fields);
    let requiredFields = allFields.filter(field => field.required === true);
    let extraCompleted = 0;
    let extraTotal = 0;

    // Special case: If using budget groups, replace individual budget fields with group requirement
    if (sheetName === 'mobility-programs') {
      const usingGroups = fieldValues[`${sheetName}-has_budget_groups`] === 'Yes - Create groups';
      if (usingGroups) {
        // Exclude individual budget fields from required count
        requiredFields = requiredFields.filter(field =>
          field.key !== 'budget_distribution' && field.key !== 'budget_amount'
        );
        // Add virtual requirement: at least one group must be created
        extraTotal = 1;
        extraCompleted = budgetGroups.length > 0 ? 1 : 0;
      }
    }

    const completed = requiredFields.filter(field => {
      const value = fieldValues[`${sheetName}-${field.key}`];
      return value && value.length > 0;
    }).length;

    return {
      completed: completed + extraCompleted,
      total: requiredFields.length + extraTotal
    };
  };

  // Determine which tabs are unlocked based on completion
  const getUnlockedTabs = () => {
    const unlocked: string[] = [];
    for (const tab of clientTabs) {
      const progress = getSheetProgress(tab.name);
      unlocked.push(tab.name);
      // If this tab is incomplete, don't unlock the next ones
      // Tabs with no required fields (total === 0) are considered complete
      if (progress.completed < progress.total && progress.total > 0) {
        break;
      }
    }
    return unlocked;
  };

  const unlockedTabs = getUnlockedTabs();
  const isTabUnlocked = (tabName: string) => unlockedTabs.includes(tabName);
  const currentTabIndex = clientTabs.findIndex(t => t.name === activeTab);
  const isCurrentTabComplete = () => {
    const progress = getSheetProgress(activeTab);
    // Tabs with no required fields are considered complete
    return progress.total === 0 || progress.completed === progress.total;
  };
  const nextTab = currentTabIndex < clientTabs.length - 1 ? clientTabs[currentTabIndex + 1] : null;

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-lg text-foreground font-semibold mb-2">Session not found</p>
          <p className="text-sm text-muted-foreground mb-6">
            The session you're looking for doesn't exist or has expired.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start New Session
            </a>
            {sessionId && (
              <p className="text-xs text-muted-foreground">
                Session ID: {sessionId}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const activeSheet = SHEET_DEFINITIONS.find(s => s.name === activeTab);
  const progress = getSheetProgress(activeTab);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border p-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div className="font-semibold text-foreground">Skipr</div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Slide-out */}
      <aside className={`
        w-64 border-r border-border bg-muted/30 flex flex-col
        md:relative md:translate-x-0
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
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

            const isUnlocked = isTabUnlocked(tab.name);

            return (
              <button
                key={tab.name}
                onClick={() => {
                  if (isUnlocked) {
                    setActiveTab(tab.name);
                    setMobileMenuOpen(false);
                  }
                }}
                disabled={!isUnlocked}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-primary text-white shadow-sm'
                    : isUnlocked
                    ? 'text-foreground hover:bg-accent'
                    : 'text-muted-foreground/50 cursor-not-allowed opacity-60'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{tab.title}</span>
                {isComplete && !isActive && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                {!isComplete && tabProgress.total > 0 && isUnlocked && (
                  <span className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {tabProgress.completed}/{tabProgress.total}
                  </span>
                )}
                {!isUnlocked && (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
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
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
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
            {/* Show EmployeeManager for employees tab */}
            {activeTab === 'employees' ? (
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm card-hover animate-slide-in">
                <EmployeeManager
                  sessionId={sessionId}
                  budgetGroups={budgetGroups}
                />
              </div>
            ) : (
              activeSheet?.sections.map((section, sectionIndex) => (
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
                  ) : section.title === 'Group & Budget Configuration' ? (
                    <>
                      {/* Show the budget groups toggle first */}
                      {section.fields
                        .filter(field => field.key === 'has_budget_groups')
                        .map((field) => (
                          <FormField
                            key={field.key}
                            field={field}
                            sheetName={activeTab}
                            sessionId={sessionId}
                            initialValue={fieldValues[`${activeTab}-${field.key}`] || ''}
                            onSave={(value) => handleFieldSave(activeTab, field.key, value)}
                          />
                        ))}

                      {/* Show GroupManager if user selected "Yes - Create groups" */}
                      {fieldValues[`${activeTab}-has_budget_groups`] === 'Yes - Create groups' && (
                        <div className="mt-6">
                          <GroupManager
                            programId="default-program"
                            sessionId={sessionId}
                            groups={budgetGroups}
                            onGroupsChange={setBudgetGroups}
                          />
                        </div>
                      )}

                      {/* Show simple budget fields if user selected "No - Individual budgets" */}
                      {fieldValues[`${activeTab}-has_budget_groups`] === 'No - Individual budgets per employee' && (
                        <>
                          {section.fields
                            .filter(field => field.key !== 'has_budget_groups')
                            .map((field) => (
                              <FormField
                                key={field.key}
                                field={field}
                                sheetName={activeTab}
                                sessionId={sessionId}
                                initialValue={fieldValues[`${activeTab}-${field.key}`] || ''}
                                onSave={(value) => handleFieldSave(activeTab, field.key, value)}
                              />
                            ))}
                        </>
                      )}
                    </>
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
              ))
            )}
          </div>

          {/* Continue Button */}
          {isCurrentTabComplete() && nextTab && (
            <div className="mt-8">
              <button
                onClick={() => setActiveTab(nextTab.name)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Continue to {nextTab.title}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Help Footer */}
          <div className="mt-8 p-4 bg-accent/50 border border-border rounded-lg text-sm text-muted-foreground flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-xs">💡</span>
            </div>
            <p>
              Your progress is automatically saved as you type. {!isCurrentTabComplete() && 'Complete all required fields to continue to the next step.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
