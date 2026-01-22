
import React, { useState, useEffect } from 'react';
import { Page, User } from './types';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import { getUserById } from './services/databaseService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SIGN_IN);
  const [user, setUser] = useState<User | null>(null);

  
  useEffect(() => {
    const loadUser = async () => {
      const savedUserId = localStorage.getItem('auth_user_id');
      if (savedUserId) {
        const user = await getUserById(savedUserId);
        if (user) {
          setUser(user);
          setCurrentPage(Page.DASHBOARD);
        }
      }
    };
    loadUser();
  }, []);

  const handleSignIn = (userData: User) => {
    setUser(userData);
    localStorage.setItem('auth_user_id', userData.id);
    setCurrentPage(Page.DASHBOARD);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user_id');
    setCurrentPage(Page.SIGN_IN);
  };

  const navigateTo = (page: Page) => setCurrentPage(page);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => user && navigateTo(Page.DASHBOARD)}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-graduation-cap text-white"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">EduPortal</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-slate-500 font-medium">
              Hello, <span className="text-slate-900">{user.name}</span>
            </span>
            <button 
              onClick={handleSignOut}
              className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {currentPage === Page.SIGN_IN && (
          <SignIn 
            onSuccess={handleSignIn} 
            onNavigate={() => navigateTo(Page.SIGN_UP)} 
          />
        )}
        {currentPage === Page.SIGN_UP && (
          <SignUp 
            onSuccess={handleSignIn} 
            onNavigate={() => navigateTo(Page.SIGN_IN)} 
          />
        )}
        {currentPage === Page.DASHBOARD && user && (
          <Dashboard 
            user={user} 
            onViewCourses={() => navigateTo(Page.COURSES)}
          />
        )}
        {currentPage === Page.COURSES && user && (
          <Courses 
            onBack={() => navigateTo(Page.DASHBOARD)} 
          />
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} Uniwa - 2026
      </footer>
    </div>
  );
};

export default App;
