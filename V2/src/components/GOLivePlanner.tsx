'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, Lightbulb, Heart, BookOpen, Zap, RefreshCw, Users } from 'lucide-react';
import type { GOLivePlan, ADKARMilestone, ADKARPhase } from '@/types/configurator';

interface GOLivePlannerProps {
  sessionId: string;
  plan: GOLivePlan;
  onPlanChange: (plan: GOLivePlan) => void;
}

const ADKAR_PHASES: Array<{
  phase: ADKARPhase;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  defaultAction: string;
  defaultRecipients: ADKARMilestone['recipients'];
  weeksBeforeGoLive: number;
}> = [
  {
    phase: 'awareness',
    label: 'Awareness',
    icon: Lightbulb,
    color: 'blue',
    description: 'Employees understand why the change is happening',
    defaultAction: 'Conduct info session and share mobility policy overview',
    defaultRecipients: 'all_eligible',
    weeksBeforeGoLive: 4,
  },
  {
    phase: 'desire',
    label: 'Desire',
    icon: Heart,
    color: 'pink',
    description: 'Employees want to support and participate',
    defaultAction: 'Share individual budget amounts and contract addendums',
    defaultRecipients: 'interested',
    weeksBeforeGoLive: 2,
  },
  {
    phase: 'knowledge',
    label: 'Knowledge',
    icon: BookOpen,
    color: 'purple',
    description: 'Employees know how to use the system',
    defaultAction: 'Conduct admin training session',
    defaultRecipients: 'admin_users',
    weeksBeforeGoLive: 1,
  },
  {
    phase: 'ability',
    label: 'Ability',
    icon: Zap,
    color: 'orange',
    description: 'Employees can actually use the system',
    defaultAction: 'Send employee training and activate accounts (GO LIVE)',
    defaultRecipients: 'confirmed',
    weeksBeforeGoLive: 0,
  },
  {
    phase: 'reinforcement',
    label: 'Reinforcement',
    icon: RefreshCw,
    color: 'green',
    description: 'Sustain the change over time',
    defaultAction: 'Share support materials, FAQ, and ongoing CSM support',
    defaultRecipients: 'all_active',
    weeksBeforeGoLive: -1, // 1 week after
  },
];

export function GOLivePlanner({ sessionId, plan, onPlanChange }: GOLivePlannerProps) {
  const [goLiveDate, setGoLiveDate] = useState<Date>(plan.goLiveDate);
  const [milestones, setMilestones] = useState<ADKARMilestone[]>(plan.milestones);
  const [editingPhase, setEditingPhase] = useState<ADKARPhase | null>(null);

  // Auto-calculate milestone dates based on GO LIVE date
  useEffect(() => {
    if (!goLiveDate) return;

    const calculatedMilestones: ADKARMilestone[] = ADKAR_PHASES.map(phase => {
      const existingMilestone = milestones.find(m => m.phase === phase.phase);
      const weeksOffset = phase.weeksBeforeGoLive;
      const date = new Date(goLiveDate);
      date.setDate(date.getDate() + (weeksOffset * 7));

      return {
        phase: phase.phase,
        date,
        action: existingMilestone?.action || phase.defaultAction,
        recipients: existingMilestone?.recipients || phase.defaultRecipients,
        completed: existingMilestone?.completed || false,
      };
    });

    setMilestones(calculatedMilestones);
  }, [goLiveDate]);

  const handleGoLiveDateChange = async (newDate: Date) => {
    setGoLiveDate(newDate);

    const updatedPlan: GOLivePlan = {
      goLiveDate: newDate,
      milestones,
    };

    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '📢 GO LIVE planning',
          fieldKey: 'go_live_plan',
          fieldValue: JSON.stringify(updatedPlan),
          fieldType: 'json',
        }),
      });

      if (response.ok) {
        onPlanChange(updatedPlan);
      }
    } catch (error) {
      console.error('Failed to save GO LIVE plan:', error);
    }
  };

  const handleMilestoneUpdate = async (phase: ADKARPhase, updates: Partial<ADKARMilestone>) => {
    const updatedMilestones = milestones.map(m =>
      m.phase === phase ? { ...m, ...updates } : m
    );

    setMilestones(updatedMilestones);

    const updatedPlan: GOLivePlan = {
      goLiveDate,
      milestones: updatedMilestones,
    };

    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '📢 GO LIVE planning',
          fieldKey: 'go_live_plan',
          fieldValue: JSON.stringify(updatedPlan),
          fieldType: 'json',
        }),
      });

      if (response.ok) {
        onPlanChange(updatedPlan);
      }
    } catch (error) {
      console.error('Failed to save milestone:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/20',
        icon: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600',
      },
      pink: {
        bg: 'bg-pink-500/10',
        text: 'text-pink-700 dark:text-pink-400',
        border: 'border-pink-500/20',
        icon: 'text-pink-600',
        gradient: 'from-pink-500 to-pink-600',
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-500/20',
        icon: 'text-purple-600',
        gradient: 'from-purple-500 to-purple-600',
      },
      orange: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-500/20',
        icon: 'text-orange-600',
        gradient: 'from-orange-500 to-orange-600',
      },
      green: {
        bg: 'bg-green-500/10',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-500/20',
        icon: 'text-green-600',
        gradient: 'from-green-500 to-green-600',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderMilestone = (phaseConfig: typeof ADKAR_PHASES[0]) => {
    const milestone = milestones.find(m => m.phase === phaseConfig.phase);
    if (!milestone) return null;

    const isEditing = editingPhase === phaseConfig.phase;
    const Icon = phaseConfig.icon;
    const colorClasses = getColorClasses(phaseConfig.color);

    return (
      <div
        key={phaseConfig.phase}
        className={`border rounded-lg p-6 ${colorClasses.border} ${
          milestone.completed ? 'bg-card' : 'bg-card'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {phaseConfig.label}
                {milestone.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
              </h3>
              <p className="text-xs text-muted-foreground">{phaseConfig.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{formatDate(milestone.date)}</p>
            <p className="text-xs text-muted-foreground">
              {phaseConfig.weeksBeforeGoLive === 0
                ? 'GO LIVE'
                : phaseConfig.weeksBeforeGoLive > 0
                ? `${phaseConfig.weeksBeforeGoLive}w before`
                : `${Math.abs(phaseConfig.weeksBeforeGoLive)}w after`}
            </p>
          </div>
        </div>

        {/* Action */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <textarea
                value={milestone.action}
                onChange={(e) => handleMilestoneUpdate(phaseConfig.phase, { action: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Recipients</label>
              <select
                value={milestone.recipients}
                onChange={(e) =>
                  handleMilestoneUpdate(phaseConfig.phase, { recipients: e.target.value as ADKARMilestone['recipients'] })
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
              >
                <option value="all_eligible">All Eligible Employees</option>
                <option value="interested">Interested Employees</option>
                <option value="admin_users">Admin Users</option>
                <option value="confirmed">Confirmed Employees</option>
                <option value="all_active">All Active Employees</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingPhase(null)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-foreground mb-3">{milestone.action}</p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground capitalize">
                  {milestone.recipients.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMilestoneUpdate(phaseConfig.phase, { completed: !milestone.completed })}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    milestone.completed
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                      : 'border border-border hover:bg-accent'
                  }`}
                >
                  {milestone.completed ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-3 h-3" />
                      Mark Complete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingPhase(phaseConfig.phase)}
                  className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent text-xs transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const progress = (milestones.filter(m => m.completed).length / milestones.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          GO LIVE Planning
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          ADKAR change management model for a successful launch
        </p>
      </div>

      {/* GO LIVE Date Picker */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">GO LIVE Date</label>
            <input
              type="date"
              value={goLiveDate ? goLiveDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleGoLiveDateChange(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              All milestones will be calculated automatically from this date
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Progress</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-primary to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {milestones.filter(m => m.completed).length} of {milestones.length} milestones completed
            </p>
          </div>
        </div>
      </div>

      {/* ADKAR Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>ADKAR Model:</strong> A proven change management framework that ensures employees move through
          five stages - Awareness, Desire, Knowledge, Ability, and Reinforcement. Each milestone is automatically
          scheduled based on your GO LIVE date.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {ADKAR_PHASES.map(phase => renderMilestone(phase))}
      </div>

      {/* Communication Note */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
        <p className="text-sm text-orange-700 dark:text-orange-400">
          ⚠️ <strong>Important:</strong> Meeting invites for info sessions and training should be sent by the{' '}
          <strong>client</strong> (not Skipr) so that recordings automatically arrive in the client's mailbox after meetings end.
        </p>
      </div>
    </div>
  );
}
