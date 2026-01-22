
import React, { useState } from 'react';
import { User } from '../types';
import { getUserByEmail } from '../services/databaseService';

interface SignInProps {
  onSuccess: (user: User) => void;
  onNavigate: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (email && password.length >= 6) {
        const existingUser = await getUserByEmail(email);
        if (existingUser && existingUser.password === password) {
          onSuccess({
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            password: existingUser.password,
            createdAt: existingUser.createdAt
          });
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        setError('Please enter a valid email and password (min 6 chars).');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500">Enter your credentials to access your student portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-envelope"></i>
            </span>
            <input 
              type="email" 
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. j.doe@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <i className="fas fa-lock"></i>
            </span>
            <input 
              type="password" 
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <>
              Sign In
              <i className="fas fa-arrow-right text-sm"></i>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account yet?{' '}
          <button 
            onClick={onNavigate}
            className="text-indigo-600 font-bold hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
