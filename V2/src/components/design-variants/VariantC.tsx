'use client';

import { ChevronDown, ChevronRight, CheckCircle, Circle, Home } from 'lucide-react';

export function VariantC() {
  const stages = [
    {
      id: 'setup',
      icon: '🔧',
      title: 'Setup',
      status: 'completed',
      badge: '100%',
      sections: ['Client Information'],
      expanded: false,
    },
    {
      id: 'configure',
      icon: '⚙️',
      title: 'Configure',
      status: 'current',
      badge: '2/3',
      sections: ['Client Info', 'Mobility Programs', 'Validation Rules'],
      expanded: true,
    },
    {
      id: 'launch',
      icon: '🚀',
      title: 'Launch',
      status: 'pending',
      badge: '0/1',
      sections: ['GO LIVE Planning'],
      expanded: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Stage-Grouped Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <p className="font-bold text-gray-900">Skipr Onboarding</p>
              <p className="text-xs text-gray-500">Mobility Configurator</p>
            </div>
          </div>
        </div>

        {/* Navigation Stages */}
        <nav className="flex-1 p-4 space-y-2 overflow-auto">
          {stages.map((stage, stageIndex) => (
            <div key={stage.id}>
              {/* Stage Header */}
              <button
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  stage.status === 'current'
                    ? 'bg-teal-50 border border-teal-200'
                    : stage.status === 'completed'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stage.icon}</span>
                  <div className="text-left">
                    <p
                      className={`font-semibold ${
                        stage.status === 'current'
                          ? 'text-teal-900'
                          : stage.status === 'completed'
                          ? 'text-green-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {stage.title}
                    </p>
                    <p className="text-xs text-gray-500">{stage.sections.length} sections</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      stage.status === 'current'
                        ? 'bg-teal-200 text-teal-800'
                        : stage.status === 'completed'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stage.badge}
                  </span>
                  {stage.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Sections */}
              {stage.expanded && (
                <div className="mt-2 ml-6 space-y-1">
                  {stage.sections.map((section, sectionIndex) => {
                    const isActive = section === 'Mobility Programs';
                    const isComplete = stageIndex === 0 || section === 'Client Info';

                    return (
                      <button
                        key={section}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-sm'
                            : isComplete
                            ? 'text-green-700 hover:bg-green-50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="font-medium">{section}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Divider between stages */}
              {stageIndex < stages.length - 1 && <div className="h-px bg-gray-200 my-3 mx-4" />}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2">
            <Home className="w-4 h-4" />
            Exit to Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Configure</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-teal-600">Mobility Programs</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Mobility Programs</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-5xl">
            {/* Progress Alert */}
            <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-teal-900">You're on section 2 of 3 in Configure</p>
                <p className="text-sm text-teal-700 mt-1">Next up: Validation Rules</p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              {/* Services Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Mobility Services</h2>
                  <p className="text-sm text-gray-600 mt-1">Select which services are available to employees</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {['🚲 Bike Lease', '🚗 Carpool', '🚌 Public Transport', '🛴 Kickscooter', '⛽ Fuel Card', '🅿️ Parking'].map(
                      (service) => (
                        <button
                          key={service}
                          className="p-4 border-2 border-teal-200 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors text-left"
                        >
                          <p className="text-sm font-medium text-gray-900">{service}</p>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Budget Groups Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Budget Groups</h2>
                  <p className="text-sm text-gray-600 mt-1">Define budget allocations per employee group</p>
                </div>
                <div className="p-6">
                  <button className="w-full py-3 border-2 border-dashed border-teal-300 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">
                    + Add Budget Group
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                ← Back to Client Info
              </button>
              <button className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Continue to Validation Rules →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
