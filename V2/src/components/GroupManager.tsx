'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Users, Euro, Calendar, Eye, EyeOff, CreditCard, RefreshCw } from 'lucide-react';
import type { BudgetGroup, BudgetPeriod, RolloverBehavior } from '@/types/configurator';

interface GroupManagerProps {
  programId: string;
  sessionId: string;
  groups: BudgetGroup[];
  onGroupsChange: (groups: BudgetGroup[]) => void;
}

export function GroupManager({ programId, sessionId, groups, onGroupsChange }: GroupManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<BudgetGroup>>({});

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      topUpAmount: 0,
      topUpPeriod: 'monthly',
      rolloverBehavior: 'rollover',
      budgetVisible: true,
      proRataEnabled: true,
      mobilityCardAllowed: true,
      refundsAllowed: true,
      visibleToAdminsOnly: false,
    });
  };

  const handleEdit = (group: BudgetGroup) => {
    setEditingId(group.id);
    setFormData(group);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.topUpAmount) {
      alert('Please fill in all required fields');
      return;
    }

    const newGroup: BudgetGroup = {
      id: editingId || crypto.randomUUID(),
      name: formData.name,
      topUpAmount: formData.topUpAmount,
      topUpPeriod: formData.topUpPeriod || 'monthly',
      rolloverBehavior: formData.rolloverBehavior || 'rollover',
      budgetVisible: formData.budgetVisible ?? true,
      proRataEnabled: formData.proRataEnabled ?? true,
      mobilityCardAllowed: formData.mobilityCardAllowed ?? true,
      refundsAllowed: formData.refundsAllowed ?? true,
      visibleToAdminsOnly: formData.visibleToAdminsOnly ?? false,
    };

    let updatedGroups: BudgetGroup[];
    if (isAdding) {
      updatedGroups = [...groups, newGroup];
    } else {
      updatedGroups = groups.map(g => g.id === editingId ? newGroup : g);
    }

    // Save to backend
    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '🚀 Mobility program(s)',
          fieldKey: `budget_groups_${programId}`,
          fieldValue: JSON.stringify(updatedGroups),
          fieldType: 'text',
        }),
      });

      if (response.ok) {
        onGroupsChange(updatedGroups);
        setIsAdding(false);
        setEditingId(null);
        setFormData({});
      }
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleDelete = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this budget group? This cannot be undone.')) {
      return;
    }

    const updatedGroups = groups.filter(g => g.id !== groupId);

    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '🚀 Mobility program(s)',
          fieldKey: `budget_groups_${programId}`,
          fieldValue: JSON.stringify(updatedGroups),
          fieldType: 'text',
        }),
      });

      if (response.ok) {
        onGroupsChange(updatedGroups);
      }
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const renderForm = () => (
    <div className="border border-border rounded-lg p-6 bg-accent/30 space-y-4">
      {/* Group Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Group Name <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Executives, Field Workers"
          className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This name will be used in the employee import file (group_name column)
        </p>
      </div>

      {/* Budget Amount & Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Budget Top-Up Amount (€) <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              value={formData.topUpAmount || ''}
              onChange={(e) => setFormData({ ...formData, topUpAmount: parseFloat(e.target.value) })}
              placeholder="400"
              className="w-full pl-9 pr-3 py-2 border border-input bg-background rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Budget Period <span className="text-primary">*</span>
          </label>
          <select
            value={formData.topUpPeriod || 'monthly'}
            onChange={(e) => setFormData({ ...formData, topUpPeriod: e.target.value as BudgetPeriod })}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Rollover Behavior */}
      <div>
        <label className="block text-sm font-medium mb-2">Remaining Budget Behavior</label>
        <select
          value={formData.rolloverBehavior || 'rollover'}
          onChange={(e) => setFormData({ ...formData, rolloverBehavior: e.target.value as RolloverBehavior })}
          className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm"
        >
          <option value="rollover">Roll over to next period</option>
          <option value="reset">Reset each period</option>
        </select>
      </div>

      {/* Toggle Options */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Budget Visible to Employee</span>
          <input
            type="checkbox"
            checked={formData.budgetVisible ?? true}
            onChange={(e) => setFormData({ ...formData, budgetVisible: e.target.checked })}
            className="w-4 h-4 rounded border-input"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Enable Pro Rata (first period adjustment)</span>
          <input
            type="checkbox"
            checked={formData.proRataEnabled ?? true}
            onChange={(e) => setFormData({ ...formData, proRataEnabled: e.target.checked })}
            className="w-4 h-4 rounded border-input"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Mobility Card Allowed</span>
          <input
            type="checkbox"
            checked={formData.mobilityCardAllowed ?? true}
            onChange={(e) => setFormData({ ...formData, mobilityCardAllowed: e.target.checked })}
            className="w-4 h-4 rounded border-input"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Refunds Allowed</span>
          <input
            type="checkbox"
            checked={formData.refundsAllowed ?? true}
            onChange={(e) => setFormData({ ...formData, refundsAllowed: e.target.checked })}
            className="w-4 h-4 rounded border-input"
          />
        </label>

        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Group Name Visible to Admins Only</span>
          <input
            type="checkbox"
            checked={formData.visibleToAdminsOnly ?? false}
            onChange={(e) => setFormData({ ...formData, visibleToAdminsOnly: e.target.checked })}
            className="w-4 h-4 rounded border-input"
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Check className="w-4 h-4" />
          Save Group
        </button>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );

  const renderGroupCard = (group: BudgetGroup) => (
    <div key={group.id} className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{group.name}</h3>
            {group.visibleToAdminsOnly && (
              <span className="text-xs text-muted-foreground">(Admin-only visibility)</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(group)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => handleDelete(group.id)}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Budget Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Euro className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="font-semibold">€{group.topUpAmount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Period</p>
            <p className="font-semibold capitalize">{group.topUpPeriod}</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-2">
        {group.rolloverBehavior === 'rollover' && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded text-xs">
            <RefreshCw className="w-3 h-3" />
            Rollover
          </span>
        )}
        {group.budgetVisible ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded text-xs">
            <Eye className="w-3 h-3" />
            Visible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/10 text-gray-700 dark:text-gray-400 rounded text-xs">
            <EyeOff className="w-3 h-3" />
            Hidden
          </span>
        )}
        {group.proRataEnabled && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded text-xs">
            Pro Rata
          </span>
        )}
        {group.mobilityCardAllowed && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded text-xs">
            <CreditCard className="w-3 h-3" />
            Card
          </span>
        )}
        {group.refundsAllowed && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/10 text-pink-700 dark:text-pink-400 rounded text-xs">
            Refunds
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Budget Groups</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure budget groups for employees with identical budgets
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Group
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 <strong>Important:</strong> The group names you define here must match exactly with the{' '}
          <code className="bg-blue-500/20 px-1.5 py-0.5 rounded">group_name</code> column in your employee bulk import file.
        </p>
      </div>

      {/* Form (when adding or editing) */}
      {(isAdding || editingId) && renderForm()}

      {/* Groups List */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => editingId === group.id ? renderForm() : renderGroupCard(group))}
        </div>
      ) : (
        !isAdding && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No budget groups configured yet</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Group
            </button>
          </div>
        )
      )}
    </div>
  );
}
