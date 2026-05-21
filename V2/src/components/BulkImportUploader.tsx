'use client';

import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertTriangle, XCircle, Users, FileText } from 'lucide-react';
import type { EmployeeImport, BudgetGroup } from '@/types/configurator';

interface BulkImportUploaderProps {
  sessionId: string;
  programId: string;
  budgetGroups: BudgetGroup[];
  onImportComplete: (employees: EmployeeImport[]) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function BulkImportUploader({ sessionId, programId, budgetGroups, onImportComplete }: BulkImportUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [parsedEmployees, setParsedEmployees] = useState<EmployeeImport[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Template
  const CSV_HEADERS = [
    'first_name',
    'last_name',
    'email',
    'phone_number',
    'phone_number_country_code',
    'language',
    'gender',
    'date_of_birth',
    'place_of_birth',
    'country_of_birth',
    'nationality',
    'job_title',
    'role',
    'start_on',
    'address__street',
    'address__postal_code',
    'address__city',
    'address__country_code',
    'new_gen',
    'group_name',
    'invite_on',
    'use_physical_card',
    'internal_payroll_id',
    'cost_center',
  ];

  const downloadTemplate = () => {
    const csvContent = [
      CSV_HEADERS.join(','),
      // Example row
      [
        'John',
        'Doe',
        'john.doe@company.com',
        '123456789',
        '+32',
        'en',
        'M',
        '1990-01-15',
        'Brussels',
        'BE',
        'BE',
        'Software Engineer',
        'employee',
        '2026-06-01',
        'Rue de la Loi 1',
        '1000',
        'Brussels',
        'BE',
        'true',
        budgetGroups[0]?.name || 'Group Name Here',
        '2026-06-01',
        'true',
        'EMP001',
        'IT Department',
      ].join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validateRow = (row: any, rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Required fields
    if (!row.first_name) errors.push({ row: rowIndex, field: 'first_name', message: 'First name is required' });
    if (!row.last_name) errors.push({ row: rowIndex, field: 'last_name', message: 'Last name is required' });
    if (!row.email) errors.push({ row: rowIndex, field: 'email', message: 'Email is required' });

    // Email format
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ row: rowIndex, field: 'email', message: 'Invalid email format' });
    }

    // Language
    if (row.language && !['nl', 'fr', 'en', 'de'].includes(row.language)) {
      errors.push({ row: rowIndex, field: 'language', message: 'Language must be nl, fr, en, or de' });
    }

    // Gender
    if (row.gender && !['M', 'F', 'X'].includes(row.gender)) {
      errors.push({ row: rowIndex, field: 'gender', message: 'Gender must be M, F, or X' });
    }

    // Role
    if (row.role && !['employee', 'admin', 'super_admin'].includes(row.role)) {
      errors.push({ row: rowIndex, field: 'role', message: 'Role must be employee, admin, or super_admin' });
    }

    // Group name validation (CRITICAL)
    if (row.group_name) {
      const groupExists = budgetGroups.some(g => g.name === row.group_name);
      if (!groupExists) {
        errors.push({
          row: rowIndex,
          field: 'group_name',
          message: `Group "${row.group_name}" not found in budget groups. Available: ${budgetGroups.map(g => g.name).join(', ')}`,
        });
      }
    }

    // Date validation
    const dateFields = ['date_of_birth', 'start_on', 'invite_on'];
    dateFields.forEach(field => {
      if (row[field] && isNaN(Date.parse(row[field]))) {
        errors.push({ row: rowIndex, field, message: `Invalid date format (use YYYY-MM-DD)` });
      }
    });

    return errors;
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim();
      });
      rows.push(row);
    }

    return rows;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setValidating(true);
    setValidationErrors([]);
    setParsedEmployees([]);
    setUploadSuccess(false);

    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      // Validate all rows
      const allErrors: ValidationError[] = [];
      const employees: EmployeeImport[] = [];

      rows.forEach((row, index) => {
        const errors = validateRow(row, index + 2); // +2 because row 1 is headers, and arrays are 0-indexed
        allErrors.push(...errors);

        if (errors.length === 0) {
          employees.push({
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            phoneNumber: row.phone_number || '',
            phoneNumberCountryCode: row.phone_number_country_code || '+32',
            language: row.language || 'en',
            gender: row.gender || 'M',
            dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth) : new Date(),
            placeOfBirth: row.place_of_birth || '',
            countryOfBirth: row.country_of_birth || '',
            nationality: row.nationality || '',
            jobTitle: row.job_title || '',
            role: row.role || 'employee',
            startOn: row.start_on ? new Date(row.start_on) : new Date(),
            internalPayrollId: row.internal_payroll_id || '',
            costCenter: row.cost_center || '',
            address: {
              street: row.address__street || '',
              postalCode: row.address__postal_code || '',
              city: row.address__city || '',
              countryCode: row.address__country_code || 'BE',
            },
            newGen: row.new_gen === 'true' || row.new_gen === '1',
            groupName: row.group_name || '',
            inviteOn: row.invite_on ? new Date(row.invite_on) : new Date(),
            usePhysicalCard: row.use_physical_card === 'true' || row.use_physical_card === '1',
          });
        }
      });

      setValidationErrors(allErrors);
      setParsedEmployees(employees);
    } catch (error) {
      console.error('Failed to parse CSV:', error);
      setValidationErrors([{ row: 0, field: 'file', message: 'Failed to parse CSV file. Please check the format.' }]);
    } finally {
      setValidating(false);
    }
  };

  const handleUpload = async () => {
    if (validationErrors.length > 0) {
      alert('Please fix all validation errors before uploading');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch('/api/employees/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          programId,
          employees: parsedEmployees,
        }),
      });

      if (response.ok) {
        setUploadSuccess(true);
        onImportComplete(parsedEmployees);
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to upload employees:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Bulk Employee Import
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a CSV file to import multiple employees at once
        </p>
      </div>

      {/* Download Template */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-foreground">CSV Template</h3>
              <p className="text-sm text-muted-foreground">
                Download the template with all {CSV_HEADERS.length} required columns
              </p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>

        {budgetGroups.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-500/20">
            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-2">Available Budget Groups:</p>
            <div className="flex flex-wrap gap-2">
              {budgetGroups.map(group => (
                <span
                  key={group.id}
                  className="px-3 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                >
                  {group.name}
                </span>
              ))}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
              Use these exact names in the <code className="bg-blue-500/30 px-1 py-0.5 rounded">group_name</code> column
            </p>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          file
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer'
        }`}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {!file ? (
          <>
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">Click to upload CSV file</p>
            <p className="text-sm text-muted-foreground">or drag and drop</p>
          </>
        ) : (
          <>
            <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {parsedEmployees.length} valid employees | {validationErrors.length} errors
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setParsedEmployees([]);
                setValidationErrors([]);
                setUploadSuccess(false);
              }}
              className="mt-4 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
            >
              Choose Different File
            </button>
          </>
        )}
      </div>

      {/* Validation Results */}
      {validating && (
        <div className="bg-accent border border-border rounded-lg p-6 text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Validating CSV...</p>
        </div>
      )}

      {/* Success State */}
      {uploadSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-400">Upload Successful!</h3>
              <p className="text-sm text-green-600 dark:text-green-500">
                {parsedEmployees.length} employees have been imported successfully
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {!validating && validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">Validation Errors</h3>
              <p className="text-sm text-red-600 dark:text-red-500">
                {validationErrors.length} errors found. Please fix them before uploading.
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {validationErrors.map((error, index) => (
              <div
                key={index}
                className="bg-red-500/10 border border-red-500/20 rounded p-3 text-sm"
              >
                <span className="font-medium text-red-700 dark:text-red-400">
                  Row {error.row}, Column "{error.field}":
                </span>{' '}
                <span className="text-red-600 dark:text-red-500">{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Valid Employees Preview */}
      {!validating && parsedEmployees.length > 0 && validationErrors.length === 0 && !uploadSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-400">Ready to Import</h3>
              <p className="text-sm text-green-600 dark:text-green-500">
                {parsedEmployees.length} employees validated successfully
              </p>
            </div>
          </div>

          {/* Preview Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-green-500/20 border-b border-green-500/30">
                <tr>
                  <th className="px-3 py-2 text-left text-green-700 dark:text-green-400">Name</th>
                  <th className="px-3 py-2 text-left text-green-700 dark:text-green-400">Email</th>
                  <th className="px-3 py-2 text-left text-green-700 dark:text-green-400">Group</th>
                  <th className="px-3 py-2 text-left text-green-700 dark:text-green-400">Role</th>
                </tr>
              </thead>
              <tbody>
                {parsedEmployees.slice(0, 5).map((emp, index) => (
                  <tr key={index} className="border-b border-green-500/10">
                    <td className="px-3 py-2 text-foreground">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{emp.email}</td>
                    <td className="px-3 py-2 text-muted-foreground">{emp.groupName}</td>
                    <td className="px-3 py-2 text-muted-foreground">{emp.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedEmployees.length > 5 && (
              <p className="text-xs text-green-600 dark:text-green-500 mt-2 text-center">
                Showing 5 of {parsedEmployees.length} employees
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import {parsedEmployees.length} Employees
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
