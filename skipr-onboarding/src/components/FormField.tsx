'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import type { FormFieldDefinition } from '@/lib/types';

interface FormFieldProps {
  field: FormFieldDefinition;
  sheetName: string;
  sessionId: string;
  initialValue?: string;
  onSave?: (value: string) => void;
}

export function FormField({ field, sheetName, sessionId, initialValue = '', onSave }: FormFieldProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const saveField = useCallback(async (newValue: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName,
          fieldKey: field.key,
          fieldValue: newValue,
          fieldType: field.type,
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        onSave?.(newValue);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save field:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, sheetName, field.key, field.type, onSave]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value !== initialValue) {
        saveField(value);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, initialValue, saveField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked.toString()
      : e.target.value;
    setValue(newValue);
  };

  const renderInput = () => {
    const baseClasses = "w-full px-3 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none input-focus hover:border-primary/50";

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={`${baseClasses} min-h-[100px] resize-y`}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={handleChange}
            required={field.required}
            className={baseClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.split(',').includes(option)}
                  onChange={(e) => {
                    const selected = value.split(',').filter(Boolean);
                    const newSelected = e.target.checked
                      ? [...selected, option]
                      : selected.filter(s => s !== option);
                    setValue(newSelected.join(','));
                  }}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={handleChange}
              className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm">{field.label}</span>
          </label>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={handleChange}
            required={field.required}
            className={baseClasses}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );
    }
  };

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center justify-between py-2 group">
        {renderInput()}
        <div className="ml-2 flex items-center gap-2">
          {isSaving && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              Saving
            </div>
          )}
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {field.label}
          {field.required && <span className="text-primary ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2 min-w-[60px] justify-end">
          {isSaving && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              Saving
            </div>
          )}
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
        </div>
      </div>
      {renderInput()}
      {field.description && (
        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/50 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {field.description}
        </p>
      )}
    </div>
  );
}
