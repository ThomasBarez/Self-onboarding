'use client';

import { useState } from 'react';
import { UserPlus, Upload, Download, Trash2, AlertCircle } from 'lucide-react';
import type { BudgetGroup } from '@/types/configurator';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  payrollId?: string;
  internalReference?: string;
  costCenter?: string;
  language: 'en' | 'fr' | 'nl' | 'de';
  budgetType: 'group' | 'custom';
  groupName?: string;
  customBudgetAmount?: number;
  customBudgetPeriod?: 'monthly' | 'quarterly' | 'yearly';
}

interface EmployeeManagerProps {
  sessionId: string;
  budgetGroups: BudgetGroup[];
}

export function EmployeeManager({ sessionId, budgetGroups }: EmployeeManagerProps) {
  const [mode, setMode] = useState<'manual' | 'csv'>('manual');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    payrollId: '',
    internalReference: '',
    costCenter: '',
    language: 'en',
    budgetType: 'group',
    groupName: '',
    customBudgetAmount: undefined,
    customBudgetPeriod: 'monthly',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'This field is required';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'This field is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'This field is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) return;

    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      email: formData.email!,
      payrollId: formData.payrollId,
      internalReference: formData.internalReference,
      costCenter: formData.costCenter,
      language: formData.language || 'en',
      budgetType: formData.budgetType || 'group',
      groupName: formData.budgetType === 'group' ? formData.groupName : undefined,
      customBudgetAmount: formData.budgetType === 'custom' ? formData.customBudgetAmount : undefined,
      customBudgetPeriod: formData.budgetType === 'custom' ? formData.customBudgetPeriod : undefined,
    };

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);

    // Save to backend
    try {
      await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '👥 Employees',
          fieldKey: 'employees_list',
          fieldValue: JSON.stringify(updatedEmployees),
          fieldType: 'text',
        }),
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        payrollId: '',
        internalReference: '',
        costCenter: '',
        language: 'en',
        budgetType: 'group',
        groupName: '',
        customBudgetAmount: undefined,
        customBudgetPeriod: 'monthly',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const updatedEmployees = employees.filter(e => e.id !== id);
    setEmployees(updatedEmployees);

    try {
      await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '👥 Employees',
          fieldKey: 'employees_list',
          fieldValue: JSON.stringify(updatedEmployees),
          fieldType: 'text',
        }),
      });
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'First Name*',
      'Last Name*',
      'Email*',
      'Payroll ID',
      'Internal Reference',
      'Cost Center',
      'Language (en/fr/nl/de)',
      'Budget Type* (group/custom)',
      'Budget Group Name',
      'Custom Budget Amount',
      'Custom Budget Period (monthly/quarterly/yearly)',
    ];

    const exampleRowGroup = [
      'John',
      'Doe',
      'john.doe@company.com',
      'EMP001',
      'REF123',
      'DEPT-IT',
      'en',
      'group',
      budgetGroups.length > 0 ? budgetGroups[0].name : 'Executives',
      '',
      '',
    ];

    const exampleRowCustom = [
      'Jane',
      'Smith',
      'jane.smith@company.com',
      'EMP002',
      'REF124',
      'DEPT-HR',
      'en',
      'custom',
      '',
      '500',
      'monthly',
    ];

    const csvContent = [
      headers.join(','),
      exampleRowGroup.join(','),
      exampleRowCustom.join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_import_template.csv';
    link.click();
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setUploadStatus('uploading');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());

      const newEmployees: Employee[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());

        if (values.length >= 3 && values[0] && values[1] && values[2]) {
          const budgetType = values[7] === 'custom' ? 'custom' : 'group';

          newEmployees.push({
            id: crypto.randomUUID(),
            firstName: values[0],
            lastName: values[1],
            email: values[2],
            payrollId: values[3] || undefined,
            internalReference: values[4] || undefined,
            costCenter: values[5] || undefined,
            language: (values[6] as any) || 'en',
            budgetType,
            groupName: budgetType === 'group' ? values[8] : undefined,
            customBudgetAmount: budgetType === 'custom' && values[9] ? parseFloat(values[9]) : undefined,
            customBudgetPeriod: budgetType === 'custom' && values[10] ? (values[10] as any) : 'monthly',
          });
        }
      }

      const updatedEmployees = [...employees, ...newEmployees];
      setEmployees(updatedEmployees);

      // Save to backend
      await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName: '👥 Employees',
          fieldKey: 'employees_list',
          fieldValue: JSON.stringify(updatedEmployees),
          fieldType: 'text',
        }),
      });

      setUploadStatus('success');
      setTimeout(() => {
        setUploadStatus('idle');
        setCsvFile(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to parse CSV:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Employee Management</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add employees manually or import them via CSV file
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setMode('manual')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'manual'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserPlus className="w-4 h-4 inline mr-2" />
          Add Manually
        </button>
        <button
          onClick={() => setMode('csv')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'csv'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Import CSV
        </button>
      </div>

      {/* Manual Mode */}
      {mode === 'manual' && (
        <div className="border border-border rounded-xl p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Adding an employee</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your employee's first and last name and email address, and they will receive an invitation to enter their personal information.
          </p>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (errors.firstName) setErrors({ ...errors, firstName: '' });
                }}
                placeholder="First name"
                className={`w-full px-4 py-3 border rounded-lg text-sm ${
                  errors.firstName
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-input bg-background'
                }`}
              />
              {errors.firstName && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  if (errors.lastName) setErrors({ ...errors, lastName: '' });
                }}
                placeholder="Last name"
                className={`w-full px-4 py-3 border rounded-lg text-sm ${
                  errors.lastName
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-input bg-background'
                }`}
              />
              {errors.lastName && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="Email address"
                className={`w-full px-4 py-3 border rounded-lg text-sm ${
                  errors.email
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-input bg-background'
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Payroll ID */}
            <input
              type="text"
              value={formData.payrollId || ''}
              onChange={(e) => setFormData({ ...formData, payrollId: e.target.value })}
              placeholder="Payroll ID (optional)"
              className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm"
            />

            {/* Internal Reference */}
            <input
              type="text"
              value={formData.internalReference || ''}
              onChange={(e) => setFormData({ ...formData, internalReference: e.target.value })}
              placeholder="Internal reference (optional)"
              className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm"
            />

            {/* Cost Center */}
            <input
              type="text"
              value={formData.costCenter || ''}
              onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
              placeholder="Cost center (optional)"
              className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm"
            />

            {/* Language */}
            <select
              value={formData.language || 'en'}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
              className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="nl">Dutch</option>
              <option value="de">German</option>
            </select>

            {/* Budget Configuration */}
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Budget Configuration
              </label>

              {/* Budget Type Selection */}
              <div className="flex gap-3">
                <label className="flex items-center gap-2 flex-1 p-3 border border-input rounded-lg cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="radio"
                    name="budgetType"
                    value="group"
                    checked={formData.budgetType === 'group'}
                    onChange={(e) => setFormData({ ...formData, budgetType: 'group', customBudgetAmount: undefined })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Assign to Group</span>
                </label>
                <label className="flex items-center gap-2 flex-1 p-3 border border-input rounded-lg cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="radio"
                    name="budgetType"
                    value="custom"
                    checked={formData.budgetType === 'custom'}
                    onChange={(e) => setFormData({ ...formData, budgetType: 'custom', groupName: '' })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Custom Budget</span>
                </label>
              </div>

              {/* Show Budget Group Dropdown if "group" is selected */}
              {formData.budgetType === 'group' && budgetGroups.length > 0 && (
                <select
                  value={formData.groupName || ''}
                  onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                  className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm"
                >
                  <option value="">Select budget group</option>
                  {budgetGroups.map(group => (
                    <option key={group.id} value={group.name}>{group.name}</option>
                  ))}
                </select>
              )}

              {/* Show Custom Budget Fields if "custom" is selected */}
              {formData.budgetType === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Budget Amount (€)</label>
                    <input
                      type="number"
                      value={formData.customBudgetAmount || ''}
                      onChange={(e) => setFormData({ ...formData, customBudgetAmount: parseFloat(e.target.value) })}
                      placeholder="400"
                      className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Period</label>
                    <select
                      value={formData.customBudgetPeriod || 'monthly'}
                      onChange={(e) => setFormData({ ...formData, customBudgetPeriod: e.target.value as any })}
                      className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    payrollId: '',
                    internalReference: '',
                    costCenter: '',
                    language: 'en',
                    groupName: '',
                  });
                  setErrors({});
                }}
                className="px-6 py-3 border-2 border-muted text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Mode */}
      {mode === 'csv' && (
        <div className="border border-border rounded-xl p-6 bg-card space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Import from CSV</h3>
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with employee information. Download our template to get started.
            </p>
          </div>

          {/* Download Template Button */}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </button>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Click to upload CSV file</p>
                <p className="text-sm text-muted-foreground mt-1">or drag and drop</p>
              </div>
            </label>

            {uploadStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400 text-sm">
                ✓ Employees imported successfully!
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-700 dark:text-red-400 text-sm">
                ✗ Failed to import CSV. Please check the file format.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employee List */}
      {employees.length > 0 && (
        <div className="border border-border rounded-xl p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Added Employees ({employees.length})
          </h3>
          <div className="space-y-2">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                  <div className="flex gap-2 mt-1">
                    {employee.budgetType === 'group' && employee.groupName && (
                      <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        {employee.groupName}
                      </span>
                    )}
                    {employee.budgetType === 'custom' && employee.customBudgetAmount && (
                      <span className="inline-block px-2 py-0.5 bg-green-500/10 text-green-700 dark:text-green-400 text-xs rounded">
                        Custom: €{employee.customBudgetAmount}/{employee.customBudgetPeriod}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
