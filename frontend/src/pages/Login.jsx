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
    <div className="max-w-md mx-auto mt-16 p-6 bg-card-bg border border-border rounded-xl text-text-main shadow-md">
      <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>

      <p className="text-sm text-text-muted mb-6">
        Log in to view your career toolkit dashboard.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-text-muted">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-input-bg border border-border rounded-lg text-text-main focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-text-muted">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-input-bg border border-border rounded-lg text-text-main focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-text-main font-medium rounded-lg text-sm transition cursor-pointer"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <p className="text-xs text-text-muted mt-4 text-center">
        Need an account?{' '}
        <button
          onClick={() => onNavigate('signup')}
          className="text-primary hover:underline cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}