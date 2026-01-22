
import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { getAIWelcomeMessage } from '../services/geminiService';
import { exportDatabase } from '../services/databaseService';

interface DashboardProps {
  user: User;
  onViewCourses: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onViewCourses }) => {
  const [greeting, setGreeting] = useState<string>('Loading personalized greeting...');
  const [isGreetingLoading, setIsGreetingLoading] = useState(true);

  useEffect(() => {
    const fetchGreeting = async () => {
      const msg = await getAIWelcomeMessage(user.name);
      setGreeting(msg);
      setIsGreetingLoading(false);
    };
    fetchGreeting();
  }, [user.name]);

  const handleExportDatabase = async () => {
    const data = await exportDatabase();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `database-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl space-y-8 animate-fadeIn py-8">
      {/* Hero Welcome Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Welcome back, {user.name.split(' ')[0]}!</h2>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-2xl">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                <i className="fas fa-robot text-indigo-600"></i>
              </div>
              <div>
                <p className="text-indigo-50 font-medium text-sm uppercase tracking-wider mb-1">AI Study Assistant Says:</p>
                <p className="text-white text-lg leading-relaxed italic">
                  "{greeting}"
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
      </section>

      {/* Grid of Features/Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={onViewCourses}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <i className="fas fa-book-open text-xl"></i>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center justify-between">
            My Courses
            <i className="fas fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-500 transition-colors"></i>
          </h3>
          <p className="text-slate-500 text-sm">You have 4 active courses this semester.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-calendar-check text-xl"></i>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">Next Class</h3>
          <p className="text-slate-500 text-sm">Control Systems at 10:00 AM (LT-2).</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <i className="fas fa-tasks text-xl"></i>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">Pending Tasks</h3>
          <p className="text-slate-500 text-sm">2 labs pending for VLSI design.</p>
        </div>
      </div>

      {/* Account Info Table */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Account Security Information</h3>
          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold uppercase">System Verified</span>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500 text-sm">User ID</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{user.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500 text-sm">Primary Email</span>
              <span className="text-slate-800 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500 text-sm">Account Created</span>
              <span className="text-slate-800 font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 text-sm">Status</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Active Student
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Export Database */}
      <div className="flex gap-4">
        <button 
          onClick={onViewCourses}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-book"></i>
          View Courses
        </button>
        <button 
          onClick={handleExportDatabase}
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-download"></i>
          Export Database (JSON)
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
