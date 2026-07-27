import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithCredential } from 'firebase/auth';

export default function SignUp({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password != passwordConfirm) {
      return setError('Password do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    try {
      setError('');
      setLoading(true);

      await signUp(email.trim(), password);
      onNavigate('dashboard');
    } catch (err) {
      console.error('Firebase Sign Up Error:', err.code, err.message);

      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please log in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Must be at least 6 characters.');
          break;
        default:
          setError(`Failed to create account: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-card-bg border border-border rounded-xl text-text-main shadow-md">
      <h2 className="text-2xl font-bold mb-2">Create Account</h2>

      <p className="text-sm text-text-muted mb-6">
        Sign up to start saving and tracking your job applications.
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

        <div>
          <label className="block text-sm font-semibold mb-1 text-text-muted">
            Confirm Password
          </label>

          <input
            type="password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-2 bg-input-bg border border-border rounded-lg text-text-main focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-text-main font-medium rounded-lg text-sm transition cursor-pointer"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-xs text-text-muted mt-4 text-center">
        Already have an account?{' '}
        <button
          onClick={() => onNavigate('login')}
          className="text-primary hover:underline cursor-pointer"
        >
          Log In
        </button>
      </p>
    </div>
  );
}