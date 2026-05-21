'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface MobilityServiceSelectorProps {
  services: Array<{
    key: string;
    label: string;
  }>;
  sheetName: string;
  sessionId: string;
  fieldValues: Record<string, string>;
  onSave: (fieldKey: string, value: string) => void;
}

export function MobilityServiceSelector({ services, sheetName, sessionId, fieldValues, onSave }: MobilityServiceSelectorProps) {
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  const handleToggle = async (serviceKey: string, currentValue: string) => {
    const newValue = currentValue === 'Yes' ? 'No' : 'Yes';
    setSavingStates(prev => ({ ...prev, [serviceKey]: true }));

    try {
      const response = await fetch('/api/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sheetName,
          fieldKey: serviceKey,
          fieldValue: newValue,
          fieldType: 'select',
        }),
      });

      if (response.ok) {
        onSave(serviceKey, newValue);
      }
    } catch (error) {
      console.error('Failed to save service:', error);
    } finally {
      setTimeout(() => {
        setSavingStates(prev => ({ ...prev, [serviceKey]: false }));
      }, 300);
    }
  };

  const getServiceValue = (serviceKey: string): string => {
    return fieldValues[`${sheetName}-${serviceKey}`] || 'No';
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {services.map((service) => {
        const value = getServiceValue(service.key);
        const isSelected = value === 'Yes';
        const isSaving = savingStates[service.key];

        return (
          <button
            key={service.key}
            onClick={() => handleToggle(service.key, value)}
            className={`
              relative w-full rounded-lg px-4 py-3 transition-all text-left group
              ${isSelected
                ? 'bg-accent border border-primary/20'
                : 'bg-card border border-border hover:border-primary/30 hover:bg-accent/50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox */}
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isSelected
                  ? 'bg-primary border-primary'
                  : 'border-border group-hover:border-primary/50'
                }
              `}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>

              {/* Label */}
              <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                {service.label}
              </span>

              {/* Saving indicator */}
              {isSaving && (
                <div className="ml-auto">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
