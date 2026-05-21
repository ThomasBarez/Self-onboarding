'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';

export function VariantB() {
  const phases = [
    { id: 1, title: 'Client Information', status: 'completed', progress: 100 },
    { id: 2, title: 'Mobility Programs', status: 'current', progress: 60 },
    { id: 3, title: 'GO LIVE Planning', status: 'pending', progress: 0 },
  ];

  const dashboardCards = [
    { label: 'Company Profile', progress: 100, status: 'complete' },
    { label: 'Mobility Services', progress: 75, status: 'in-progress' },
    { label: 'Budget Groups', progress: 0, total: 3, status: 'pending' },
    { label: 'Validation Rules', progress: 50, status: 'in-progress' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Timeline Sidebar */}
      <aside className="w-64 bg-white border-r border-orange-200 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Georgia, serif' }}>
            Onboarding Journey
          </h2>
          <p className="text-sm text-gray-600 mt-1">Track your progress</p>
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative">
          {/* Vertical Connector Line */}
          <div className="absolute left-[15px] top-[30px] bottom-[30px] w-0.5 bg-orange-200" />

          {phases.map((phase, index) => (
            <div key={phase.id} className="relative pl-10">
              {/* Timeline Dot */}
              <div
                className={`absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  phase.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : phase.status === 'current'
                    ? 'bg-orange-500 border-orange-500 shadow-lg'
                    : 'bg-white border-gray-300'
                }`}
              >
                {phase.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : phase.status === 'current' ? (
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Phase Info */}
              <div>
                <p
                  className={`font-semibold ${
                    phase.status === 'current'
                      ? 'text-orange-700'
                      : phase.status === 'completed'
                      ? 'text-green-700'
                      : 'text-gray-400'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {phase.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        phase.status === 'completed'
                          ? 'bg-green-500'
                          : phase.status === 'current'
                          ? 'bg-orange-500'
                          : 'bg-gray-300'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{phase.progress}%</span>
                </div>

                {phase.status === 'current' && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-orange-600 font-medium">• Client Info</p>
                    <p className="text-xs text-orange-600 font-medium">• Mobility Programs ← You are here</p>
                    <p className="text-xs text-gray-400">• Validation Rules</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-800 font-medium">💡 Need Help?</p>
          <p className="text-xs text-orange-600 mt-1">Contact your CSM for guidance</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-12">
        <div className="max-w-5xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              Mobility Programs
            </h1>
            <p className="text-gray-600 mt-2">Configure your services and track progress at a glance</p>
          </div>

          {/* Dashboard Cards Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                  card.status === 'complete'
                    ? 'border-green-200'
                    : card.status === 'in-progress'
                    ? 'border-orange-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{card.label}</h3>
                  {card.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {card.status === 'in-progress' && <Clock className="w-5 h-5 text-orange-500" />}
                  {card.status === 'pending' && <Circle className="w-5 h-5 text-gray-300" />}
                </div>

                {card.total !== undefined ? (
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {card.progress}/{card.total}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">groups configured</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <p className="text-3xl font-bold text-gray-900">{card.progress}%</p>
                      <p className="text-sm text-gray-500">complete</p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          card.status === 'complete' ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Budget Configuration
            </h2>
            <p className="text-gray-600 mb-6">Define mobility allowances for different employee groups</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Standard Employees</p>
                  <p className="text-sm text-gray-600">€250/month · 45 employees</p>
                </div>
                <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">Edit</button>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                + Add Budget Group
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
