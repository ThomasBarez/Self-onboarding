'use client';

import { useState } from 'react';
import { Bike, Car, Users as CarpoolIcon, Footprints, Euro, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import type { Allowance, AllowanceType } from '@/types/configurator';

interface AllowanceConfiguratorProps {
  programId: string;
  sessionId: string;
  allowances: Allowance[];
  onAllowancesChange: (allowances: Allowance[]) => void;
}

const ALLOWANCE_TYPES: Array<{
  type: AllowanceType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}> = [
  {
    type: 'bike',
    label: 'Bike Allowance',
    icon: Bike,
    color: 'green',
    description: 'Reimbursement for bicycle commuting',
  },
  {
    type: 'car',
    label: 'Car Allowance',
    icon: Car,
    color: 'blue',
    description: 'Reimbursement for car commuting',
  },
  {
    type: 'carpooling',
    label: 'Carpooling Allowance',
    icon: CarpoolIcon,
    color: 'purple',
    description: 'Reimbursement for carpooling trips',
  },
  {
    type: 'pedestrian',
    label: 'Pedestrian Allowance',
    icon: Footprints,
    color: 'orange',
    description: 'Reimbursement for walking',
  },
];

export function AllowanceConfigurator({ programId, sessionId, allowances, onAllowancesChange }: AllowanceConfiguratorProps) {
  const [editingType, setEditingType] = useState<AllowanceType | null>(null);

  const getAllowance = (type: AllowanceType): Allowance | undefined => {
    return allowances.find(a => a.type === type);
  };

  const handleUpdate = async (type: AllowanceType, updates: Partial<Allowance>) => {
    const existingAllowance = getAllowance(type);
    const updatedAllowance: Allowance = {
      type,
      ratePerKm: existingAllowance?.ratePerKm ?? 0,
      maxKmPerJourney: existingAllowance?.maxKmPerJourney ?? 0,
      allowManualAdjustment: existingAllowance?.allowManualAdjustment ?? false,
      requireAdminValidation: existingAllowance?.requireAdminValidation ?? false,
      ...updates,
    };

    let updatedAllowances: Allowance[];
    if (existingAllowance) {
      updatedAllowances = allowances.map(a => a.type === type ? updatedAllowance : a);
    } else {
      updatedAllowances = [...allowances, updatedAllowance];
    }

    // Save to backend
    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '🚀 Mobility program(s)',
          fieldKey: `allowances_${programId}`,
          fieldValue: JSON.stringify(updatedAllowances),
          fieldType: 'text',
        }),
      });

      if (response.ok) {
        onAllowancesChange(updatedAllowances);
      }
    } catch (error) {
      console.error('Failed to save allowance:', error);
    }
  };

  const handleRemove = async (type: AllowanceType) => {
    const updatedAllowances = allowances.filter(a => a.type !== type);

    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '🚀 Mobility program(s)',
          fieldKey: `allowances_${programId}`,
          fieldValue: JSON.stringify(updatedAllowances),
          fieldType: 'text',
        }),
      });

      if (response.ok) {
        onAllowancesChange(updatedAllowances);
        setEditingType(null);
      }
    } catch (error) {
      console.error('Failed to remove allowance:', error);
    }
  };

  const renderAllowanceCard = (config: typeof ALLOWANCE_TYPES[0]) => {
    const allowance = getAllowance(config.type);
    const isConfigured = !!allowance && allowance.ratePerKm > 0;
    const isEditing = editingType === config.type;
    const Icon = config.icon;

    const colorClasses = ({
      green: {
        bg: 'bg-green-500/10',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-500/20',
        icon: 'text-green-600',
      },
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/20',
        icon: 'text-blue-600',
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-500/20',
        icon: 'text-purple-600',
      },
      orange: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-500/20',
        icon: 'text-orange-600',
      },
    } as const)[config.color] || {
      bg: 'bg-gray-500/10',
      text: 'text-gray-700 dark:text-gray-400',
      border: 'border-gray-500/20',
      icon: 'text-gray-600',
    };

    return (
      <div
        key={config.type}
        className={`border rounded-lg p-6 transition-all ${
          isConfigured ? 'border-border bg-card' : 'border-dashed border-border/50 bg-card/50'
        } ${isEditing ? 'ring-2 ring-primary' : ''}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colorClasses.icon}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{config.label}</h3>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>
          {isConfigured && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Active</span>
            </div>
          )}
        </div>

        {/* Configuration Form */}
        {isEditing || !isConfigured ? (
          <div className="space-y-4">
            {/* Rate per km */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Rate per km (€) <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  step="0.01"
                  value={allowance?.ratePerKm || ''}
                  onChange={(e) => handleUpdate(config.type, { ratePerKm: parseFloat(e.target.value) || 0 })}
                  placeholder="0.25"
                  className="w-full pl-9 pr-3 py-2 border border-input bg-background rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Max km per journey */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Max km per journey <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  value={allowance?.maxKmPerJourney || ''}
                  onChange={(e) => handleUpdate(config.type, { maxKmPerJourney: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                  className="w-full pl-9 pr-3 py-2 border border-input bg-background rounded-lg text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum distance that will be reimbursed per single trip
              </p>
            </div>

            {/* Toggle Options */}
            <div className="space-y-3 pt-2 border-t border-border">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium block">Allow Manual Distance Adjustment</span>
                  <span className="text-xs text-muted-foreground">Let employees override calculated distance</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowance?.allowManualAdjustment ?? false}
                  onChange={(e) => handleUpdate(config.type, { allowManualAdjustment: e.target.checked })}
                  className="w-4 h-4 rounded border-input"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium block">Require Admin Validation</span>
                  <span className="text-xs text-muted-foreground">
                    Admin must approve manually adjusted distances
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowance?.requireAdminValidation ?? false}
                  onChange={(e) => handleUpdate(config.type, { requireAdminValidation: e.target.checked })}
                  className="w-4 h-4 rounded border-input"
                  disabled={!allowance?.allowManualAdjustment}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
              {isEditing && isConfigured && (
                <>
                  <button
                    onClick={() => setEditingType(null)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => handleRemove(config.type)}
                    className="px-4 py-2 border border-destructive/50 text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </>
              )}
              {!isEditing && !isConfigured && (
                <button
                  onClick={() => setEditingType(config.type)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Configure
                </button>
              )}
            </div>
          </div>
        ) : (
          // Display Mode (when configured and not editing)
          <div className="space-y-3">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-accent/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rate</p>
                <p className="font-semibold">€{allowance.ratePerKm.toFixed(2)}/km</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Max Distance</p>
                <p className="font-semibold">{allowance.maxKmPerJourney} km</p>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {allowance.allowManualAdjustment ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  Manual Adjustment
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/10 text-gray-700 dark:text-gray-400 rounded text-xs">
                  <XCircle className="w-3 h-3" />
                  Auto Distance Only
                </span>
              )}
              {allowance.requireAdminValidation && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded text-xs">
                  Admin Approval Required
                </span>
              )}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setEditingType(config.type)}
              className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
            >
              Edit Configuration
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Distance-Based Allowances</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure reimbursement rates for distance-based mobility options
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>How it works:</strong> Employees enter start and end addresses. The system automatically calculates
          the distance using mapping services and applies your configured rate (€/km). The final amount is capped at
          your max km per journey setting.
        </p>
      </div>

      {/* Allowance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALLOWANCE_TYPES.map(config => renderAllowanceCard(config))}
      </div>

      {/* Calculation Example */}
      {allowances.length > 0 && (
        <div className="bg-accent/30 border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">💰 Calculation Example</h3>
          {allowances.filter(a => a.ratePerKm > 0).slice(0, 1).map(allowance => {
            const exampleDistance = 25; // km
            const cappedDistance = Math.min(exampleDistance, allowance.maxKmPerJourney);
            const amount = cappedDistance * allowance.ratePerKm;

            return (
              <div key={allowance.type} className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Employee travels <strong>{exampleDistance} km</strong> by {allowance.type}
                </p>
                <p className="text-muted-foreground">
                  Capped at: <strong>{cappedDistance} km</strong> (max: {allowance.maxKmPerJourney} km)
                </p>
                <p className="text-muted-foreground">
                  Rate: <strong>€{allowance.ratePerKm.toFixed(2)}/km</strong>
                </p>
                <p className="font-semibold text-foreground pt-2 border-t border-border">
                  Reimbursement: €{amount.toFixed(2)}
                </p>
                {allowance.allowManualAdjustment && (
                  <p className="text-xs text-orange-600">
                    {allowance.requireAdminValidation
                      ? '⚠️ If employee adjusts distance manually, admin approval required'
                      : 'ℹ️ Employee can adjust distance manually without approval'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
