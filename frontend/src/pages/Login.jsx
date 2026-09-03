import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth authentication
    console.log('Google Auth clicked (Pending implementation)');
  };

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
    <div className="max-w-md mx-auto mt-12 p-8 bg-card-bg border border-border rounded-2xl text-text-main shadow-xl relative overflow-hidden">
      {/* Decorative Subtle Accent Light */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Icon / Branding Badge */}
      <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary shadow-sm">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-text-main">Welcome back</h2>
      <p className="text-sm text-text-muted mt-1 mb-6">Sign in to access your saved applications and career tools.</p>

      {error && (
        <div className="mb-6 p-3.5 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-input-bg border border-border rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-main font-semibold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging In...
            </span>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-border w-full"></div>
        <span className="bg-card-bg px-3 text-xs font-medium text-text-muted uppercase tracking-wider absolute">or</span>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 border border-border/80 rounded-xl text-sm font-medium text-gray-800 flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Continue with Google
      </button>

      {/* Switch Mode */}
      <p className="text-xs text-text-muted mt-6 text-center">
        Don&apos;t have an account?{' '}
        <button onClick={() => onNavigate('signup')} className="text-primary hover:underline font-semibold cursor-pointer">
          Sign Up
        </button>
      </p>
    </div>
  );
}
