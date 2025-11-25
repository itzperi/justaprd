import React from 'react';
import { ScanResult, AppScreen } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrendsScreenProps {
  results: ScanResult[];
  onBack: () => void;
}

const TrendsScreen: React.FC<TrendsScreenProps> = ({ results, onBack }) => {
  const data = results
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(r => ({
      date: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: r.hemoglobin
    }));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-2">Health Trends</h1>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">Hemoglobin History (g/dL)</h2>
        <div className="h-64 w-full">
          {data.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  domain={[8, 18]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0891b2" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#0891b2', strokeWidth: 2, stroke: '#fff'}}
                  activeDot={{r: 6}} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Not enough data points
            </div>
          )}
        </div>
      </div>

      <h3 className="font-bold text-slate-800 mb-4 ml-1">Recent Scans</h3>
      <div className="space-y-3">
        {results.sort((a,b) => b.timestamp - a.timestamp).map(scan => (
          <div key={scan.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100">
             <div className="flex items-center gap-3">
               <div className={`w-2 h-10 rounded-full ${
                  scan.classification === 'Normal' ? 'bg-green-500' : 'bg-orange-500'
               }`}></div>
               <div>
                 <p className="font-bold text-slate-800">{scan.hemoglobin.toFixed(1)} g/dL</p>
                 <p className="text-xs text-slate-500">{new Date(scan.timestamp).toLocaleDateString()}</p>
               </div>
             </div>
             <span className={`text-xs px-2 py-1 rounded-lg ${
                scan.classification === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
             }`}>
               {scan.classification}
             </span>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center text-slate-400 py-8">No history available</div>
        )}
      </div>
    </div>
  );
};

export default TrendsScreen;