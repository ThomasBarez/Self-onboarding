'use client';

import { useState } from 'react';
import { VariantA } from '@/components/design-variants/VariantA';
import { VariantB } from '@/components/design-variants/VariantB';
import { VariantC } from '@/components/design-variants/VariantC';

export default function DesignVariants() {
  const [activeVariant, setActiveVariant] = useState<'A' | 'B' | 'C'>('A');

  return (
    <div className="min-h-screen bg-background">
      {/* Variant Switcher */}
      <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Navigation Pattern:</p>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveVariant('A')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeVariant === 'A'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            A: Stepped Wizard
          </button>
          <button
            onClick={() => setActiveVariant('B')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeVariant === 'B'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            B: Timeline
          </button>
          <button
            onClick={() => setActiveVariant('C')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              activeVariant === 'C'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            C: Stages
          </button>
        </div>
      </div>

      {/* Render Active Variant */}
      {activeVariant === 'A' && <VariantA />}
      {activeVariant === 'B' && <VariantB />}
      {activeVariant === 'C' && <VariantC />}
    </div>
  );
}
