'use client';

import { useState } from 'react';
import { Shield, CheckCircle, Calendar, Mail, Home, MapPin, RefreshCw } from 'lucide-react';
import type { ValidationRules } from '@/types/configurator';

interface ValidationRulesBuilderProps {
  sessionId: string;
  rules: ValidationRules;
  onRulesChange: (rules: ValidationRules) => void;
}

export function ValidationRulesBuilder({ sessionId, rules, onRulesChange }: ValidationRulesBuilderProps) {
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (updates: Partial<ValidationRules>) => {
    const updatedRules = { ...rules, ...updates };
    setSaving(true);

    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '☑️  Validations Briefing',
          fieldKey: 'validation_rules',
          fieldValue: JSON.stringify(updatedRules),
          fieldType: 'json',
        }),
      });

      if (response.ok) {
        onRulesChange(updatedRules);
      }
    } catch (error) {
      console.error('Failed to save validation rules:', error);
    } finally {
      setTimeout(() => setSaving(false), 300);
    }
  };

  const handleNestedUpdate = <K extends keyof ValidationRules>(
    key: K,
    nestedUpdates: Partial<ValidationRules[K]>
  ) => {
    handleUpdate({
      [key]: { ...rules[key], ...nestedUpdates },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Validation Rules
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure automatic approval rules and validation requirements
          </p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <p className="text-sm text-purple-700 dark:text-purple-400">
          🔒 <strong>Compliance & Control:</strong> These rules determine which expenses are automatically approved
          versus requiring manual review by your validation team.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid gap-6">
        {/* Bulk Approve Recurring */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Bulk Approve Recurring Expenses</h3>
                <p className="text-sm text-muted-foreground">
                  Auto-approve monthly subscriptions (e.g., bike lease, public transport passes)
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                role="switch"
                aria-checked={rules.bulkApproveRecurring}
                aria-label="Bulk approve recurring expenses"
                checked={rules.bulkApproveRecurring}
                onChange={(e) => handleUpdate({ bulkApproveRecurring: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          {rules.bulkApproveRecurring && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-700 dark:text-green-400">
                ✓ Enabled: Recurring expenses will be automatically approved without manual review
              </p>
            </div>
          )}
        </div>

        {/* Housing Cost Validation */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Housing Cost Validation</h3>
              <p className="text-sm text-muted-foreground">
                Additional validation requirements for housing cost reimbursements
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Monthly Proof */}
            <label className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
              <div>
                <span className="text-sm font-medium block">Require Monthly Proof of Payment</span>
                <span className="text-xs text-muted-foreground">Employee must attach rent receipt each month</span>
              </div>
              <input
                type="checkbox"
                aria-label="Require monthly proof of payment for housing cost reimbursements"
                checked={rules.housingCost?.requireMonthlyProof ?? false}
                onChange={(e) =>
                  handleNestedUpdate('housingCost', { requireMonthlyProof: e.target.checked })
                }
                className="w-4 h-4 rounded border-input"
              />
            </label>

            {/* Distance Proof */}
            <label className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium block">Require Distance Proof (&lt;10km)</span>
                  <span className="text-xs text-muted-foreground">
                    Verify address if employee lives within 10km of workplace
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Require distance proof for employees living within 10km of workplace"
                checked={rules.housingCost?.requireDistanceProof ?? false}
                onChange={(e) =>
                  handleNestedUpdate('housingCost', { requireDistanceProof: e.target.checked })
                }
                className="w-4 h-4 rounded border-input"
              />
            </label>
          </div>
        </div>

        {/* Check Dates (Double Validation) */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Check Dates (Double Validation)</h3>
              <p className="text-sm text-muted-foreground">
                Schedule two validation checkpoints for high-amount expenses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Check Date</label>
              <input
                type="date"
                value={rules.checkDates?.firstCheck ? new Date(rules.checkDates.firstCheck).toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  handleNestedUpdate('checkDates', { firstCheck: e.target.value ? new Date(e.target.value) : undefined })
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Second Check Date</label>
              <input
                type="date"
                value={rules.checkDates?.secondCheck ? new Date(rules.checkDates.secondCheck).toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  handleNestedUpdate('checkDates', { secondCheck: e.target.value ? new Date(e.target.value) : undefined })
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Payroll Export */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Payroll Export Day</h3>
              <p className="text-sm text-muted-foreground">
                Day of month when expense data is sent to your payroll system
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Day of Month (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={rules.payrollExportDay || ''}
                onChange={(e) => handleUpdate({ payrollExportDay: parseInt(e.target.value) || 1 })}
                placeholder="15"
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must align with your payroll cycle
              </p>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  📅 Expenses will be exported on day <strong>{rules.payrollExportDay || '?'}</strong> of each month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Team Contact */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Validation Team Email</h3>
              <p className="text-sm text-muted-foreground">
                Email address for the Skipr validation team assigned to your account
              </p>
            </div>
          </div>

          <input
            type="email"
            value={rules.validationTeamEmail || ''}
            onChange={(e) => handleUpdate({ validationTeamEmail: e.target.value })}
            placeholder="teambackoffice.skipr+yourclient@smartelia.com"
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
            readOnly
          />
          <p className="text-xs text-muted-foreground mt-2">
            This email is configured by your CSM and receives all validation alerts
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">📊 Validation Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Auto-Approval Rate</p>
            <p className="font-semibold text-foreground">
              {rules.bulkApproveRecurring ? 'High' : 'Standard'}
              {rules.bulkApproveRecurring && ' (Recurring expenses approved)'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Housing Cost Checks</p>
            <p className="font-semibold text-foreground">
              {[
                rules.housingCost?.requireMonthlyProof && 'Monthly Proof',
                rules.housingCost?.requireDistanceProof && 'Distance Check',
              ]
                .filter(Boolean)
                .join(', ') || 'None'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Double Validation</p>
            <p className="font-semibold text-foreground">
              {rules.checkDates?.firstCheck && rules.checkDates?.secondCheck ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Payroll Export</p>
            <p className="font-semibold text-foreground">Day {rules.payrollExportDay || '?'} of month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
