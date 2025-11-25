import React from 'react';
import { AppScreen, User } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
  currentUser: User | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, currentUser }) => {
  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">SpectralHem™</h1>
          <p className="text-slate-500 text-sm">Non-invasive Estimator</p>
        </div>
        {currentUser && (
          <div onClick={() => onNavigate('family')} className="cursor-pointer flex flex-col items-end">
             <div className="w-10 h-10 bg-medical-light rounded-full flex items-center justify-center text-xl border-2 border-medical-primary">
                {currentUser.avatar}
             </div>
             <span className="text-xs text-medical-dark font-medium mt-1">{currentUser.name}</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-2 gap-4">
        {/* Main Action - Scan */}
        <button 
          onClick={() => onNavigate('scan')}
          className="col-span-2 bg-gradient-to-r from-medical-primary to-medical-secondary p-6 rounded-3xl shadow-lg shadow-cyan-200/50 text-white flex flex-col items-start hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="bg-white/20 p-3 rounded-2xl mb-4 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold">New Scan</span>
          <span className="text-cyan-50 opacity-90 text-sm mt-1">Check hemoglobin levels</span>
        </button>

        {/* Trends */}
        <button 
          onClick={() => onNavigate('trends')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow active:scale-95"
        >
           <div className="bg-violet-100 text-violet-600 p-2.5 rounded-xl mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="font-bold text-slate-800">Trends</span>
          <span className="text-slate-400 text-xs mt-1">History & Charts</span>
        </button>

        {/* Family */}
        <button 
          onClick={() => onNavigate('family')}
          className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow active:scale-95"
        >
           <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800">Family</span>
          <span className="text-slate-400 text-xs mt-1">Manage profiles</span>
        </button>
        
        {/* Settings */}
        <button 
          onClick={() => onNavigate('settings')}
          className="col-span-2 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:bg-slate-50 transition-colors active:scale-95"
        >
          <div className="bg-slate-100 text-slate-600 p-2.5 rounded-xl">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-bold text-slate-800">Settings</span>
            <span className="text-slate-400 text-xs">Preferences & Privacy</span>
          </div>
        </button>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 p-5 rounded-2xl">
        <h3 className="text-blue-800 font-semibold mb-2 text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Clinical Tip
        </h3>
        <p className="text-blue-700 text-xs leading-relaxed">
          For the most accurate results, ensure your fingers are warm and the lighting is bright and neutral. Cold hands can reduce blood flow to capillaries.
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;