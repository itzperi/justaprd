import React from 'react';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-2">Settings</h1>
      </div>

      <div className="space-y-6">
        <Section title="Analysis Preferences">
          <SettingRow label="High Precision Mode" toggle active />
          <SettingRow label="Save Images Locally" toggle active={false} />
        </Section>

        <Section title="Notifications">
          <SettingRow label="Weekly Health Report" toggle active />
          <SettingRow label="Scan Reminders" toggle active />
        </Section>

        <Section title="About">
          <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
            <span className="text-slate-600">Version</span>
            <span className="text-slate-400">1.0.4 (Beta)</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
            <span className="text-slate-600">AI Model</span>
            <span className="text-slate-400">Gemini 2.5 Flash</span>
          </div>
        </Section>

        <div className="mt-8 p-4 bg-slate-100 rounded-xl">
           <p className="text-xs text-slate-500 text-center leading-relaxed">
             SpectralHem™ is a demonstration application. It is not a certified medical device. The estimates provided are for informational purposes only and should not replace professional medical advice, diagnosis, or treatment.
           </p>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <div>
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">{title}</h3>
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden px-4">
      {children}
    </div>
  </div>
);

const SettingRow: React.FC<{label: string; toggle?: boolean; active?: boolean}> = ({label, toggle, active}) => (
  <div className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
    <span className="text-slate-700 font-medium">{label}</span>
    {toggle && (
      <div className={`w-11 h-6 rounded-full relative transition-colors ${active ? 'bg-medical-primary' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : ''}`}></div>
      </div>
    )}
  </div>
);

export default SettingsScreen;