import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import ScanScreen from './components/ScanScreen';
import ResultsScreen from './components/ResultsScreen';
import TrendsScreen from './components/TrendsScreen';
import FamilyScreen from './components/FamilyScreen';
import SettingsScreen from './components/SettingsScreen';
import { AppScreen, User, ScanResult } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [latestResult, setLatestResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    // Initialize with a default user
    const defaultUser: User = {
      id: 'user-1',
      name: 'Default User',
      age: 30,
      gender: 'other',
      avatar: '👤'
    };
    setUsers([defaultUser]);
    setCurrentUser(defaultUser);
    
    // Add some dummy history for charts
    const dummyHistory: ScanResult[] = [
      {
        id: 'scan-1',
        userId: 'user-1',
        timestamp: Date.now() - 86400000 * 5,
        hemoglobin: 11.2,
        classification: 'Mild',
        confidence: 0.88,
        features: { vascularVisibility: 0.7, colorimetricIndex: 0.75, texturalAnalysis: 0.8, spectralReflectance: 0.78 }
      },
      {
        id: 'scan-2',
        userId: 'user-1',
        timestamp: Date.now() - 86400000 * 2,
        hemoglobin: 11.5,
        classification: 'Mild',
        confidence: 0.92,
        features: { vascularVisibility: 0.72, colorimetricIndex: 0.78, texturalAnalysis: 0.82, spectralReflectance: 0.80 }
      }
    ];
    setScanResults(dummyHistory);
  }, []);

  const handleAddUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('home');
  };

  const handleScanComplete = (result: ScanResult) => {
    const resultWithUser = { ...result, userId: currentUser?.id || 'user-1' };
    setScanResults(prev => [...prev, resultWithUser]);
    setLatestResult(resultWithUser);
    setCurrentScreen('results');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} currentUser={currentUser} />;
      case 'scan':
        return <ScanScreen onComplete={handleScanComplete} onBack={() => setCurrentScreen('home')} />;
      case 'results':
        return <ResultsScreen result={latestResult} onNavigate={setCurrentScreen} />;
      case 'trends':
        return <TrendsScreen results={scanResults.filter(r => r.userId === currentUser?.id)} onBack={() => setCurrentScreen('home')} />;
      case 'family':
        return <FamilyScreen users={users} currentUser={currentUser} onAddUser={handleAddUser} onSelectUser={handleSelectUser} onBack={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {renderScreen()}
    </div>
  );
}

export default App;