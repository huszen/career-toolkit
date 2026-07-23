import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  //   const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      await login(email.trim(), password);

      onNavigate('dashboard');
    } catch (err) {
      console.error('Firebase Login Error:', err.code, err.message);
      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password. Please check your credentials.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError(`Login failed: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-md">
      <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
      <p className="text-sm text-slate-400 mb-6">Log in to view your career toolkit dashboard.</p>

      {error && <div className="mb-4 p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-300">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-300">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg text-sm transition cursor-pointer">
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Need an account?{' '}
        <button onClick={() => onNavigate('signup')} className="text-blue-400 hover:underline cursor-pointer">
          Sign Up
        </button>
      </p>
    </div>
  );
}
