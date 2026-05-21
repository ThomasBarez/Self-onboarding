'use client';

import { CheckCircle, ChevronRight } from 'lucide-react';

export function VariantA() {
  const steps = [
    { number: 1, title: 'Client Information', completed: true },
    { number: 2, title: 'Mobility Programs', completed: false, current: true },
    { number: 3, title: 'GO LIVE Planning', completed: false },
  ];

  const currentStep = steps.find(s => s.current);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Horizontal Step Progress */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all ${
                      step.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : step.current
                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-purple-600 text-white shadow-lg scale-110'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {step.completed ? <CheckCircle className="w-6 h-6" /> : step.number}
                  </div>

                  {/* Step Label */}
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${step.current ? 'text-purple-600' : step.completed ? 'text-gray-700' : 'text-gray-400'}`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${step.current ? 'text-purple-900 font-semibold' : step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        step.completed ? 'bg-green-500 w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Large Step Indicator */}
          <div className="mt-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl font-bold text-purple-600">2</p>
              <p className="text-sm text-gray-500 mt-1">of 3 steps</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mobility Programs</h1>
          <p className="text-gray-600 mt-2">Configure your mobility services and budget allocations</p>
        </div>

        {/* Sample Content Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" placeholder="Enter company name" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                <input type="text" placeholder="BE0123456789" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Configuration</h2>
            <p className="text-sm text-gray-600 mb-4">Define budget groups for employee mobility allowances</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Add Budget Group
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            ← Previous Step
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg font-medium flex items-center gap-2">
            Next: GO LIVE Planning
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
