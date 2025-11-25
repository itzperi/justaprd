import React from 'react';
import { ScanResult, AppScreen } from '../types';

interface ResultsScreenProps {
  result: ScanResult | null;
  onNavigate: (screen: AppScreen) => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onNavigate }) => {
  if (!result) return null;

  const getColor = (classification: string) => {
    switch (classification) {
      case 'Normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'Mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const statusColor = getColor(result.classification);
  const borderStatus = statusColor.split(' ').find(c => c.startsWith('border')) || 'border-slate-200';

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Image Area */}
      <div className="relative h-64 w-full bg-slate-900">
        {result.imageData && (
          <img src={result.imageData} alt="Scan" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
        <button 
          onClick={() => onNavigate('home')}
          className="absolute top-4 left-4 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 -mt-20 relative">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Estimated Hemoglobin</span>
              <h2 className="text-4xl font-bold text-slate-800 mt-1">
                {result.hemoglobin.toFixed(1)} <span className="text-lg font-normal text-slate-500">g/dL</span>
              </h2>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
              {result.classification}
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500" 
              style={{ width: '100%' }}
            ></div>
            {/* Marker */}
             <div 
               className="w-1 h-3 bg-black -mt-2.5 relative z-10 border border-white"
               style={{ 
                 marginLeft: `${Math.min(Math.max((result.hemoglobin - 6) / (18 - 6) * 100, 0), 100)}%` 
               }}
             ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-6">
            <span>6.0</span>
            <span>12.0</span>
            <span>18.0</span>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2 mb-2">
             <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-medical-primary" 
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
             </div>
             <span className="text-xs text-slate-500 font-medium">{Math.round(result.confidence * 100)}% Confidence</span>
          </div>
        </div>

        {/* Feature Breakdown */}
        <div className="mt-6">
          <h3 className="text-slate-800 font-bold mb-4">Spectral Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard title="Vascularity" score={result.features.vascularVisibility} icon="🩸" />
            <FeatureCard title="Pallor Index" score={result.features.colorimetricIndex} icon="🎨" />
            <FeatureCard title="Texture" score={result.features.texturalAnalysis} icon="🔍" />
            <FeatureCard title="Reflectance" score={result.features.spectralReflectance} icon="💡" />
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
           <h3 className="text-slate-800 font-bold mb-2">Recommendations</h3>
           <p className="text-sm text-slate-600 leading-relaxed">
             {result.classification === 'Normal' 
               ? "Your levels appear within the healthy range. Maintain a balanced diet rich in iron and vitamin C to support iron absorption."
               : "Your estimation suggests levels below the optimal range. Consider consulting a healthcare professional for a standard blood test confirmation."}
           </p>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, score, icon }: { title: string, score: number, icon: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-semibold text-slate-600">{title}</span>
    </div>
    <div className="flex items-end gap-1">
      <span className="text-xl font-bold text-medical-dark">{(score * 10).toFixed(1)}</span>
      <span className="text-xs text-slate-400 mb-1">/10</span>
    </div>
  </div>
);

export default ResultsScreen;