import React, { useState } from 'react';
import { User } from '../types';

interface FamilyScreenProps {
  users: User[];
  currentUser: User | null;
  onAddUser: (user: User) => void;
  onSelectUser: (user: User) => void;
  onBack: () => void;
}

const FamilyScreen: React.FC<FamilyScreenProps> = ({ users, currentUser, onAddUser, onSelectUser, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  const handleCreate = () => {
    if (!newName || !newAge) return;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newName,
      age: parseInt(newAge),
      gender: 'other',
      avatar: ['👨', '👩', '👴', '👵', '🧑'][Math.floor(Math.random() * 5)]
    };
    onAddUser(newUser);
    setIsAdding(false);
    setNewName('');
    setNewAge('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-2">Family Profiles</h1>
      </div>

      <div className="space-y-4 mb-8">
        {users.map(user => (
          <div 
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`p-4 rounded-2xl flex items-center gap-4 border transition-all cursor-pointer ${
              currentUser?.id === user.id 
                ? 'bg-white border-medical-primary shadow-md ring-1 ring-medical-primary' 
                : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center text-2xl">
              {user.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.age} years old</p>
            </div>
            {currentUser?.id === user.id && (
              <div className="w-4 h-4 rounded-full bg-medical-primary"></div>
            )}
          </div>
        ))}
      </div>

      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Profile
        </button>
      ) : (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">New Member</h3>
          <input 
            type="text" 
            placeholder="Name" 
            className="w-full p-3 bg-slate-50 rounded-xl mb-3 border-none focus:ring-2 focus:ring-medical-primary"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Age" 
            className="w-full p-3 bg-slate-50 rounded-xl mb-4 border-none focus:ring-2 focus:ring-medical-primary"
            value={newAge}
            onChange={e => setNewAge(e.target.value)}
          />
          <div className="flex gap-3">
            <button 
              onClick={() => setIsAdding(false)}
              className="flex-1 py-3 text-slate-600 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate}
              className="flex-1 py-3 bg-medical-primary text-white rounded-xl font-bold shadow-lg shadow-cyan-200"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyScreen;