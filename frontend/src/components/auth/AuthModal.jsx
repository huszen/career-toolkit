import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, Loader2, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
      onSuccess(); // Execute auto-save or callback after auth success
      onClose(); // Close Modal
    } catch (err) {
      console.error('Auth Error:', err);
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.code === 'auth/email-already-in-use' ? 'Email is already registered' : err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card-bg p-6 text-text-main shadow-2xl">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 rounded-xl p-1.5 text-text-muted hover:bg-input-bg hover:text-text-main transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h3>
            <p className="text-xs text-text-muted">Log in to save and track your job applications.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-text-muted">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-input-bg border border-border text-sm text-text-main focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-text-muted">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-input-bg border border-border text-sm text-text-main focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {error && <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-red-400 text-xs">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-text-main font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Logging in...'}
              </>
            ) : isSignUp ? (
              'Sign Up & Save Job'
            ) : (
              'Log In & Save Job'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-text-muted">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-primary font-semibold hover:underline ml-1 cursor-pointer"
          >
            {isSignUp ? 'Log In' : 'Sign Up free'}
          </button>
        </div>
      </div>
    </div>
  );
}
